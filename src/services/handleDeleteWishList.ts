import axios from "axios"

export const handleDeleteWishList = async (isbn13: string) =>{
    try{
        const res = await axios.delete(`http://localhost:4000/api/browse/delete/wish-list`,
            {
                params: { isbn13 }, 
                withCredentials: true,
            }
        );
        alert(res.data.message);
        return { success: true, message: res.data.message };
    }catch(err:any){
        console.error(err)
        return { success: false, message:  err.response?.data?.message || "Failed to remove from wish list" };
    }
}