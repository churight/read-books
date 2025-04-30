// Profile.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfile {
    nickname: string;
    email: string;
  }

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Loading...</div>;

  // Show error if something went wrong
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Welcome {user?.nickname}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Profile;
