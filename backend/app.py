# backend/app.py

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from requests_oauthlib import OAuth1Session
from config import GPT4_API_KEY, TWITTER_API_KEY, TWITTER_API_SECRET_KEY
from tts_integration import convert_text_to_speech
import requests

app = Flask(__name__)
CORS(app)
app.secret_key = 'super secret key'

# Twitter Authentication
twitter_oauth = OAuth1Session(
    TWITTER_API_KEY,
    client_secret=TWITTER_API_SECRET_KEY,
    callback_uri='http://localhost:5000/twitter_authorized'
)

# Twitter Login Route
@app.route('/twitter_login')
def twitter_login():
    fetch_response = twitter_oauth.fetch_request_token(
        'https://api.twitter.com/oauth/request_token'
    )
    session['twitter_oauth'] = twitter_oauth
    return twitter_oauth.authorization_url('https://api.twitter.com/oauth/authenticate')

# Twitter Authorized Route
@app.route('/twitter_authorized')
def twitter_authorized():
    twitter_oauth.fetch_access_token('https://api.twitter.com/oauth/access_token')
    user_info = twitter_oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json').json()
    return jsonify({"user_info": user_info})

# GPT-4 Integration
@app.route('/generate_script', methods=['POST'])
def generate_script():
    try:
        data = request.json
        tweet_contexts = data.get('tweet_contexts', [])

        # Use the GPT-4 API to generate a script based on tweet contexts
        gpt4_url = "https://api.openai.com/v1/gpt4/generate"
        headers = {"Content-Type": "application/json", "Api-Key": GPT4_API_KEY}
        payload = {"tweet_contexts": tweet_contexts}

        response = requests.post(gpt4_url, json=payload, headers=headers)
        script = response.json().get('script', '')

        return jsonify({"script": script})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Logout Route
@app.route('/logout')
def logout():
    session.pop('twitter_oauth', None)
    return 'Logout successful'

# Your TTS API key
tts_api_key = "b34e6c0110mshe427b12739f5fdcp18829ajsnd569f257d839"

# Text-to-Speech Route
@app.route("/api/convert-to-speech", methods=["POST"])
def convert_to_speech():
    data = request.json

    if "text" not in data:
        return jsonify({"error": "Text not provided"}), 400

    text = data["text"]

    audio_content = convert_text_to_speech(text, tts_api_key)

    if audio_content:
        return jsonify({"audio_content": audio_content.decode("utf-8")})
    else:
        return jsonify({"error": "Failed to convert text to speech"}), 500

if __name__ == '__main__':
    app.run(debug=True)
