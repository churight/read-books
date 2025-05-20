// Profile.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/handleLogOut';
import { isAuthenticated } from '../services/isAuthenticated';
import UserProfile from '../interfaces/IUserProfile';

interface FavouriteBooks{
    isbn13: string;
    title: string;
    authors: string[];
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [favourites, setFavourites] = useState<FavouriteBooks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
        setFavourites(favRes.data.favouriteBooks);
      } catch (err: any) {
        console.error('Unauthorized or error fetching profile');
        //setError(err.response?.data?.message || 'Failed to load data');
        setLoading(false);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setUser(null);
      navigate('/login');
    }
  };

  if (loading) return <div>Loading...</div>;

  // Show error if something went wrong
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Welcome {user?.nickname}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Log Out</button>

       <h2 style={{ marginTop: "30px" }}>Your Favourite Books</h2>
      {favourites.length === 0 ? (
        <p>You have no favourite books.</p>
      ) : (
        <ul>
          {favourites.map((book) => (
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
