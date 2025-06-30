import { useState } from "react";
import IBook from "../interfaces/IBook";
import { Link } from "react-router-dom";

interface BookCarouselProps {
  title: string;
  books: IBook[];
}

const BookCarousel = ({ title, books }: BookCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="recommendations-carousel">
      <h2>{title}</h2>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="recommendations-books-wrapper">
          <button
            className="recommendations-arrow left"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
          >
            &lt;
          </button>
          <div className="recommendations-books-container">
            <div
              className="recommendations-books-slide"
              style={{ transform: `translateX(-${currentIndex * 186}px)` }} // 180px width + 6px gap
            >
              {visibleBooks.map((book) => (
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
                  <p className="recommendations-book-author">{book.authors.join(", ")}</p>
                </Link>
              ))}
            </div>
          </div>
          <button
            className="recommendations-arrow right"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCarousel;