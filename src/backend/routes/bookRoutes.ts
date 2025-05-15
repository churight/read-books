import express, { Router } from "express";
import { Book } from "../models/Books";
import { protect } from "../middleware/authMiddleware";
import { Favourite } from "../models/Favourite";
import { AuthRequest } from "../models/AuthRequest";

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

router.get('/book/:isbn13', async (req, res): Promise<void> => {
    try {
        const isbnNum = parseInt(req.params.isbn13, 10);
        const book = await Book.findOne({ isbn13: isbnNum });
        if (!book){
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json(book);
    } catch (e) {
        res.status(500).json({ message: "Server error", error: e });
    }
});

//add to favourites

router.post('/add', protect, async (req: AuthRequest, res): Promise<void>=>{
    try {
        const userId = req.user.id;
        const { isbn13 } = req.body;

        if (!isbn13) {
            res.status(400).json({ message: "ISBN13 is required" });
            return;
        }

        // Check if user already has a favourites document
        let favourite = await Favourite.findOne({ user_id: userId });

        if (!favourite) {
            // Create a new favourites document for the user
            favourite = new Favourite({
                user_id: userId,
                books_isbn13: [isbn13],
            });
        } else {
            // Avoid adding duplicates
            if (!favourite.books_isbn13.includes(isbn13)) {
                favourite.books_isbn13.push(isbn13);
            } else {
                res.status(409).json({ message: "Book already in favourites" });
                return;
            }
        }

        await favourite.save();
        res.status(200).json({ message: "Book added to favourites", favourite });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/favourites', protect, async(req: AuthRequest, res): Promise<void> =>{
    try{
        const userId = req.user.id;
        
        const favourite = await Favourite.findOne({user_id: userId});

        if (!favourite || favourite.books_isbn13.length === 0){
            res.status(200).json({favouriteBooks: []});
            return;
        }

        const books = await Book.find({isbn13: {$in: favourite.books_isbn13}})
            .select('isbn13 title authors -_id');
        res.status(200).json({favouriteBooks: books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})
export default router;
