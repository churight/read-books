import { useEffect, useState } from "react";
import axios from "axios";
import IBook from "../interfaces/IBook";
import "../styles/Home.css";
import BookCarousel from "../components/BookCarousel";
import { isAuthenticated } from "../services/isAuthenticated";

const Home = () => {
  const [recBooks, setRecBooks] = useState<IBook[]>([]);
  const [popular, setPopular] = useState<IBook[]>([]);
  const [highestRating, setHighestRating] = useState<IBook[]>([]);
  const [newest, setNewest] = useState<IBook[]>([]);
  const [error, setError] = useState<string>(''); // Explicitly type error as string
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [popRes, ratingRes, newRes] = await Promise.all([
          axios.get("http://localhost:4000/api/recommendations/popular", { withCredentials: true }),
          axios.get("http://localhost:4000/api/recommendations/highest-rating", { withCredentials: true }),
          axios.get("http://localhost:4000/api/recommendations/newest", { withCredentials: true }),
        ]);

        setPopular(popRes.data.books);
        setHighestRating(ratingRes.data.books);
        setNewest(newRes.data.books);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading public books');
      }
    };

    const fetchPrivateData = async () => {
      try {
        const auth = await isAuthenticated();
        setIsAuth(auth);

        if (auth) {
          const recRes = await axios.get('http://localhost:4000/api/recommendations/recommended', {
            withCredentials: true,
          });
          setRecBooks(recRes.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch recommended books:", err);
        setError(err.response?.data?.message || 'Error loading recommended books');
      }
    };

    fetchPublicData();
    fetchPrivateData();
  }, []);

  return (
    <div className="recommendations-container">
      {error && <div className="error-message" role="alert">{error}</div>}
      {isAuth === true && recBooks.length > 0 && (
        <BookCarousel title="Books You Might Like" books={recBooks} />
      )}
      {popular.length > 0 && <BookCarousel title="Popular Books" books={popular} />}
      {highestRating.length > 0 && <BookCarousel title="Top Rated Books" books={highestRating} />}
      {newest.length > 0 && <BookCarousel title="Newest Books" books={newest} />}
    </div>
  );
};

export default Home;