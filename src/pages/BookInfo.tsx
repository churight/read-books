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
import useMyBooks from "../hooks/useMyBooks";

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

    const {myBooks, loadingMyBooks} = useMyBooks();

    useEffect(() =>{ // also in another file smotime later
        const fetchBook = async ()=>{
            try{
                const res = await axios.get(`http://localhost:4000/api/browse/book/${isbn13}`);

                setBook(res.data);
                setLoading(false);
                console.log("Books fetched", res.data);
            }catch(err){
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchBook();
        fetchReviews();

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
    try{
      await handleAddFavourites(String(book.isbn13));
      addFavourite(String(book.isbn13)); // update local favourites state
    }catch(err){
      console.error(err)
    }
    };

    const handleClickCart = async () => {
    if (!book) return;
    try{
      await handleAddCart(String(book.isbn13));
      addCart(String(book.isbn13)); // update local favourites state
    }catch(err){
      console.error(err)
    }
    };

    const handleClickWishList = async () =>{
      if(!book) return;
      try{
        await handleAddWishList(String(book.isbn13));
        addWishList(String(book.isbn13));
      }catch(err){
        console.error(err)
      }

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

    if (loading || loadingFavourites || loadingCart || loadingMyBooks) return <div>Loading...</div>;
    if (!book) return <div>Book not found</div>;

    const currentIsbn = String(book.isbn13).trim();
    const isFavourite = favourites.includes(currentIsbn);
    const isCart = cart.includes(currentIsbn);
    const isWishList = wishList.includes(currentIsbn);
    const isOwned = myBooks.includes(currentIsbn);

    return (
     <div className="book-info-book-info-container">
      <div className="book-info-book-details">
        <div className="book-info-thumbnail-section">
          <img className="book-info-book-thumbnail" src={book.thumbnail} alt={book.title} />
        </div>
        <div className="book-info-info-section">
          <h1>{book.title}</h1>
          <p><strong>Author:</strong> {book.authors.join(", ")}</p>
          <p><strong>Rating:</strong> {book.average_rating} ({book.ratings_count} ratings)</p>
          <p><strong>Genre:</strong> {book.categories.join(", ")}</p>
          <div className="book-info-additional-info">
            <p><strong>Published Year:</strong> {book.published_year}</p>
            <p><strong>Pages:</strong> {book.num_pages}</p>
            <p><strong>ISBN-13:</strong> {book.isbn13}</p>
            <p><strong>ISBN-10:</strong> {book.isbn10}</p>
            <p><strong>Description:</strong> {book.description}</p>
          </div>
          <div className="book-info-action-buttons">
            {isFavourite ? (
                  <span className="book-info-status-label">Favourite</span>
                ) : (
                  <button onClick={handleClickFavourite} className="book-info-action-button">Add to Favourite</button>
                )}

           {!isOwned && (
              <>
                {isCart ? (
                  <span className="book-info-status-label">Added to Cart</span>
                ) : (
                  <button onClick={handleClickCart} className="book-info-action-button">Add to Cart</button>
                )}

                {isWishList ? (
                  <span className="book-info-status-label">Added to Wish List</span>
                ) : (
                  <button onClick={handleClickWishList} className="book-info-action-button">Add to Wish List</button>
                )}
              </>
            )}

            {isOwned && (
              <span className="book-info-status-label">In Your Library</span>
            )}
          </div>
        </div>
      </div>
      <div className="book-info-reviews-section">
        <h2>Reviews</h2>
        {!replyTo && (
          <div className="book-info-review-input">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review..."
            />
            <button onClick={handlePostReview} className="book-info-action-button">Post Review</button>
          </div>
        )}
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="book-info-reviews-list">
            {reviews.map((r) => (
              <li key={r._id} className="book-info-review-item">
                <p><strong>User:</strong> {r.user_id}</p>
                <p>{r.review}</p>
                <button onClick={() => setReplyTo(r._id)} className="book-info-reply-button">Reply</button>
                {replyTo === r._id && (
                  <div className="book-info-reply-input">
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="Write your reply..."
                    />
                    <button onClick={handlePostReview} className="book-info-action-button">Post Reply</button>
                    <button onClick={() => { setReplyTo(null); setNewReview(""); }} className="book-info-cancel-button">Cancel</button>
                  </div>
                )}
                {r.replies && r.replies.length > 0 && (
                  <ul className="book-info-replies-list">
                    {r.replies.map((reply) => (
                      <li key={reply._id} className="book-info-reply-item">
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