import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header'; // make sure this path is correct
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import BookInfo from './pages/BookInfo';
import { Search } from './pages/Search';
import Home from './pages/Welcome';
import { CartPage } from './pages/Cart';
import { Settings } from './pages/Settings';
import Recommendations from './pages/Home';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/home' element={<Recommendations/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/browse" element={<Browse />}/>
        <Route path="/book/:isbn13" element={<BookInfo />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<CartPage />}/>
        <Route path="/settings" element={<Settings />}/>
      </Routes>
    </Router>
  );
}

export default App;
