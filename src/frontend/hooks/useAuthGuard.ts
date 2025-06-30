//idk where to put it rn but should be nice to have for future

import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "../services/isAuthenticated";

export const useAuthGuard = () =>{
    const navigate = useNavigate();

    useEffect(()=>{
        const checkAuth = async () =>{
            const auth = await isAuthenticated();
            if (!auth){
                navigate('/login')
            }
        };

        checkAuth();
    }, [navigate])
}