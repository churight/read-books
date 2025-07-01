// Profile.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/isAuthenticated';
import UserProfile from '../interfaces/IUserProfile';
import handleLogout from '../services/handleLogout';
import { Link } from 'react-router-dom';
import "../styles/Profile.css"
import { useAuthGuard } from '../hooks/useAuthGuard';

interface FavouriteBooks{
    isbn13: string;
    title: string;
    authors: string[];
    thumbnail: string
}

const Profile = () => {
  useAuthGuard();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [favourites, setFavourites] = useState<FavouriteBooks[]>([]);
  const [myBooks, setMyBooks] = useState<FavouriteBooks[]>([]); //for now, later change interface
  const [wishList, setWishList] = useState<FavouriteBooks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'favourite' | 'myBooks' |'wishlist'>('favourite');

  useEffect(() => { // here there is a problem with favourites, create hook specifically for them, and honestly make it to the other file
    const fetchProfile = async () => {
      try {

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

        const wishListRes = await axios.get('http://localhost:4000/api/browse/wish-list', {withCredentials: true});
        setWishList(Array.isArray(wishListRes.data.books) ? wishListRes.data.books: [])

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

  const currentBooks = activeTab === 'favourite' ? favourites : activeTab === 'myBooks' ? myBooks : wishList;

  return (
    <div className="profile-profile-container">
      <div className="profile-sidebar">
        <h1 className="profile-welcome">Welcome {user?.nickname}</h1>
        {user?.profilePicture && (
          <div className="profile-profile-picture-container">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-profile-picture"
            />
          </div>
        )}
        <p className="profile-email">Email: {user?.email}</p>
        <button onClick={() => handleLogout(setUser, navigate)} className="profile-logout-button">Log Out</button>
      </div>
      <div className="profile-main-content">
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'favourite' ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab('favourite')}
          >
            Favourite
          </button>
          <button
            className={`profile-tab ${activeTab === 'myBooks' ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab('myBooks')}
          >
            My Books
          </button>
          <button
            className={`profile-tab ${activeTab === 'wishlist' ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
        </div>
        <div className="profile-books-section">
          {currentBooks.length === 0 ? (
            <p className="profile-no-books">You have no {activeTab === 'favourite' ? 'favourite books' : activeTab === 'myBooks' ? 'books' : 'items in your wishlist'}.</p>
          ) : (
            <ul className="profile-books-list">
              {currentBooks.map((book) => (
                <Link to={`/book/${book.isbn13}`} key={book.isbn13} className="profile-book-card">
                  <div className="profile-book-details">
                    <img src={book.thumbnail} alt={book.title} className="profile-book-thumbnail" />
                    <h2 className="profile-book-title">{book.title}</h2>
                    <p className="profile-book-author">By: {book.authors.join(', ')}</p>
                  </div>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
