import {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../interfaces/IUserProfile";
import "../styles/Header.css"
import { logout } from "../services/logout";
import { useFetchProfile } from "../hooks/useFetchProfile";

const Header = ()=>{

    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    useFetchProfile(setUser);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
          setUser(null);
          navigate('/login');
        }
    }

    return(
        <header className="header">
             <div className = "header-container">
                 <nav className="nav-links">
                    <Link to ="/">
                    Home
                    </Link>
                    <Link to="/browse">
                    Browse
                    </Link>
                    <Link to="/search">
                    Search
                    </Link>
                    {user ? (<div className="profile-area" onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
                            <span className="profile-label">Profile ▾</span>
                            {showMenu && (<div className="dropdown-menu">
                                <div className="user-info">
                                <strong>{user.nickname}</strong>
                                <small>{user.email}</small>
                                </div>
                                <Link to="/settings">Settings</Link>
                                <Link to="/favourites">Favourites</Link>
                                <Link to="/cart">Cart</Link>
                                <button onClick={handleLogout}>Log Out</button>
                            </div>
                            )}
                        </div>
                        ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                        )}
                    </nav>

             </div>
        </header>
    )
}

export default Header;