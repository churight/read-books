import { useEffect, useState } from "react";
import axios from "axios";
import IBook from "../interfaces/IBook";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Recommendations = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const visibleBooks = books.slice(currentIndex, currentIndex + 5);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + 5 < books.length;

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'right' && canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="recommendations-container">
      <h2>Books You Might Like</h2>
      {books.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <div className="recommendations-books-wrapper">
          <button
            className="recommendations-arrow left"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
          >
            &#60;
          </button>
          <div className="recommendations-books-container">
            <div className="recommendations-books-slide">
              {visibleBooks.map(book => (
                <Link
                  to={`/book/${book.isbn13}`}
                  key={book.isbn13}
                  className="recommendations-book-card"
                >
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="recommendations-book-thumbnail"
                  />
                  <h4 className="recommendations-book-title">{book.title}</h4>
                  <p className="recommendations-book-author">
                    {book.authors.join(', ')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          <button
            className="recommendations-arrow right"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
          >
            &#62;
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
