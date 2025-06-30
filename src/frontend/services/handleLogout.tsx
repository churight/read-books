// src/utils/handleLogout.ts
import { NavigateFunction } from "react-router-dom";
import UserProfile from "../interfaces/IUserProfile"; // if available
import { logout } from "./logout";

const handleLogout = async (
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>, 
  navigate: NavigateFunction
) => {
  const success = await logout();
  if (success) {
    setUser(null);
    navigate("/login");
  }
};

export default handleLogout;
