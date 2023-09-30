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
    global df, vectors

    df = pd.read_csv('Coursera.csv')
    df = df[['Course Name', 'Difficulty Level', 'Course Description']]

    # Removing spaces between the words (Lambda funtions can be used as well)
    df['Course Name'].replace(' ', ',', inplace=True)
    df['Course Name'].replace(',,', ',', inplace=True)
    df['Course Name'].replace(':', '', inplace=True)
    df['Course Description'].replace(' ', ',', inplace=True)
    df['Course Description'].replace(',,', ',', inplace=True)
    df['Course Description'].replace('_', '', inplace=True)
    df['Course Description'].replace(':', '', inplace=True)
    df['Course Description'].replace('(', '', inplace=True)
    df['Course Description'].replace(')', '', inplace=True)

    # Adding a new tags column
    df['tags'] = df['Course Name'] + df['Difficulty Level'] + df['Course Description']
    df['tags'].replace(',', ' ', inplace=True)
    df['tags'] = df['tags'].apply(lambda s: s.lower())

    # Create a new DataFrame
    df = df[['Course Name', 'tags']]


init_recommender()


def recommend(text: str, n: int) -> List[str]:
    global df

    if df is None:
        logger.error('Recommender system not initialised!')
        return

    # Pre-process course
    tag = text.replace(' ', ',').replace(',,', ',').replace(':', '').replace(',', ' ').lower()
    df.loc[len(df)] = ['-', tag]

    # Perform NLP processing
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(df['tags']).toarray()
    df['tags'] = df['tags'].apply(stem)
    similarity = cosine_similarity(vectors)

    # Find similar courses
    course_index = df[df['Course Name'] == '-'].index[0]
    distances = similarity[course_index]
    m = len(distances)
    course_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x:x[1])[1:min(n + 1, m)]  # Exclude the dummy course
    return [df.iloc[course[0]]['Course Name'] for course in course_list]
