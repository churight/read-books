import { useState } from "react";
import IBook from "../interfaces/IBook";
import axios from "axios";

export const useSearch = () =>{
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

    return{
        query,
        setQuery,
        results,
        loading,
        message,
        sortBy,
        setSortBy,
        order,
        setOrder,
        handleSearch
    }
    
}