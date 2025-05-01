import React, { useEffect, useState } from "react";
import axios from "axios";
import IBook from "../interfaces/IBook";

const Home = ()=>{
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchBooksHome= async () =>{
            try{
                const res = await axios.get('http://localhost:4000/api/read/home');

                setBooks(res.data);
                setLoading(false);
                console.log("Books fetached", res.data);
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
            <div key={book._id}>
                <h2>{book.title}</h2>
                <p>{book.authors?.join(", ")}</p>
            </div>
            ))}
        </div>
      );

}

export default Home;