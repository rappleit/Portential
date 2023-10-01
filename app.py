from collections import defaultdict
import logging
import os
from typing import List

from dotenv import load_dotenv
from flask import Flask, json, make_response, request
from flask_cors import CORS

from nltk.stem.porter import PorterStemmer
import openai
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)


# Set up the Flask application
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
CORS(app)


# Configure the OpenAI API key
load_dotenv()
openai.api_key = os.getenv("REACT_APP_OPENAI_API")


# Set up recommender system
df = None
cv = CountVectorizer(max_features=5000, stop_words='english')
ps = PorterStemmer()
default_response = '[{"skill": "Skill Map", "dependsOn": null},{"skill": "Self Management", ' + \
                   '"dependsOn": "Skill Map"},{"skill": "Managing Stress", "dependsOn": "Skill Map"},' + \
                   '{"skill": "Self Awareness", "dependsOn": "Self Management"}]'


@app.route("/api", methods=['POST'])
def handle():
    text = json.loads(request.data)['text']

    # Generate and process response
    gen_response = query_to_response(text)
    print(gen_response)
    try:
        gen_json = json.loads(gen_response)
    except:
        logger.warning('gen_response is invalid JSON')
        gen_json = json.loads(default_response)

    results = defaultdict(float)
    for skill in gen_json:
        if skill.get('skill', 'Skill Map') == 'Skill Map':
            continue
        for course, similarity in recommend(skill.get('skill'), 10):
            results[course] += similarity

    courses = []
    for course in sorted(results, reverse=True, key=lambda k: results[k])[:5]:
        courses.append({
            'Course Name': df.loc[course]['Course Name'],
            'Difficulty Level': df.loc[course]['Difficulty Level'],
            'Course URL': df.loc[course]['Course URL']
        })

    # Send recommendations back to frontend
    if not results or not courses:
        logger.error('No courses recommended!')
    response = make_response({
        'roadmap': gen_response,
        'courses': json.dumps(courses)
    })
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = '*'
    return response


def query_to_response(query) -> str:
    messages = [
        {
            "role": "system",
            "content": "The user is a manager of a company who will prompt you with the evaluation of an employee. " +
                       "Based on the evaluation, generate a skill roadmap for the employee. " +
                       "Your response must obey the following rules:" +
                       "- Collapse your response in one line" +
                       "- List each skill as a JSON string with the 'skill' key storing the title of the skill " +
                            "and the 'dependsOn' key storing the parent skill title" +
                       "- Concatenate all skills together into a list and label it as 'skillsAndDependencies'" +
                       "- The first listed skill should have a skill title of 'Skill Map' and dependsOn null" +
                       "- No blank skill titles and dependsOn fields" +
                       "- No duplicate skill titles or additional fields other than 'skill' and 'dependsOn'" +
                       "- Each skill should be a logical subset of its parent skill, except for when the parent skill is 'Skill Map'" +
                       "- Each dependsOn field should be the title of an existing skill in the roadmap" +
                       "- Minimum of 10 skills and maximum of 15 skills" +
                       "- Only include the list in your response, follow the sample response strictly" +
                       "- Sample response:" +
                            'const skillsAndDependencies = [{"skill": "Skill Map", "dependsOn": null},{"skill": "Self Management", ' +
                            '"dependsOn": "Skill Map"},{"skill": "Managing Stress", "dependsOn": "Skill Map"},' +
                            '{"skill": "Self Awareness", "dependsOn": "Self Management"}];'
        },
        {
            "role": "user",
            "content": query
        }
    ]

    # Query ChatGPT for response
    chat = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    reply = str(chat.choices[0].message.content)
    messages.append({"role": "assistant", "content": reply})

    # Process response: filter out the JSON list from the rest of the response
    try:
        response = reply[reply.index('['):reply.index('];') + 1].replace('\n', '').replace('  ', '')
    except ValueError:
        response = default_response
    finally:
        return response


# The stemming function for NLP
def stem(text: str) -> str:
    global ps

    return " ".join(ps.stem(word) for word in text.split())


def init_recommender() -> None:
    global df

    df = pd.read_csv('Coursera.csv')

    # Removing spaces between the words
    df['Formatted Name'] = df.loc[:, 'Course Name']
    df['Formatted Name'] = df['Formatted Name'].str.replace(' ', ',')
    df['Formatted Name'] = df['Formatted Name'].str.replace(',,', ',')
    df['Formatted Name'] = df['Formatted Name'].str.replace(':', '')
    df['Formatted Description'] = df.loc[:, 'Course Description']
    df['Formatted Description'] = df['Formatted Description'].str.replace(' ', ',')
    df['Formatted Description'] = df['Formatted Description'].str.replace(',,', ',')
    df['Formatted Description'] = df['Formatted Description'].str.replace('_', '')
    df['Formatted Description'] = df['Formatted Description'].str.replace(':', '')
    df['Formatted Description'] = df['Formatted Description'].str.replace('(', '')
    df['Formatted Description'] = df['Formatted Description'].str.replace(')', '')

    # Combining column data
    df['tags'] = df['Formatted Name'] + ',' + df['Difficulty Level'] + ',' + df['Formatted Description']
    df['tags'] = df['tags'].apply(lambda s: s.lower())
    df['tags'] = df['tags'].str.replace(',', ' ')
    df['tags'] = df['tags'].apply(stem)


init_recommender()


def recommend(text: str, n: int) -> List[str]:
    global df, cv

    if df is None:
        logger.error('Recommender system not initialised!')
        return

    # Pre-process course
    tag = stem(text.replace(' ', ',').replace(',,', ',').replace(':', '').replace('_', '').
               replace('(', '').replace(')', '').replace(',', ' ').lower())

    # Perform NLP processing
    vectors = cv.fit_transform(df['tags'].tolist() + [tag]).toarray()
    similarity = cosine_similarity(vectors)
    #print(len(similarity))
    #print(similarity.shape)
    #print(similarity)

    # Find similar courses
    #print(sorted(enumerate(similarity[-1]), reverse=True, key=lambda t: t[1]))
    return sorted(enumerate(similarity[-1]), reverse=True, key=lambda t: t[1])[1:min(n + 1, len(similarity))]
