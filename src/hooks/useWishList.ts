import axios from "axios";
import { useEffect, useState } from "react"

export const useWishList = () =>{
    const [wishList, setWishList] = useState<string[]>([]);

    useEffect(()=>{
        const fetchWishList = async () =>{
            try{
                const res = await axios.get('http://localhost:4000/api/browse/wish-list', {withCredentials: true});
                setWishList(res.data.books.map((book:any) => String(book.isbn13).trim()));
            }catch(err){
                console.error('Failed to fetch wish list:', err);
            }
        };

        fetchWishList();
    }, []);

    const addWishList = (isbn13:string) =>{
        setWishList((prev) => {
            if (prev.includes(isbn13)) return prev;
            return [...prev, isbn13];
        });;
    };

    const removeWishList = (isbn13: string) => {
    setWishList((prev) => prev.filter((id) => id !== isbn13));
  };


    return {wishList, addWishList, removeWishList}
}