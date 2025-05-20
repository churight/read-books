import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../interfaces/IUserProfile";
import "../styles/Header.css"

const Header = ()=>{

    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    return(
        <header className="header">
             <div className = "header-container">
                 <nav className="nav-links">
                    <Link to="/browse">
                    Browse
                    </Link>
                    <Link to="/search">
                    Search
                    </Link>
                    <Link to="/login">
                    Login
                    </Link>
                    <Link to="/register">
                    Register
                    </Link>
                    <Link to="/profile">
                    Profile
                    </Link>
                    </nav>

             </div>
        </header>
    )
}

export default Header;