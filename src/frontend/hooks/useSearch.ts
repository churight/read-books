import { useState } from "react";
import IBook from "../interfaces/IBook";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useSearch = () =>{
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) =>{
        e.preventDefault();
        if (!query.trim()) return;

        try{
            const searchParams = new URLSearchParams({
                query, sortBy, order
            });

            navigate (`/search?${searchParams.toString()}`)

        }catch(e){
            console.error('Search error', e);
        }
    }

    return{
        query,
        setQuery,
        sortBy,
        setSortBy,
        order,
        setOrder,
        handleSearch
    }
    
}