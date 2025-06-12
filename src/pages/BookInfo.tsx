import { useEffect, useState } from "react";
import IBook from "../interfaces/IBook";
import { useParams } from "react-router-dom";
import axios from "axios";
import { handleAddFavourites } from "../services/handleAddFavourite";
import useFavourites from "../hooks/useFavourites";
import "../styles/BookInfo.css"
import { handleAddCart } from "../services/handleAddCart";
import useCart from "../hooks/useCart";
const BookInfo =()=>{
    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState(true);
    const {isbn13} = useParams<{isbn13: string}>();

    const {favourites, addFavourite, loadingFavourites} = useFavourites();
    const {cart, addCart, loadingCart} = useCart();

    useEffect(() =>{ // also in another file smotime later
        const fetchBook = async ()=>{
            try{
                const res = await await axios.get(`http://localhost:4000/api/browse/book/${isbn13}`);

                setBook(res.data);
                setLoading(false);
                console.log("Books fetched", res.data);
            }catch(err){
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchBook();

    }, [isbn13]);

    const handleClickFavourite = async () => {
    if (!book) return;
    await handleAddFavourites(String(book.isbn13));
    addFavourite(String(book.isbn13)); // update local favourites state
    };

    const handleClickCart = async () => {
    if (!book) return;
    await handleAddCart(String(book.isbn13));
    addCart(String(book.isbn13)); // update local favourites state
    };

    if (loading || loadingFavourites || loadingCart) return <div>Loading...</div>;
    if (!book) return <div>Book not found</div>;

    const isFavourite = favourites.includes(String(book.isbn13));
    const isCart = cart.includes(String(book.isbn13));

    return (
        <div className="book-info-container">
            <h1>{book.title}</h1>
            <img className="book-thumbnail" src={book.thumbnail} alt={book.title} />
            <p><strong>Authors:</strong> {book.authors.join(", ")}</p>
            <p><strong>Categories:</strong> {book.categories.join(", ")}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Published Year:</strong> {book.published_year}</p>
            <p><strong>Pages:</strong> {book.num_pages}</p>
            <p><strong>ISBN-13:</strong> {book.isbn13}</p>
            <p><strong>ISBN-10:</strong> {book.isbn10}</p>
            <p><strong>Average Rating:</strong> {book.average_rating}</p>
            <p><strong>Ratings Count:</strong> {book.ratings_count}</p>
             {isFavourite ? (
                    <span className="favourite-label">Favourite</span>
                ) : (
                    <button onClick={handleClickFavourite}>Add to Favourite</button>
                )}
            {isCart ? (
                    <span className="cart-label">Added to cart</span>
                ) : (
                    <button onClick={handleClickCart}>Add to cart</button>
                )}
                </div>

      );
};

export default BookInfo; 