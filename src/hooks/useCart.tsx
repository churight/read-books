import axios from "axios";
import { useEffect, useState } from "react"
//import { Cart } from "../backend/models/Cart"

const useCart = () =>{
    const [cart, setCart] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchCart = async () =>{
            try{
                const res = await axios.get('http://localhost:4000/api/browse/cart', {withCredentials: true});
                setCart(res.data.books.map((book:any) => String(book.isbn13).trim())); 
            }catch(err){
                console.error(err)
            }finally{
                setLoading(false)
            }
        };

        fetchCart();
    }, []);

    const addCart = (isbn13: string) => {
    setCart((prev) => {
        if (prev.includes(isbn13)) return prev;
        return [...prev, isbn13];
    });;
  };

  return { cart, loadingCart: loading, addCart };
}

export default useCart;