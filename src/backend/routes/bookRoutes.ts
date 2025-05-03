import express, { Router } from "express";
import { Book } from "../models/Books";
import { protect } from "../middleware/authMiddleware";
import { Favourite } from "../models/Favourite";

const router: Router = express.Router();

//display books (for home pagem)

router.get('/home', async (req, res) =>{
    try{
        const book = await Book.find().limit(10);
        res.json(book);
    }catch(e){
        res.status(500).json({message:"Internall server error", e})
}
});

//display book page

router.get('/book/:isbn13', async (req, res) => {
    try {
        const isbnNum = parseInt(req.params.isbn13, 10);
        const book = await Book.findOne({ isbn13: isbnNum });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (e) {
        res.status(500).json({ message: "Server error", error: e });
    }
});

//add to favourites

router.post('/add', protect, async (req, res)=>{
    
})
export default router;
