import express, { Router } from "express";
import { Book } from "../models/Books";
import { protect } from "../middleware/authMiddleware";
import { Favourite } from "../models/Favourite";
import { AuthRequest } from "../models/AuthRequest";
//import { Cart } from "../models/Cart";
import {verifyAndRefreshToken} from "../middleware/refreshToken"
import { MyBooks } from "../models/MyBooks";
import { WishList } from "../models/WishList";
import { Review } from "../models/Review";
import mongoose from "mongoose";

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
    const limit = 15;
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

router.post('/add/favourite', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void>=>{
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

router.get('/favourites', protect, verifyAndRefreshToken, async(req: AuthRequest, res): Promise<void> =>{
    try{
        const userId = req.user.id;
        
        const favourite = await Favourite.findOne({user_id: userId});

        if (!favourite || favourite.books_isbn13.length === 0){
            res.status(200).json({favouriteBooks: []});
            return;
        }

        const books = await Book.find({isbn13: {$in: favourite.books_isbn13}})
            .select('isbn13 title authors thumbnail -_id');
        res.status(200).json({books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.delete ('/delete/favourite', protect, verifyAndRefreshToken, async(req: AuthRequest, res):Promise<void> =>{
    try{
        const userId = req.user?.id;
        const isbn13 = Number(req.query.isbn13);

        if(!isbn13){
            res.status(400).json({message: "isbn13 required"});
            return;
        }

        const favourite = await Favourite.findOne({user_id: userId});

        if(!favourite){
            res.status(404).json({message: "Book not found"});
            return;
        }

        const index = favourite.books_isbn13.indexOf(isbn13);
        if (index === -1){
            res.status(404).json({message: "Book not found"});
            return;
        }

        favourite.books_isbn13.splice(index, 1);
        await favourite.save();

        res.status(200).json({ message: "Book removed from favourite", favourite });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"})
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


router.get('/my-books', protect, verifyAndRefreshToken, async(req: AuthRequest, res): Promise<void> =>{
    try{
        const userId = req.user.id;
        
        const my_books = await MyBooks.findOne({user_id: userId});

        if (!my_books || my_books.books_isbn13.length === 0){
            res.status(200).json({books: []});
            return;
        }

        const books = await Book.find({isbn13: {$in: my_books.books_isbn13}})
            .select('isbn13 title authors thumbnail -_id');
        res.status(200).json({books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.post('/add/wish-list', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void>=>{
    try {
        const userId = req.user.id;
        const { isbn13 } = req.body;

        if (!isbn13) {
            res.status(400).json({ message: "ISBN13 is required" });
            return;
        }
        //if the books is in my-books it cannot be added to wish list
        const myBooks = await MyBooks.findOne({ user_id: userId });

        if (myBooks && myBooks.books_isbn13.includes(isbn13)) {
        res.status(409).json({ message: "Book already in your library (My Books)" });
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

router.get('/wish-list', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void> => {
    try {
        const userId = req.user.id;

        const wishList = await WishList.findOne({ user_id: userId });

        if (!wishList || wishList.books_isbn13.length === 0) {
            res.status(200).json({ books: [] });
            return;
        }

        const books = await Book.find({ isbn13: { $in: wishList.books_isbn13 } })
            .select('isbn13 title authors thumbnail -_id');
        
        res.status(200).json({ books }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete ('/delete/wish-list', protect, verifyAndRefreshToken, async(req: AuthRequest, res):Promise<void> =>{
    try{
        const userId = req.user?.id;
        const isbn13 = Number(req.query.isbn13);

        if(!isbn13){
            res.status(400).json({message: "isbn13 required"});
            return;
        }

        const wishList = await WishList.findOne({user_id: userId});

        if(!wishList){
            res.status(404).json({message: "Book not found"});
            return;
        }

        const index = wishList.books_isbn13.indexOf(isbn13);
        if (index === -1){
            res.status(404).json({message: "Book not found"});
            return;
        }

        wishList.books_isbn13.splice(index, 1);
        await wishList.save();

        res.status(200).json({ message: "Book removed from wish list", wishList });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
})

//routes for posting/getting reviews

router.post('/books/:isbn13/reviews', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void> =>{
    const {review, parentReviewId} = req.body;
    const userId = req.user.id;

    if (!review || typeof review !== 'string'){
        res.status(400).json({message:'Review text is required'});
        return;
    }

    try{
        const newReview = new Review({
            user_id: userId,
            book_isbn13: parseInt(req.params.isbn13),
            review: review,
            parentReviewId: parentReviewId || null
        });

        await newReview.save();
        res.status(201).json({message: 'Review posted'})
        console.log('saved')
    }catch(err){
        console.error("Error saving review:", err);
        res.status(500).json({message: 'Error saving review'})
    }
})


//idk if its gonna work
router.get('/books/:isbn13/reviews', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void> =>{
    const isbn13 = parseInt(req.params.isbn13);

    try{
        const allReviews = await Review.find({book_isbn13: isbn13}).lean();

        //console.log('Found reviews:', allReviews.length);

        const topLevel = allReviews.filter(r => !r.parentReviewId);
        const replies = allReviews.filter(r => r.parentReviewId);

        const repliesMap = new Map<string, any[]>();
        for (const reply of replies) {
        const parentId = reply.parentReviewId?.toString();
        if (!repliesMap.has(parentId)) repliesMap.set(parentId, []);
        repliesMap.get(parentId)!.push(reply);
        }

        const reviewsWithReplies = topLevel.map(r => ({
        ...r,
        replies: repliesMap.get((r._id as mongoose.Types.ObjectId).toString()) || []
        }));

        res.json({ reviews: reviewsWithReplies });
        //console.log('displayed')
    }catch(err){
         console.error("Error getting review:", err);
        res.status(500).json({message:'Error fetching', err})
    }
})
export default router;
