import React from "react";
import { Link } from "react-router-dom";

const Header = ()=>{
    return(
        <header>
            <Link to='/'>
            ReadBooks
            </Link>
            <nav>
                <Link to="/browse">
                Browse
                </Link>
                <Link to="/login">
                Login
                </Link>
                <Link to="/register">
                Register
                </Link>
                
            </nav>
        </header>
    )
}

export default Header;