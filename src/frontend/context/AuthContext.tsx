import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import UserProfile from "../interfaces/IUserProfile";
import { isAuthenticated } from "../services/isAuthenticated";
import { fetchUserProfile } from "../hooks/useFetchProfile";

interface AuthContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const auth = await isAuthenticated();
            if (auth) {
                const profile = await fetchUserProfile();
                setUser(profile);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
