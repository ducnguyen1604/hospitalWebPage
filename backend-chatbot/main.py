import os
import logging
import random
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS


app = Flask(__name__)

# Load environment variables
load_dotenv()
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})
client = OpenAI()
model = "gpt-3.5-turbo"


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        messages = [
            {
                "role": "system",
                "content": """
                You are the Customer Service Administrator for +CarePlus Hospital. Ensure responses are polite, informative, and supportive of patient needs. Your role is to respond to patient inquiries about hospital services, offerings, and pricing. You will provide helpful and accurate information based on the services listed below:

                1. Cardiology: Comprehensive heart care with diagnostics, treatment, and preventive care. **Price range**: 100 - 500 SGD.
                2. General Medicine: Broad medical services, from common ailments to specialized care. **Price range**: 100 - 1000 SGD.
                   - For General Medicine, **recommend specific +CarePlus doctors** based on patient needs, including specialties like cough, cold, or digestive issues. **Always introduce your recommendation by saying, "This is my recommended doctor for you."**
                3. Nursing Services: Skilled nursing care for recovery and wellness. **Price range**: 100 - 500 SGD.
                4. Laboratory Services: Full-service lab testing. **Price range**: 100 - 500 SGD.
                5. Emergency Services: 24/7 emergency response with ambulances and rapid care teams.
                6. Vaccination Programs: Vaccinations for all ages to prevent infectious diseases. **Price range**: 100 - 500 SGD.

                When responding to inquiries, provide relevant details on services, pricing, and doctor recommendations for General Medicine inquiries. Don't mention the doctor name, just say the link below is doctor I recommend for you.
                """,
            },
            {"role": "user", "content": user_message},
        ]

        response = client.chat.completions.create(
            model=model, messages=messages, temperature=0
        )

        response_message = response.choices[0].message.content
        doctor_id = random.randint(1, 3)
        doctor_uri = f"http://localhost:5173/doctors/{doctor_id:03}"
        response_message = {
            "reply": response.choices[0].message.content,
            "doctor_uri": doctor_uri,
        }

        print(response_message)

        return jsonify(response_message)

    except Exception as e:
        logging.error(f"An error occurred in /api/chat: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
