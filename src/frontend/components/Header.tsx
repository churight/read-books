import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import UserProfile from "../interfaces/IUserProfile";
import "../styles/Header.css"
import { logout } from "../services/logout";
import { useSearch } from "../hooks/useSearch";
//import { isAuthenticated } from "../services/isAuthenticated";
//import { fetchUserProfile } from "../hooks/useFetchProfile";
import { useAuth } from "../context/AuthContext";

const Header = ()=>{

    const navigate = useNavigate();
    const {user, setUser} = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    //const [authChecked, setAuthChecked] = useState(false)

    //useFetchProfile(setUser);

    /*useEffect(() => {
        const checkAuth = async () => {
            const auth = await isAuthenticated();
            if (auth) {
                const profile = await fetchUserProfile();
                setUser(profile);
            }
            //setAuthChecked(true);
        };
        checkAuth();
    }, []);*/

    const {
        query,
        setQuery,
        sortBy,
        setSortBy,
        order,
        setOrder,
        handleSearch,
    } = useSearch();

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
          setUser(null);
          navigate('/login');
        }
    }

    //if (!authChecked) return null;

    return (
        <header className="header">
            <div className="header-container">
                <nav className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/browse">Browse</Link>

                    <span className="search-toggle" onClick={() => setShowSearch(!showSearch)}>
                        Search ▾
                    </span>

                    {showSearch && (
                        <div className="dropdown-search">
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="Enter title, author or ISBN13"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="">No Sort</option>
                                    <option value="year">Year</option>
                                    <option value="pages">Number of Pages</option>
                                    <option value="rating">Average Rating</option>
                                </select>
                                <select value={order} onChange={(e) => setOrder(e.target.value)}>
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                                <button type="submit">Search</button>
                            </form>
                        </div>
                    )}

                    {user ? (
                        <div
                            className="profile-area"
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}
                        >
                            <span className="profile-label">Profile ▾</span>
                            {showMenu && (
                                <div className="dropdown-menu">
                                    <div className="user-info">
                                        <div><strong>{user.nickname}</strong></div>
                                        <div><small>{user.email}</small></div>
                                        <div><strong>Balance: ${user.balance?.toFixed(2) ?? '0.00'}</strong></div>
                                    </div>
                                    <Link to="/profile">Profile Info</Link>
                                    <Link to="/cart">Cart</Link>
                                    <Link to="/settings">Settings</Link>
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
    );
}

export default Header;