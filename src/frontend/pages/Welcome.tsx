import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import IBook from "../interfaces/IBook";
import '../styles/Welcome.css'

const Welcome = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/browse/home");
        setBooks(res.data);
        console.log("Books fetched", res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="home-page">
      <div className="carousel-covers-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img src={book.thumbnail} alt={book.title} className="book-cover" />
            <h4 className="book-title">{book.title}</h4>
            <p className="book-author">
            {Array.isArray(book.authors) ? book.authors.join(", ") : "Unknown author"}
            </p>
          </div>
        ))}
      </div>
      <div className="text-section">
        <h1>All your favorite books here</h1>
        <button className="browse-button" onClick={() => navigate("/browse")}>
          Browse Now
        </button>
      </div>
    </div>
  );
};

export default Welcome;
