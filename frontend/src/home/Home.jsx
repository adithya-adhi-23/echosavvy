import React, { useEffect, useRef } from 'react';
import styles from "./Home.module.css";
import { Link } from 'react-router-dom';
import homeimg from "./home.webp";
import { AiOutlineLogin } from "react-icons/ai";

const Home = () => {
  const elementsRef = useRef([]);

  // Function to initialize speech synthesis
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.6;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis API is not supported in this browser.');
    }
  };

  // Function to handle focus and read the element's content
  const handleFocus = (index) => {
    const element = elementsRef.current[index];
    if (element) {
      const text = element.getAttribute('aria-label') || element.textContent || '';
      speakText(text.trim());
    }
  };

  // Assign focus events to interactive elements
  useEffect(() => {
    elementsRef.current = Array.from(document.querySelectorAll('[data-focusable="true"]'));
    elementsRef.current.forEach((element, index) => {
      element.addEventListener('focus', () => handleFocus(index));
    });

    // Cleanup listeners on unmount
    return () => {
      elementsRef.current.forEach((element) => {
        element.removeEventListener('focus', () => handleFocus(index));
      });
    };
  }, []);

  return (
    <div>
      <h1 className={styles.heading} tabIndex="0" aria-label="EchoSavvy: Home Page">
        EchoSavvy
      </h1>
      <Link to="/login">
        <button
          className={styles.login}
          tabIndex="0"
          data-focusable="true"
          aria-label="Login Button. Click to navigate to the login page."
        >
          <AiOutlineLogin />
          Login
        </button>
      </Link>

      <div className={styles.content}>
        <p
          className={styles.welcome}
          tabIndex="0"
          data-focusable="true"
          aria-label="Welcome to EchoSavvy! We are an e-commerce platform designed to empower and assist visually impaired users. Our platform prioritizes accessibility, usability, and inclusivity to ensure a seamless shopping experience for everyone."
        >
          Welcome to EchoSavvy! We are an e-commerce platform designed to empower and assist visually impaired users. Our platform prioritizes accessibility, usability, and inclusivity to ensure a seamless shopping experience for everyone.
        </p>
        <img
          className={styles.homeimg}
          src={homeimg}
          alt="EchoSavvy logo"
          tabIndex="0"
          data-focusable="true"
          aria-label="EchoSavvy homepage illustration."
        />
      </div>

      <div className={styles.session}>
        <p className={styles.copy} tabIndex="0" data-focusable="true" aria-label="Copyright 2025 EchoSavvy. All rights reserved.">
          &copy; 2025 EchoSavvy. All rights reserved.
        </p>
        <p className={styles.support} tabIndex="0" data-focusable="true" aria-label="For support, contact echosavvy@gmail.com">
          For support: echosavvy@gmail.com
        </p>
      </div>
    </div>
  );
};

export default Home;
