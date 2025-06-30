import axios from "axios"

export const handleDeleteFromCart = async (isbn13: string) =>{
    try{
        const res = await axios.delete(`http://localhost:4000/api/buy/delete/cart`,
            {
                params: { isbn13 }, // pass as query param
                withCredentials: true,
            }
        );
        alert(res.data.message);
        return { success: true, message: res.data.message };
    }catch(err:any){
        console.error(err)
        return { success: false, message:  err.response?.data?.message || "Failed to remove from cart" };
    }
}