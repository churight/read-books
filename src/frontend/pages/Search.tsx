import { useEffect, useState } from "react"
import IBook from "../interfaces/IBook";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Browse.css"

const useQueryParams =() =>{
  return new URLSearchParams(useLocation().search);
}

export const Search = () =>{
  const queryParams = useQueryParams();
  const query = queryParams.get("query") || "";
  const sortBy = queryParams.get("sortBy") || "";
  const order = queryParams.get("order") || "asc";

  const [results, setResults] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() =>{
    const fetchResults = async () =>{

      if(!query.trim()) return;
      setLoading(true);

      try{
        const res = await axios.get(`http://localhost:4000/api/browse/search`, {
          params: {query, sortBy, order}
        });
        setResults(res.data);
        if(res.data.length === 0){
          setMessage("No books found")
        } else {
          setMessage("")
        }
      }catch(error){
        console.error("Search error:", error);
        setMessage("Search failed");
        setLoading(false)
      }
    }

    fetchResults();
  }, [query, sortBy, order])

  if (loading === false) return <div>Loading...</div>;
    
  return (
    <div className="browse-container">
      <h2>Search Results for "{query}"</h2>
      {message && <p>{message}</p>}
      <div className="books-grid">
        {results.map((book) => (
          <Link to={`/book/${book.isbn13}`} key={book._id} className="book-card">
            <img src={book.thumbnail} alt={book.title} className="book-thumbnail" />
            <div className="book-details">
              <h2>{book.title}</h2>
              <p>By: {book.authors.join(", ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

