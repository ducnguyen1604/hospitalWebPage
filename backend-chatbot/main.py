import openai
import os
import time
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
model = "gpt-3.5-turbo"

app = Flask(__name__)

# Endpoint for chatbot interaction
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # Validate input
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Create a thread with user message
        thread = openai.Thread.create(
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )
        thread_id = thread['id']

        # Create assistant
        customer_service_assis = openai.Assistant.create(
            name="Customer Service",
            instructions="Address user as 'patient'",
            model=model
        )
        assistant_id = customer_service_assis['id']

        # Run the assistant on the thread
        run = openai.Thread.run.create(
            thread_id=thread_id,
            assistant_id=assistant_id
        )

        run_id = run['id']
        
        # Wait for completion and retrieve response
        response = wait_for_run_completion(thread_id, run_id)
        return jsonify({"response": response})

    except Exception as e:
        logging.error(f"An error occurred in /api/chat: {e}")
        return jsonify({"error": str(e)}), 500


def wait_for_run_completion(thread_id, run_id, sleep_interval=5):
    """
    Waits for a run to complete and returns the assistant's response.
    :param thread_id: The ID of the thread.
    :param run_id: The ID of the run.
    :param sleep_interval: Time in seconds to wait between checks.
    :return: The assistant's response message.
    """
    while True:
        try:
            run = openai.Thread.run.retrieve(thread_id=thread_id, run_id=run_id)
            if run.get('completed_at'):
                # Retrieve messages once Run is completed
                messages = openai.Thread.messages.list(thread_id=thread_id)
                last_message = messages['data'][-1]  # Get the latest message
                response = last_message['content']
                return response
        except Exception as e:
            logging.error(f"An error occurred while retrieving the run: {e}")
            break
        logging.info("Waiting for run to complete...")
        time.sleep(sleep_interval)
    return "Error: Unable to retrieve response."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
