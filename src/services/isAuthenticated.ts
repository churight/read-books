import axios from "axios"

export const isAuthenticated = async (): Promise<boolean> =>{
    try{
        axios.get('http://localhost:4000/api/auth/profile', {
            withCredentials: true,
        });
        console.log('authenticated')
        return true;
    }catch(e){
        return false;
    }
}