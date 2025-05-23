import axios from "axios";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../services/isAuthenticated";
import { useNavigate } from "react-router-dom";

export function useFetchProfile (setUser: (user: any) => void){
     const navigate = useNavigate();
    //const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(()=>{
        const fetchProfile = async () =>{
            try{
                const auth = await isAuthenticated();
                if (!auth) {
                    navigate('/login');
                    return;
                }
                const res = await axios.get('http://localhost:4000/api/auth/profile', {
                withCredentials: true
                });
                setUser(res.data);
                console.log('Profile data:', res.data); // don't forget to delete later
            }catch(err: any){console.error('Unauthorized')}
        };

        fetchProfile();
    }, [navigate, setUser])
}