import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router>
    <nav>
      <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
    </nav>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App;