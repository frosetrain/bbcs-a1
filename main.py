from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from os import environ
import google.generativeai as genai

load_dotenv()
app = FastAPI()
origins = ["http://127.0.0.1:5500"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_question():
    response = chat_session.send_message(
        "I want you to generate a VERY short and simple logic puzzle, ensure it's clear and has ZERO assumptions. Write the question statement, then say '--END OF QUESTION--'. Then list four options in a list, exactly in the form of '[n] Option Name' for every option index n. Then, say the actual answer exactly like this: '{ANSWER} [n] name', where n is the index of the correct option and name is the name of the option. Then, finish your output by giving an explanation for why n is the answer to the question, with the {EXPLANATION} tag. Say nothing else, do not insert any additional heading or markdown. Be as creative as possible. If you later found out that your answer is flawed, you can redo again by creating another section {REDO ANSWER} and {REDO EXPLANATION}, if you had not made any error, you don't have to redo."
    )
    resp = response.text.split("\n")
    print(resp)
    question = resp[0].strip()
    options = []
    answer = None
    explanation = None

    explanation_start = 0

    for i, line in enumerate(resp):
        if line and line[0] == "[" and line[2] == "]":
            options.append((int(line[1]), line[4:].strip()))
        elif line.startswith("{ANSWER}"):
            answer = (int(line[10]), line[13:].strip())
        elif line.startswith("{EXPLANATION}"):
            explanation_start = i
    explanation = "\n".join(resp[explanation_start:])
    if not all((question, options, answer, explanation)):
        print("oops")
        return
    return {"question": question, "options": options, "answer": answer, "explanation": explanation}


@app.get("/")
def api_question():
    return get_question()


genai.configure(api_key=environ["GEMINI_API_KEY"])
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)
chat_session = model.start_chat()
