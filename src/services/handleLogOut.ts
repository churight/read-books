import axios from "axios";

export const logout = async (): Promise<boolean> =>{
    try {
        await axios.post('http://localhost:4000/api/auth/logout', {}, {
          withCredentials: true,
        });
        return true;
      } catch (error) {
        console.error('Logout failed', error);
        return false;
      }
} 