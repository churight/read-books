import { useEffect, useState } from "react"
import IBook from "../interfaces/IBook"
import axios from "axios";
import { Link } from "react-router-dom";
import { handleCheckout } from "../services/handleCheckout";

export const CartPage = () =>{
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(""); //use message somewhere

    useEffect(()=>{
        const fetchCart = async ()=>{
            try{
                const res = await axios.get(`http://localhost:4000/api/browse/cart`, {withCredentials: true});

                if (Array.isArray(res.data.cart)) {
                    setBooks(res.data.cart);
                } else {
                    console.warn("Unexpected cart format", res.data);
                    setBooks([]);
                }
                setLoading(false)
            } catch(err){
                console.error(err);
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleCheckoutClick = async () => {
        const result = await handleCheckout();
        setMessage(result.message);
        setBooks(result.clearedBooks);
    };

    if (loading) return <div>Loading....</div>

    return(
        <div>
            <h1>Cart</h1>
             {books.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                <>
                    {books.map(book => (
                        <Link to={`/book/${book.isbn13}`} key={book.isbn13} className="book-card">
                            <img src={book.thumbnail} alt={book.title} />
                            <div className="book-details">
                                <h2>{book.title}</h2>
                                <p>By: {book.authors.join(', ')}</p>
                            </div>
                        </Link>
                    ))}
                    <button onClick={handleCheckoutClick}>Proceed to Payment</button>
                </>
            )}
        </div>
    )
}