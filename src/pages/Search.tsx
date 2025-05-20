import { useState } from "react"
import IBook from "../interfaces/IBook";
import axios from "axios";

export const Search = () =>{
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');

    const handleSearch = async (e: React.FormEvent) =>{
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);

        try{
            const res = await axios.get('http://localhost:4000/api/browse/search', {params: {query, sortBy, order}});
            setResults(res.data);
            if(res.data.length === 0){
                console.log('No books found');
                setMessage('No books found');
                setLoading(false);
            }

        }catch(e){
            console.error('Search error', e);
            setLoading(false);
            setMessage('Search failed');
        }
    }

    return (
    <div style={{ padding: '20px' }}>
      <h2>Search for a Book</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter title, author or ISBN13"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">No Sort</option>
        <option value="year">Year</option>
        <option value="pages">Number of Pages</option>
        <option value="rating">Average Rating</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}

      <ul>
        {results.map((book) => (
          <li key={book.isbn13}>
            <strong>{book.title}</strong> by {book.authors.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

