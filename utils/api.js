// utils/api.js

import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

export const generateScript = async (tweetContexts) => {
  try {
    const response = await axios.post('/api/generate_script', { tweetContexts });
    return response.data;
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
};

export const convertTextToSpeech = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/convert-to-speech`, { text });
    return response.data.audio_content;
  } catch (error) {
    console.error("Error converting text to speech", error);
    return null;
  }
};
