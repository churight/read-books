import React, { useState } from 'react';
//import axios from 'axios';
import { useForgotPassword } from '../hooks/useForgotPassword';
//import "../styles/ForgotPassword.css"; // optional styling

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { sendReset } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultMessage = await sendReset(email);
    setMessage(resultMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="forgot-password-form">
      <h3>Forgot Password</h3>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Temporary Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};
