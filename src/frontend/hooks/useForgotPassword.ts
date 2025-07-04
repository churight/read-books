import axios from "axios"

export const useForgotPassword = () =>{
    const sendReset = async (email:string) =>{
        try{
            const res = await axios.post('http://localhost:4000/api/auth/forgot-password', {email});
            return res.data.message;
        }catch(err:any){
            return err.response?.data?.message || "error"
        }
    }
    return {sendReset};
}