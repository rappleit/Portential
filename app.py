import os
import openai
from flask import Flask
from flask import abort, request, make_response

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
openai.api_key = os.getenv("AI_TOKEN")


@app.route("/api", methods=['POST'])
def handle():
    if request.method != 'POST':
        return
    elif not request.text:
        print('No text to process!')
        abort(400)

    response = make_response({
        'ans': query_to_response(request.text)
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
        model="gpt-3.5-turbo", messages=messages
    )
    reply = chat.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    return reply
