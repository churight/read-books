import axios from "axios";
import UserProfile from "../interfaces/IUserProfile";

export const fetchUserProfile = async (): Promise<UserProfile> => {
    const res = await axios.get("http://localhost:4000/api/auth/profile", {
        withCredentials: true,
    });
    return res.data;
};
