// Profile.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/isAuthenticated';
import UserProfile from '../interfaces/IUserProfile';
import handleLogout from '../services/handleLogout';
import { Link } from 'react-router-dom';

interface FavouriteBooks{
    isbn13: string;
    title: string;
    authors: string[];
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [favourites, setFavourites] = useState<FavouriteBooks[]>([]);
  const [myBooks, setMyBooks] = useState<FavouriteBooks[]>([]); //for now, later change interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => { // here there is a problem with favourites, create hook specifically for them, and honestly make it to the other file
    const fetchProfile = async () => {
      try {
        const auth = await isAuthenticated();
        if (!auth) {
            navigate('/login');
            return;
          }
        const res = await axios.get('http://localhost:4000/api/auth/profile', {
          withCredentials: true
        });
        setUser(res.data);
        setLoading(false);
        console.log('Profile data:', res.data);

        const favRes = await axios.get('http://localhost:4000/api/browse/favourites', {
          withCredentials: true
        });
        setFavourites(Array.isArray(favRes.data.books) ? favRes.data.books : []);

        const myBooksRes = await axios.get('http://localhost:4000/api/browse/my-books', {
          withCredentials: true
        });
        setMyBooks(Array.isArray(myBooksRes.data.books) ? myBooksRes.data.books : []);
      } catch (err: any) {
        console.error('Unauthorized or error fetching profile');
        //setError(err.response?.data?.message || 'Failed to load data');
        setError(err);
        setLoading(false);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  // Show error if something went wrong
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Welcome {user?.nickname}</h1>
      <p>Email: {user?.email}</p>
      
      <button onClick={() => handleLogout(setUser, navigate)}>Log Out</button>

       <h2 style={{ marginTop: "30px" }}>Your Favourite Books</h2>
      {favourites.length === 0 ? (
        <p>You have no favourite books.</p>
      ) : (
        <ul>
          {favourites.map((book) => (
            <Link to={`/book/${book.isbn13}`} key={book.isbn13} className="book-card">
                <div className="book-details">
                    <h2>{book.title}</h2>
                    <p>By: {book.authors.join(', ')}</p>
                </div>
                </Link>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: "30px" }}>Your Books</h2>
      {myBooks.length === 0 ? (
        <p>You have no books.</p>
      ) : (
        <ul>
          {myBooks.map((book) => (
            <li key={book.isbn13}>
              <strong>{book.title}</strong> by {book.authors.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
