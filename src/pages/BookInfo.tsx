import { useEffect, useState } from "react";
import IBook from "../interfaces/IBook";
import { useParams } from "react-router-dom";
import axios from "axios";
import { handleAddFavourites } from "../services/handleAddFavourite";
import useFavourites from "../hooks/useFavourites";
import "../styles/BookInfo.css"
import { handleAddCart } from "../services/handleAddCart";
import useCart from "../hooks/useCart";
import { handleAddWishList } from "../services/handleAddWishList";
import { useWishList } from "../hooks/useWishList";
import { IReview } from "../interfaces/IReviews";

const BookInfo =()=>{
    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState(true);
    const {isbn13} = useParams<{isbn13: string}>();

    const {favourites, addFavourite, loadingFavourites} = useFavourites();
    const {cart, addCart, loadingCart} = useCart();
    const {wishList, addWishList} = useWishList();

    const [reviews, setReviews] = useState<IReview[]>([]);
    const [newReview, setNewReview] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);

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

    const fetchReviews = async () =>{
            try{
                const res = await axios.get(`http://localhost:4000/api/browse/books/${isbn13}/reviews`, {
                    withCredentials:true
                });
                setReviews(res.data.reviews);
            }catch(err){
                console.error("Error fetching data:", err);
            }
        };

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

    const handleClickWishList = async () =>{
        if(!book) return;
        await handleAddWishList(String(book.isbn13));
        addWishList(String(book.isbn13));

    }

    const handlePostReview = async () =>{
        if(!newReview.trim()) return;
        try{
            await axios.post(`http://localhost:4000/api/browse/books/${isbn13}/reviews`, 
                {
                    review: newReview,
                    parentReviewId: replyTo || null 
                },
                {withCredentials:true}
            )
            setNewReview("");
            setReplyTo(null); // reset reply mode
            fetchReviews();
        }catch(err){
            console.error("Failed to post", err)
        }
    }

    if (loading || loadingFavourites || loadingCart) return <div>Loading...</div>;
    if (!book) return <div>Book not found</div>;

    const isFavourite = favourites.includes(String(book.isbn13));
    const isCart = cart.includes(String(book.isbn13));
    const isWishList = wishList.includes(String(book.isbn13));

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
        {isWishList ? (
            <span className="cart-label">Added to wish list</span>
        ) : (
            <button onClick={handleClickWishList}>Add to wish list</button>
        )}

        <div className="reviews-section">
            <h2>Reviews</h2>

            {!replyTo && (
                <>
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write your review..."
                    />
                    <button onClick={handlePostReview}>Post Review</button>
                </>
            )}

            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul>
                    {reviews.map((r) => (
                        <li key={r._id}>
                            <p><strong>User:</strong> {r.user_id}</p>
                            <p>{r.review}</p>

                            <button onClick={() => setReplyTo(r._id)}>Reply</button>

                            {replyTo === r._id && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <textarea
                                        value={newReview}
                                        onChange={(e) => setNewReview(e.target.value)}
                                        placeholder="Write your reply..."
                                    />
                                    <button onClick={handlePostReview}>Post Reply</button>
                                    <button onClick={() => { setReplyTo(null); setNewReview(''); }}>Cancel</button>
                                </div>
                            )}

                            {r.replies && r.replies.length > 0 && (
                                <ul>
                                    {r.replies.map((reply) => (
                                        <li key={reply._id}>
                                            <p><strong>Reply:</strong> {reply.review}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);
}

export default BookInfo; 