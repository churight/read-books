import {Swiper, SwiperSlide} from "swiper/react";
import IBook from "../interfaces/IBook";
import "swiper/css"
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"
const Home = ()=> {
    const [books, setBooks] = useState<IBook[]>([]);
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchBooks = async () =>{ // i have identical function in Browse.tsx, so make it in another file later
            try{
                const res = await axios.get('http://localhost:4000/api/browse/home');

                setBooks(res.data);
                //console.log("Books fetached", res.data);
            } catch(err){
                console.error("Error fetching data:", err);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className = "home-page"> 
            <div className = "carousel-covers">
                <Swiper spaceBetween={20} slidesPerView={1} loop={true}>
                {books.map((book) => (
                    <SwiperSlide key={book._id}>
                    <img src={book.thumbnail} alt={book.title} className="book-cover" />
                    </SwiperSlide>
                ))}
                </Swiper>
            </div>
            <div className="text-section">
                <h1> All yout favorite books here</h1>
                <button className="browse-button" onClick={() => navigate('/browse')}>Browse Now</button>
            </div>
        </div>

    )
}
export default Home;