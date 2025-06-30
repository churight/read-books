import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './frontend/pages/Register';
import Login from './frontend/pages/Login';
import Header from './frontend/components/Header'; 
import Profile from './frontend/pages/Profile';
import Browse from './frontend/pages/Browse';
import BookInfo from './frontend/pages/BookInfo';
import Welcome from './frontend/pages/Welcome';
import Home from './frontend/pages/Home';
import { Search } from './frontend/pages/Search';
import { CartPage } from './frontend/pages/Cart';
import { Settings } from './frontend/pages/Settings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className='content'>
          <Routes>
            <Route path='/' element={<Welcome />}/>
            <Route path='/home' element={<Home/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />}/>
            <Route path="/browse" element={<Browse />}/>
            <Route path="/book/:isbn13" element={<BookInfo />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<CartPage />}/>
            <Route path="/settings" element={<Settings />}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
