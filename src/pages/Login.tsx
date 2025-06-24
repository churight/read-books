import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/LoginAndRegister.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  //const [token, setToken] = useState('');
  const navigate = useNavigate();

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
      navigate('/browse');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
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
        <a href="#" className="forgot-password">Forgot password?</a>
        <button type="submit">Get Started</button>
      </form>
      <div className="social-login">
        <button><img src="google-icon.png" alt="Google" /></button>
        <button><img src="facebook-icon.png" alt="Facebook" /></button>
        <button><img src="apple-icon.png" alt="Apple" /></button>
      </div>
      <p>{message}</p>
    </div>
  )
};

export default Login;