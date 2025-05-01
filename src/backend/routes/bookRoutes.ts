import express from "express";
import { Book } from "../models/Books";

const router = express.Router();

//display books (for home pagem)

router.get('/home', async (req, res) =>{
    try{
        const book = await Book.find().limit(10);
        res.json(book);
    }catch(e){
        res.status(500).json({message:"Internall server error", e})
}
})

export default router;