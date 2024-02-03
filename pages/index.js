// pages/index.js

import Head from 'next/head';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { generateScript, convertTextToSpeech } from '../utils/api'; // Update with your actual path
import styles from '../styles/styles.module.css';

const Home = () => {
  const { data: session } = useSession();
  const [selectedTweets, setSelectedTweets] = useState([]);
  const [generatedScript, setGeneratedScript] = useState('');
  const [audioContent, setAudioContent] = useState(null);

  const handleChooseTweets = (tweetId) => {
    // Toggle selected tweets
    const newSelectedTweets = selectedTweets.includes(tweetId)
      ? selectedTweets.filter((id) => id !== tweetId)
      : [...selectedTweets, tweetId];

    setSelectedTweets(newSelectedTweets);
  };

  const handleGenerateScript = async () => {
    try {
      const result = await generateScript(selectedTweets);
      setGeneratedScript(result.script);

      // Convert generated script to speech
      const audio = await convertTextToSpeech(result.script);
      setAudioContent(audio);
    } catch (error) {
      console.error('Error generating script:', error);
    }
  };

  return (
    <div>
      <Head>
        <title>VoiceOvr - Turn Podcasts to Tweets Instantly</title>
      </Head>

      <main>
        <h1 className={styles.header}>VoiceOvr</h1>
        <h3 className={styles.subheader}>Turn Podcasts to Tweets Instantly</h3>

        {!session ? (
          <div>
            <p>Please sign in with Twitter</p>
            <button className={styles.signInButton} onClick={() => signIn('twitter')}>
              Sign in with Twitter
            </button>
          </div>
        ) : (
          <div className={styles.flexContainer}>
            {/* Left Container - Feed of Users' Most Recent Tweets */}
            <div className={styles.leftContainer}>
              <h2>Your Recent Tweets</h2>
              <ul>
                {/* Mock data, replace with actual tweets */}
                {[1, 2, 3, 4, 5].map((tweetId) => (
                  <li
                    key={tweetId}
                    className={`${styles.tweetItem} ${
                      selectedTweets.includes(tweetId) ? styles.selectedTweet : ''
                    }`}
                    onClick={() => handleChooseTweets(tweetId)}
                  >
                    Tweet {tweetId}
                  </li>
                ))}
              </ul>
              <button className={styles.generateButton} onClick={handleGenerateScript}>
                Generate Script
              </button>
            </div>

            {/* Center Container - Audio Playback */}
            {audioContent && (
              <div className={styles.centerContainer}>
                <h2>Audio Playback</h2>
                <audio controls>
                  <source src={`data:audio/mp3;base64,${audioContent}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Right Container - Generated Script */}
            <div className={styles.rightContainer}>
              <h2>Generated Script</h2>
              <p className={styles.generatedScript}>{generatedScript}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
