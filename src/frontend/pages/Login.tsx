import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/LoginAndRegister.css"
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../hooks/useFetchProfile';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  //const [token, setToken] = useState('');
  const navigate = useNavigate();

  const {setUser} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      }, {
        withCredentials: true
      });
      console.log('Login response:', res.data);
      setMessage('Login successful');
      const profile = await fetchUserProfile();
      if (profile) {
        setUser(profile);  
      }

      navigate('/home');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/google-login', {
        token: credentialResponse.credential,
      }, {
        withCredentials: true,
      });
      setMessage('Google login successful');
      navigate('/browse');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleLoginError = () => {
    setMessage('Google login failed');
  };

  return (
   <div className="login-container">
      <h2>Sign in with email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
        <button type="submit">Get Started</button>
      </form>
      <div className="social-login">
        <div className="social-login">
        <GoogleOAuthProvider clientId="66404395002-uhm6l689hlrqp8qeaa7nokav6qd6kn0t.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </GoogleOAuthProvider>
      </div>
      </div>
      <p>{message}</p>
    </div>
  )
};

export default Login;