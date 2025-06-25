import axios from "axios";
import { useEffect, useState } from "react";

const useMyBooks = () => {
  const [myBooks, setMyBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/browse/my-books", {
          withCredentials: true,
        });
        const isbnList = res.data.books.map((book: any) => String(book.isbn13).trim());
        setMyBooks(isbnList);
      } catch (err) {
        console.error("Failed to fetch MyBooks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, []);

  return { myBooks, loadingMyBooks: loading };
};

export default useMyBooks;
