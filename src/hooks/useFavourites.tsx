import { useEffect, useState } from 'react';
import axios from 'axios';

const useFavourites = () => {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/browse/favourites', { withCredentials: true });
        // If API returns array of full book objects
        const favBooks = Array.isArray(res.data.favouriteBooks)
          ? res.data.favouriteBooks.map((book: any) => book.isbn13 ?? book)
          : [];

        setFavourites(favBooks);
      } catch (err) {
        console.error('Failed to fetch favourites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const addFavourite = (isbn13: string) => {
    setFavourites((prev) => [...prev, isbn13]);
  };

  return { favourites, loading, addFavourite };
};

export default useFavourites;
