from flask import Flask, render_template, request, jsonify
from llama_cpp import Llama
import os

app = Flask(__name__)

# Load the LLaMA model
model_path = os.path.join("model", "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf")

try:
    llm = Llama(
        model_path=model_path,
        n_ctx=512,
        n_threads=os.cpu_count() or 4,
    )
except Exception as e:
    llm = None
    print("unable to load LLaMA model:", e)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    if llm is None:
        return jsonify({"response": "Model not loading. Please check your server logs."})

    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"response": " Please enter a message."})

    
    prompt = (
        "I am CareBot, a friendly and intelligent AI assistant here to help with anything and everything.\n"
        f"User: {user_message}\n"
        "Assistant:"
    )

    try:
        
        output = llm(prompt, max_tokens=200, stop=["User:", "Assistant:", "</s>"])
        response = output["choices"][0]["text"].strip()

        
        if response.lower().startswith("assistant:"):
            response = response[len("assistant:"):].strip()

       
        response = response.strip(" \n\t\"")

    except Exception as e:
        print(" Model error:", e)
        response = " Sorry, cannot generate."

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
