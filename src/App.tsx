import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header'; // make sure this path is correct
import Profile from './pages/Profile';
import Home from './pages/Home';
import BookInfo from './pages/BookInfo';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/book/:isbn13" element={<BookInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
