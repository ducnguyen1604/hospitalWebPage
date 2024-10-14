import os
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS


app = Flask(__name__)

# Load environment variables
load_dotenv()
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})

# Initialize OpenAI API key
client = OpenAI()
model = "gpt-3.5-turbo"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')

        # Validate input
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Send the user message to OpenAI API
        messages = [
            {"role": "system", "content": 'You answer question about Web services.'},
            {"role": "user", "content": user_message},  # Use the actual user message here
        ]
        
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0
        )

        # Extract the assistant's response
        response_message = response.choices[0].message.content


        # Prepare the response data
        response_message = {
        'reply': response.choices[0].message.content,
        'doctor_uri': 'http://localhost:5173/doctors/02',
        }

        print(response_message )



        return jsonify(response_message)
        

    except Exception as e:
        logging.error(f"An error occurred in /api/chat: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
