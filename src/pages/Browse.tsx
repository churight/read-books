import React, { useEffect, useState } from "react";
import axios from "axios";
import IBook from "../interfaces/IBook";
import { Link} from "react-router-dom";
import "../styles/Browse.css"
//import { handleAddCart } from "../services/handleAddCart";

const Browse = ()=>{
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() =>{
        const fetchBooksHome= async () =>{ // also to another file
            try{
                const res = await axios.get(`http://localhost:4000/api/browse/browse?page=${currentPage}`);

                setBooks(res.data.books);
                setTotalPages(res.data.totalPages);
                setLoading(false);
                //console.log("Books fetached", res.data);
            } catch(err){
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchBooksHome();
    }, [currentPage]);

    /*const handleClickAddCart = async () => {
        if (!books) return;
        await handleAddCart(String(books.isbn13));
        };*/ //its a strat but thats not gonna work
    

    if (loading) return <div>Loading...</div>;

    return (
        <div className="books-container">
            <h1>Books</h1>
            {books.map(book => (
            <Link to={`/book/${book.isbn13}`} key={book._id} className="book-card">
                <img src={book.thumbnail} alt={book.title} />
            <div className="book-details">
                <h2 >{book.title}</h2>
                <p>By: {book.authors.join(', ')}</p>
                <button
                className="buy-now-button"
                onClick={(e) => {
                e.preventDefault(); // prevent navigation to the book page
                //window.open(book.buyLink, "_blank"); // assumes book has a buyLink field
            }}
          >
            Buy Now
          </button>
            </div>
          </Link>
            ))}
        <div className="pagination-controls">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next
            </button>
             </div>
        </div>
      );

}

export default Browse;