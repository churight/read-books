import express, { Router } from "express";
import { Book } from "../models/Books";
import { protect } from "../middleware/authMiddleware";
import { Favourite } from "../models/Favourite";
import { AuthRequest } from "../models/AuthRequest";
import { Cart } from "../models/Cart";
import {verifyAndRefreshToken} from "../middleware/refreshToken"
import { MyBooks } from "../models/MyBooks";
import { WishList } from "../models/WishList";

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
    const limit = 12;
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
router.post('/add/cart', protect, async (req: AuthRequest, res): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { isbn13 } = req.body;

        if (!isbn13) {
            res.status(400).json({ message: "ISBN13 is required" });
            return;
        }

        // Find active cart
        let cart = await Cart.findOne({
            user_id: userId,
            status: "waiting for purchase"
        });

        if (cart) {
            if (cart.books_isbn13.includes(isbn13)) {
                res.status(409).json({ message: 'Book already in cart' });
                return;
            }
            cart.books_isbn13.push(isbn13);
        } else {
            // Safely get last purchase_id
            const lastCart = await Cart.findOne({}).sort({ purchase_id: -1 }).lean();
            const nextPurchaseId = lastCart ? lastCart.purchase_id + 1 : 1;

            cart = new Cart({
                user_id: userId,
                purchase_id: nextPurchaseId,
                books_isbn13: [isbn13],
                status: 'waiting for purchase',
            });
        }

        const savedCart = await cart.save();
        res.status(200).json({ message: 'Book added to cart', cart: savedCart });

    } catch (error: any) {
        console.error("Add to cart error:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get('/cart', protect, async (req: AuthRequest, res): Promise<void> =>{
    try{
        const userId = req.user.id;
        
        const cart = await Cart.findOne({
            user_id: userId, 
            status: { $ne: "payed for" } // only show if not payed
            }).sort({purchase_id: -1});

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

router.post('/cart/checkout', protect, async (req: AuthRequest, res):Promise<void>=>{
    try{
        const userId=req.user.id;

        const cart = await Cart.findOne({
                user_id: userId,
                status: "waiting for purchase"
            }).sort({purchase_id: -1})
        
        if (!cart||cart.books_isbn13.length===0||cart.status==="payed for"){
            res.status(400).json({message:"cart is empty or payed for"});
            return;
        }

        cart.status = "payed for";
        await cart.save();

        let myBooks = await MyBooks.findOne({user_id:userId});

        if(!myBooks){
            myBooks = new MyBooks({
                user_id:userId,
                books_isbn13:[...cart.books_isbn13],
            });
        }
        else{
            const newBooks = cart.books_isbn13.filter(
                isbn => !myBooks?.books_isbn13.includes(isbn)
            );

            myBooks.books_isbn13.push(...newBooks);
        }

        await myBooks.save();

        res.status(200).json({message: "Books moved to My Books"})
    }catch(error){
        console.error(error);
        res.status(500)
    }
});

router.get('/my-books', protect, async(req: AuthRequest, res): Promise<void> =>{
    try{
        const userId = req.user.id;
        
        const my_books = await MyBooks.findOne({user_id: userId});

        if (!my_books || my_books.books_isbn13.length === 0){
            res.status(200).json({MyBooks: []});
            return;
        }

        const books = await Book.find({isbn13: {$in: my_books.books_isbn13}})
            .select('isbn13 title authors -_id');
        res.status(200).json({books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.post('/add/wish-list', protect, async (req: AuthRequest, res): Promise<void>=>{
    try {
        const userId = req.user.id;
        const { isbn13 } = req.body;

        if (!isbn13) {
            res.status(400).json({ message: "ISBN13 is required" });
            return;
        }

        // Check if user already has a favourites document
        let wishList = await WishList.findOne({ user_id: userId });

        if (!wishList) {
            // Create a new favourites document for the user
            wishList = new WishList({
                user_id: userId,
                books_isbn13: [isbn13],
            });
        } else {
            // Avoid adding duplicates
            if (!wishList.books_isbn13.includes(isbn13)) {
                wishList.books_isbn13.push(isbn13);
            } else {
                res.status(409).json({ message: "Book already in wish list" });
                return;
            }
        }

        await wishList.save();
        res.status(200).json({ message: "Book added to wish list", wishList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/wish-list', protect, async(req: AuthRequest, res): Promise<void> =>{
    try{
        const userId = req.user.id;
        
        const wishList = await WishList.findOne({user_id: userId});

        if (!wishList || wishList.books_isbn13.length === 0){
            res.status(200).json({wishList: []});
            return;
        }

        const books = await Book.find({isbn13: {$in: wishList.books_isbn13}})
            .select('isbn13 title authors -_id');
        res.status(200).json({books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})
export default router;
