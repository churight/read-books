import { useEffect, useState } from "react";
import axios from "axios";
import IBook from "../interfaces/IBook";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import BookCarousel from "../components/BookCarousel";

const Home = () => {
  const [recBooks, setRecBooks] = useState<IBook[]>([]);
  const [popular, setPopular] = useState<IBook[]>([]);
  const [highestRating, setHighestRating] = useState<IBook[]>([]);
  const [newest, setNewest] = useState<IBook[]>([]);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, popRes, ratingRes, newRes] = await Promise.all([
          axios.get("http://localhost:4000/api/recommendations/recommended", { withCredentials: true }),
          axios.get("http://localhost:4000/api/recommendations/popular", { withCredentials: true }),
          axios.get("http://localhost:4000/api/recommendations/highest-rating", { withCredentials: true }),
          axios.get("http://localhost:4000/api/recommendations/newest", { withCredentials: true }),
        ]);

        setRecBooks(recRes.data);
        setPopular(popRes.data.books);
        setHighestRating(ratingRes.data.books);
        setNewest(newRes.data.books);

      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading books');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="recommendations-container">
      <BookCarousel title="Books You Might Like" books={recBooks} />
      <BookCarousel title="Popular Books" books={popular} />
      <BookCarousel title="Top Rated Books" books={highestRating} />
      <BookCarousel title="Newest Books" books={newest} />
    </div>
  );
};

export default Home;
