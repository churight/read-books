import axios from "axios"

export const isAuthenticated = async (): Promise<boolean| null> =>{
    try{
        axios.get('http://localhost:4000/api/auth/profile', {
            withCredentials: true,
        });
        console.log('authenticated')
        return true;
    }catch(e){
        if (axios.isAxiosError(e) && e.response?.status === 401){
            return null
        };
        console.error(e);
        return null;
    }
}