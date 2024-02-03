# tts_integration.py
import requests

def convert_text_to_speech(text, api_key):
    url = "https://voicerss-text-to-speech.p.rapidapi.com/"
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Host": "voicerss-text-to-speech.p.rapidapi.com",
        "X-RapidAPI-Key": api_key,
    }

    payload = {
        "c": "mp3",
        "f": "8khz_8bit_mono",
        "src": text,
    }

    response = requests.post(url, headers=headers, data=payload)

    if response.status_code == 200:
        return response.content
    else:
        # Handle error here
        return None
