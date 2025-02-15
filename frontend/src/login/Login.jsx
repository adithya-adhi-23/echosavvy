import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [recognitionRunning, setRecognitionRunning] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  // Function to speak text
  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.voice = synthRef.current.getVoices().find(voice => voice.name.includes("Google UK English Female")) || synthRef.current.getVoices()[0];
    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech Recognition not supported.');
      speakText('Sorry, your browser does not support voice input.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log(`Recognized speech: ${transcript}`);

      if (!currentField) {
        console.error("No active field selected.");
        return;
      }

      setUserData((prev) => ({
        ...prev,
        [currentField]: transcript,
      }));

      speakText(`You entered: ${transcript}`);
      setRecognitionRunning(false); // Reset recognition state
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      speakText('Voice input failed. Please try again.');
      setRecognitionRunning(false); // Reset recognition state
    };

    recognitionRef.current = recognition;
  }, []);

  const handleFieldFocus = async (field) => {
    if (recognitionRunning) {
      console.log("Recognition already running. Stopping first...");
      recognitionRef.current.stop(); 
      setRecognitionRunning(false);
      await new Promise(resolve => setTimeout(resolve, 500)); 
    }
  
    console.log(`Starting recognition for ${field}`);
    speakText(`Please say your ${field}`);
  
    setTimeout(() => {
      if (recognitionRef.current && !recognitionRunning) {
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript.trim();
          console.log(`Recognized speech: ${transcript}`);
  
          // Set data using the provided field, instead of state variable
          setUserData((prev) => ({
            ...prev,
            [field]: transcript, 
          }));
  
          speakText(`You entered: ${transcript}`);
          setRecognitionRunning(false);
        };
  
        recognitionRef.current.start();
        setRecognitionRunning(true);
      }
    }, 500);
  };
  
  const handleButtonFocus = (message) => {
    speakText(message);
  };

  const confirmDetails = () => {
    speakText(`You entered username: ${userData.username} and password: hidden. Press login to continue.`);
  };

  const loginUser = async () => {
    recognitionRef.current?.stop();
    setLoading(true);
    setErrorMessage('');
    
    console.log("Sending login request with:", userData); // Debugging log

    try {
        const response = await axios.post('http://localhost:8082/login', { 
            username: userData.username, 
            password: userData.password 
        });

        console.log("Server response:", response.data); // Debugging log

        if (response?.data?.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/products');
        } else {
            const errorMsg = response?.data?.message || 'Login failed. Try again.';
            setErrorMessage(errorMsg);
            speakText(errorMsg);
        }
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message); // Debugging log

        const errorMsg = error.response?.data?.message || 'An error occurred. Try again.';
        setErrorMessage(errorMsg);
        speakText(errorMsg);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.pageHeading}>Echosavvy</h1>
      <div className={styles.formContainer}>
        <h2>Login</h2>
        
        <input
          type="text"
          required
          placeholder="Enter Your Username"
          value={userData.username}
          onFocus={() => handleFieldFocus('username')}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          className={styles.userPhoneInput}
        />

        <input
          type="password"
          required
          placeholder="Enter Your Password"
          value={userData.password}
          onFocus={() => handleFieldFocus('password')}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          className={styles.userPasswordInput}
        />

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <button
          className={styles.submitButton}
          onClick={() => {
            confirmDetails();
            loginUser();
          }}
          onFocus={() => handleButtonFocus('Press this button to log in.')}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <Link
          to="/signup"
          onFocus={() => handleButtonFocus('Go to Signup Page')}
        >
          <p className={styles.link}>Don't Have An Account? Signup now!</p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
