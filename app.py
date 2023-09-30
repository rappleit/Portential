from collections import defaultdict
import logging
import os
from typing import List

from dotenv import load_dotenv
from flask import Flask
from flask import abort, request, make_response

from nltk.stem.porter import PorterStemmer
import openai
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)


# Set up the Flask application
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000


# Configure the OpenAI API key
load_dotenv()
openai.api_key = os.getenv("REACT_APP_OPENAI_API")


# Set up recommender system
df, similarity = None, None
init_recommender()


@app.route("/api", methods=['POST'])
def handle():
    if request.method != 'POST':
        logger.error('Not post method!')
        return
    elif not request.text:
        logger.error('No text to process!')
        abort(400)

    # Generate and process response
    gen_response = query_to_response(request.text)
    results = defaultdict(int)
    for line in gen_response.split('\n'):
        for course in recommend(line, 10):
            results[course] += 1

    # Send recommendations back to frontend
    response = make_response({
        'ans': sorted(results, reverse=True, key=lambda k: results[k])[:5]
    })
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = '*'
    return response


def query_to_response(query) -> str:
    messages = [
        {
            "role": "system",
            "content": "The user is a department manager wanting to evaluate an employee's skillset. " +
                       "You are a helpful AI assistant that suggests courses to take based on the evaluation. " +
                       "Suggested courses can be online or in-person and should lead to certification upon completion. " +
                       "Replies should be a bullet-point list of courses and should not contain hyperlinks. " +
                       "Do not hallucinate. If unsure, reply as such."
        },
        {
            "role": "user",
            "content": query
        }
    ]
    chat = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    reply = chat.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    return reply


# The stemming function for NLP
def stem(text: str) -> str:
    ps = PorterStemmer()
    return " ".join(ps.stem(word) for word in text.split())


def init_recommender() -> None:
    global df, similarity

    data = pd.read_csv('Coursera.csv')
    data = data[['Course Name', 'Difficulty Level', 'Course Description', 'Skills']]

    # Removing spaces between the words (Lambda funtions can be used as well)
    data['Course Name'] = data['Course Name'].str.replace(' ',',')
    data['Course Name'] = data['Course Name'].str.replace(',,',',')
    data['Course Name'] = data['Course Name'].str.replace(':','')
    data['Course Description'] = data['Course Description'].str.replace(' ',',')
    data['Course Description'] = data['Course Description'].str.replace(',,',',')
    data['Course Description'] = data['Course Description'].str.replace('_','')
    data['Course Description'] = data['Course Description'].str.replace(':','')
    data['Course Description'] = data['Course Description'].str.replace('(','')
    data['Course Description'] = data['Course Description'].str.replace(')','')
    # Removing paranthesis from skills columns
    data['Skills'] = data['Skills'].str.replace('(','')
    data['Skills'] = data['Skills'].str.replace(')','')
    # Adding a new tags column
    data['tags'] = data['Course Name'] + data['Difficulty Level'] + data['Course Description'] + data['Skills']

    # Create a new DataFrame
    df = data[['Course Name', 'tags']]
    df['tags'] = data['tags'].str.replace(',',' ')
    df['Course Name'] = data['Course Name'].str.replace(',',' ')
    df.rename(
        columns={
            'Course Name': 'course_name'
        },
        inplace=True
    )
    df['tags'] = df['tags'].apply(lambda x: x.lower())

    cv = CountVectorizer(max_features=5000, stop_words='english')  # Text Vectorization
    vectors = cv.fit_transform(df['tags']).toarray()
    df['tags'] = df['tags'].apply(stem) # Stemming
    similarity = cosine_similarity(vectors)


def recommend(course: str, n: int) -> List[str]:
    global df, similarity

    if df is None or similarity is None:
        logger.error('Recommender system not initialised!')
        return []

    course_index = df[df['course_name'] == course].index[0]
    distances = similarity[course_index]
    m = len(distances)
    course_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x:x[1])[1:min(n + 1, m)]
    return [df.iloc[course[0]].course_name for course in course_list]
