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


@app.route("/api", methods=['POST'])
def handle():
    text = json.loads(request.data)['text']

    # Generate and process response
    gen_response = query_to_response(text)
    results = defaultdict(int)
    for line in gen_response.split('\n'):
        for course in recommend(line, 10):
            results[course] += 1

    # Send recommendations back to frontend
    if not results:
        logger.error('No courses recommended!')
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
                       "Replies should be a bullet-point list of courses summarised in under 50 words. " +
                       "Do not hallucinate."
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
    global df, vectors

    df = pd.read_csv('Coursera.csv')
    df = df[['Course Name', 'Difficulty Level', 'Course Description']]

    # Removing spaces between the words (Lambda funtions can be used as well)
    df['Course Name'] = df['Course Name'].str.replace(' ', ',')
    df['Course Name'] = df['Course Name'].str.replace(',,', ',')
    df['Course Name'] = df['Course Name'].str.replace(':', '')
    df['Course Description'] = df['Course Description'].str.replace(' ', ',')
    df['Course Description'] = df['Course Description'].str.replace(',,', ',')
    df['Course Description'] = df['Course Description'].str.replace('_', '')
    df['Course Description'] = df['Course Description'].str.replace(':', '')
    df['Course Description'] = df['Course Description'].str.replace('(', '')
    df['Course Description'] = df['Course Description'].str.replace(')', '')

    # Adding a new tags column
    df['tags'] = df['Course Name'] + ',' + df['Difficulty Level'] + ',' + df['Course Description']
    df['tags'] = df['tags'].apply(lambda s: s.lower())
    df['tags'] = df['tags'].str.replace(',', ' ')
    df['tags'] = df['tags'].apply(stem)
    df['Course Name'] = df['Course Name'].str.replace(',', ' ')


init_recommender()


def recommend(text: str, n: int) -> List[str]:
    global df

    if df is None:
        logger.error('Recommender system not initialised!')
        return

    # Pre-process course
    tag = stem(text.replace(' ', ',').replace(',,', ',').replace(':', '').replace(',', ' ').lower())

    # Perform NLP processing
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(df['tags'].tolist() + [tag]).toarray()
    similarity = cosine_similarity(vectors)
    #print(len(similarity))
    #print(similarity.shape)
    #print(similarity)

    # Find similar courses
    #print(sorted(enumerate(similarity[-1]), reverse=True, key=lambda t: t[1]))
    courses = sorted(enumerate(similarity[-1]), reverse=True, key=lambda t: t[1])[1:min(n + 1, len(similarity))]
    return [df.loc[course[0]]['Course Name'] for course in courses]
