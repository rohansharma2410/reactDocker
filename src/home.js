import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "./apifile"; 
import "./style.css";
import Navbar from "./navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'; // Import icons
import logo from './assets/image/logo.png'; // Import your logo
const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMobileNumber, setSignupMobileNumber] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [savePassword, setSavePassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = localStorage.getItem('credentials');
    if (savedCredentials) {
      const { username, password } = JSON.parse(savedCredentials);
      setUsername(username);
      setPassword(password);
      setSavePassword(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { access_token, user_id, role } = await login(username, password);
      console.log("Login successful! Access Token:", access_token);
      console.log("User ID:", user_id);
      console.log("User Role:", role);  

      if (savePassword) {
        localStorage.setItem('credentials', JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem('credentials');
      }
      navigate('/logscreen');
    } catch (error) {
      console.error("Login failed:", error.message);
      setLoginError('Login failed. Please check your username and password.');
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      await signup(signupUsername, signupPassword, signupMobileNumber, signupEmail);
      setSignupSuccess('Signup successful! You can now log in.');
      setShowModal(false);
    } catch (error) {
      console.error("Signup failed:", error.message);
      setSignupError('Signup failed. Please try again.');
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div   style={{ 
      backgroundImage: `url(${require('./assets/image/background.png')})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      height: '100vh', // Ensures it covers the full view height
      display: 'flex', // Center the card if needed
      justifyContent: 'center',
      alignItems: 'center',
    }}>

      <div className="container">
        <div className="login-card">
        <img src={logo} alt="Logo" className="logo" />

          <h1 style={{
  fontFamily: 'Poppins',
  fontSize: '20.87px',
  fontWeight: '700',
  lineHeight: '31.31px',
  textAlign: 'left'
}}> API's Dashboard</h1>
          <p>Enter your login credentials</p>
          <form  onSubmit={handleLogin}>
            <label style={{fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500'}}>
              Username:
              <div className="input-container">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="input-with-icon"
                />
              </div>
            </label>
            <label style={{fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500'}}>
              Password:
              <div className="input-container"> 
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input-with-icon"
                />
              </div>
            </label>
            <div className="save-password">
              <input
                type="checkbox"
                checked={savePassword}
                onChange={(e) => setSavePassword(e.target.checked)}
              />
              <label>Save Password</label>
            </div>
            <input type="submit" value="Log in" />
            {loginError && <p className="error-message">{loginError}</p>}
            {signupSuccess && <p className="success-message">{signupSuccess}</p>}
          </form>
          {/* <p>
            Don't have an account? <a onClick={toggleModal}>Sign up here</a>
          </p> */}
        </div>
{/* ----------------------------------------------------------- signup modal---------------------------------------------------------------- */}
        {/* {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleModal}>&times;</span>
              <h2>Sign Up</h2>
              <form onSubmit={handleSignup}>
                <label>
                  Username:
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                  />
                </label>
                <label>
                  Password:
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </label>
                <label>
                  Mobile Number:
                  <input
                    type="number"
                    value={signupMobileNumber}
                    onChange={(e) => setSignupMobileNumber(e.target.value)}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </label>
                <input type="submit" value="Sign Up" />
              </form>
              {signupError && <p className="error-message">{signupError}</p>}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Home;
