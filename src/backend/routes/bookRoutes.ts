import express, { Router } from "express";
import { Book } from "../models/Books";
import { protect } from "../middleware/authMiddleware";
import { Favourite } from "../models/Favourite";
import { AuthRequest } from "../models/AuthRequest";
import { Cart } from "../models/Cart";

const router: Router = express.Router();

//display books (for home pagem)

router.get('/home', async (req, res) =>{ // need to rewrite it overall, cause so far works only for 10 books
    try{
        const book = await Book.find().limit(10);
        res.json(book);
    }catch(e){
        res.status(500).json({message:"Internall server error", e})
}
});

router.get('/browse', async (req, res) =>{
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = 10;
    const skip = (page - 1) * limit;

    try{
        const books = await Book.find().skip(skip).limit(limit);
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        res.json({
        books,
        currentPage: page,
        totalPages,
        });

    }catch(e){
        res.status(500).json({message:"Internal server error", e})
    }
})

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

router.post('/add/favourite', protect, async (req: AuthRequest, res): Promise<void>=>{
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
        res.status(200).json({books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/search', async (req, res): Promise<void> =>{
    const {query, sortBy, order} = req.query;
    //console.log('Received query:', query);

    if(!query || typeof query !== 'string'){
        res.status(400).json({message: 'type query'});
        return;
    }

    const sortFields = ['published_year', 'num_pages', 'average_rating'];
    const sortField = sortFields.includes(String(sortBy)) ? String (sortBy): null;
    const sortOrder = order === 'desc' ? -1: 1; //default sorting order descending

    try{
        const books = await Book.find({
            $or: [
                {title: {$regex: query, $options: 'i'}},
                {authors: {$regex: query, $options: 'i'}},
            ]
        }). sort (
            sortField ? {[sortField]: sortOrder}: {}
        );
        res.json(books); // im dumb bitch, i forgot to send response aaaaaaaaaaaaaaaaaaaaaaaaaaa
    }catch(err){
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

//adding to cart
router.post('/add/cart', protect, async (req: AuthRequest, res): Promise<void>=>{
    try {
        const userId = req.user.id;
        const { isbn13 } = req.body;

        if (!isbn13) {
            res.status(400).json({ message: "ISBN13 is required" });
            return;
        }

        // Check if user already has a favourites document
        let cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
            // Create a new favourites document for the user
            cart = new Cart({
                user_id: userId,
                books_isbn13: [isbn13],
            });
        } else {
            // Avoid adding duplicates
            if (!cart.books_isbn13.includes(isbn13)) {
                cart.books_isbn13.push(isbn13);
            } else {
                res.status(409).json({ message: "Book already in cart" });
                return;
            }
        }

        await cart.save();
        res.status(200).json({ message: "Book added to cart", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/cart', protect, async (req: AuthRequest, res): Promise<void> =>{
    try{
        const userId = req.user.id;
        
        const cart = await Cart.findOne({user_id: userId});

        if (!cart || cart.books_isbn13.length === 0){
            res.status(200).json({cart: []});
            return;
        }

        const books = await Book.find({isbn13: {$in: cart.books_isbn13}})
            .select('isbn13 title authors -_id');
        res.status(200).json({cart: books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

export default router;
