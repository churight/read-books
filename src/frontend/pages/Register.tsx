import React, { useState } from 'react';
import axios from 'axios';
import "../styles/LoginAndRegister.css"

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', {
        email,
        password,
        nickname,
      });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
      <div className="login-container">
      <h2>Sign up with email</h2>
      <p>Create a new account to get started</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Get Started</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;