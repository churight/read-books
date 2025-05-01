import { useEffect, useState } from "react";
import IBook from "../interfaces/IBook";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookInfo =()=>{
    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState(true);
    const {isbn13} = useParams<{isbn13: string}>();

    useEffect(() =>{
        const fetchBook = async ()=>{
            try{
                const res = await await axios.get(`http://localhost:4000/api/read/book/${isbn13}`);

                setBook(res.data);
                setLoading(false);
                console.log("Books fetached", res.data);
            }catch(err){
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchBook();

    }, [isbn13]);

    if (loading) return <div>Loading...</div>;
    if (!book) return <div>Book not found</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h1>{book.title}</h1>
            <img src={book.thumbnail} alt={book.title} style={{ width: "200px", height: "auto" }} />
            <p><strong>Authors:</strong> {book.authors.join(", ")}</p>
            <p><strong>Categories:</strong> {book.categories.join(", ")}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Published Year:</strong> {book.published_year}</p>
            <p><strong>Pages:</strong> {book.num_pages}</p>
            <p><strong>ISBN-13:</strong> {book.isbn13}</p>
            <p><strong>ISBN-10:</strong> {book.isbn10}</p>
            <p><strong>Average Rating:</strong> {book.average_rating}</p>
            <p><strong>Ratings Count:</strong> {book.ratings_count}</p>
        </div>
      );
};

export default BookInfo; 