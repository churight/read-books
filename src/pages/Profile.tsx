// Profile.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/handleLogOut';

interface UserProfile {
    nickname: string;
    email: string;
  }

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/auth/profile', {
          withCredentials: true
        });
        setUser(res.data);
        setLoading(false);
        console.log('Profile data:', res.data);
      } catch (err) {
        console.error('Unauthorized or error fetching profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    </div>
  );
};

export default Profile;
