import { useEffect, useState } from "react";
import axios from "axios";
import IBook from "../interfaces/IBook";
import { Link } from "react-router-dom";

const Recommendations = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/recommendations/recommended", {
          withCredentials: true
        });
        setBooks(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading recommendations');
      }
    };

    fetchRecommended();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Books You Might Like</h2>
      {books.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <div className="books-container">
          {books.map(book => (
            <Link to={`/book/${book.isbn13}`} key={book.isbn13} className="book-card">
              <img src={book.thumbnail} alt={book.title} width={100} />
              <h4>{book.title}</h4>
              <p>{book.authors.join(', ')}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
