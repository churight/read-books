import React, { useEffect, useState } from "react";
import axios from "axios";
import IBook from "../interfaces/IBook";
import { Link } from "react-router-dom";

const Home = ()=>{
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchBooksHome= async () =>{
            try{
                const res = await axios.get('http://localhost:4000/api/read/home');

                setBooks(res.data);
                setLoading(false);
                //console.log("Books fetached", res.data);
            } catch(err){
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchBooksHome();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Books</h1>
            {books.map(book => (
            <Link to={`/book/${book.isbn13}`} key={book._id}>
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-700">By: {book.authors.join(', ')}</p>
            </div>
          </Link>
            ))}
        </div>
      );

}

export default Home;