import {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../interfaces/IUserProfile";
import "../styles/Header.css"
import { logout } from "../services/logout";
import { useFetchProfile } from "../hooks/useFetchProfile";
import { useSearch } from "../hooks/useSearch";

const Header = ()=>{

    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    useFetchProfile(setUser);

    const {
        query,
        setQuery,
        results,
        loading,
        message,
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
                        {loading && <p>Loading...</p>}
                        {message && <p>{message}</p>}
                        {results.length > 0 && (
                            <ul className="search-results">
                            {results.map((book) => (
                                <li key={book.isbn13}>
                                <strong>{book.title}</strong> by {book.authors.join(", ")}
                                </li>
                            ))}
                            </ul>
                        )}
                        </div>
                    )}
                    {user ? (<div className="profile-area" onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
                            <span className="profile-label">Profile ▾</span>
                            {showMenu && (<div className="dropdown-menu">
                                <div className="user-info">
                                <strong>{user.nickname}</strong>
                                <small>{user.email}</small>
                                </div>
                                <Link to ="/profile">Profile Info</Link>
                                <Link to="/my-books">My Books</Link>
                                <Link to="/favourites">Favourites</Link>
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
    )
}

export default Header;