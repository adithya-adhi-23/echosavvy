import React from 'react';
import styles from "./Home.module.css";
import { Link } from 'react-router-dom';
import homeimg from "./home.webp";
import { AiOutlineLogin } from "react-icons/ai";
const Home = () => {
  return (
    <div>
      <h1 className={styles.heading}>EchoSavvy</h1>
      <Link to="/login">
        <button className={styles.login}>
        <AiOutlineLogin />
          Login</button>
      </Link>
      
      <div className={styles.content}>
        <p className={styles.welcome}>
          Welcome to EchoSavvy! We are an e-commerce platform designed to empower and assist visually impaired users. Our platform prioritizes accessibility, usability, and inclusivity to ensure a seamless shopping experience for everyone.
        </p>
        <img className={styles.homeimg} src={homeimg} alt="suresh" />
      </div>
      
      <div className={styles.session}>
        <p className={styles.copy}>&copy; 2025 EchoSavvy. All rights reserved.</p>
        <p className={styles.support}>For support: echosavvy@gmail.com</p>
      </div>
    </div>
  );
};

export default Home;
