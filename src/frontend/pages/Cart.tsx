import { useEffect, useState } from "react"
import IBook from "../interfaces/IBook"
import axios from "axios";
import { Link } from "react-router-dom";
import { handleCheckout } from "../services/handleCheckout";
import "../styles/Cart.css"
import { handleDeleteFromCart } from "../services/handleRemoveFromCart";
import { useAuthGuard } from "../hooks/useAuthGuard";


//as i don't have data for book prices i', hardcoding every book to cost 5$
export const CartPage = () =>{
    useAuthGuard();

    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(""); //use message somewhere

    useEffect(()=>{
        const fetchCart = async ()=>{
            try{
                const res = await axios.get(`http://localhost:4000/api/buy/cart`, {withCredentials: true});

                if (Array.isArray(res.data.books)) {
                    setBooks(res.data.books);
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

    const handleRemoveClick = async (isbn13:string) =>{
        const result = await handleDeleteFromCart(isbn13);
        setMessage(result.message);

        if (result.success) {
            setBooks((prev) => prev.filter((b) => String(b.isbn13) !== isbn13));
        }
    }

    const handleCheckoutClick = async () => {
        const result = await handleCheckout();
        setMessage(result.message);
        setBooks(result.clearedBooks);
    };

    if (loading) return <div>Loading....</div>

    return(
        <div className="cart-container">
        <h1 className="cart-title">Cart</h1>
        {books.length === 0 ? (
            <p className="cart-empty">Cart is empty</p>
        ) : (
            <>
            <div className="cart-books-list">
                {books.map((book) => (
                    <div key={book.isbn13} className="cart-book-card">
                    <Link to={`/book/${String(book.isbn13)}`} className="cart-book-link">
                        <div className="cart-book-thumbnail-container">
                        <img src={book.thumbnail} alt={book.title} className="cart-book-thumbnail" />
                        </div>
                        <div className="cart-book-details">
                        <h2 className="cart-book-title">{book.title}</h2>
                        <p className="cart-book-author">By: {book.authors.join(", ")}</p>
                        <p className="cart-book-description">{book.description || "No description available"}</p>
                        </div>
                    </Link>
                    <button
                        className="cart-remove-button"
                        onClick={() => handleRemoveClick(String(book.isbn13))}
                    >
                        Remove
                    </button>
                    </div>
                ))}
                </div>
                <h2>Total: {books.length * 5} $</h2>
            <button onClick={handleCheckoutClick} className="cart-checkout-button">
                Proceed to Payment
            </button>
            {message && <p className="cart-message">{message}</p>}
            </>
        )}
        </div>
    )
}