from flask import Flask, render_template, request, jsonify
from groq import Groq
import os

app = Flask(__name__)

# Read API key from environment variable
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not set in environment variables")

client = Groq(api_key=GROQ_API_KEY)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt", "")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "Return ONLY code. No explanation. No markdown."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return jsonify({
        "code": response.choices[0].message.content.strip()
    })

if __name__ == "__main__":
    app.run(debug=True)
