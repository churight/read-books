import { useEffect, useState } from 'react';
import axios from 'axios';

const useFavourites = () => {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/browse/favourites', { withCredentials: true });
        const books = res.data.books;
        setFavourites(res.data.books.map((book: any) => String(book.isbn13).trim()));
      } catch (err) {
        console.error('Failed to fetch favourites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const addFavourite = (isbn13: string) => {
    setFavourites((prev) => {
        if (prev.includes(isbn13)) return prev;
        return [...prev, isbn13];
    });;
  };

  return { favourites, loadingFavourites: loading, addFavourite };
};

export default useFavourites;
