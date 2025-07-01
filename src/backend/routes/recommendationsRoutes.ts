import express from "express"
import { AuthRequest } from "../models/AuthRequest";
import { protect } from "../middleware/authMiddleware";
import { verifyAndRefreshToken } from "../middleware/refreshToken";
import { Favourite } from "../models/Favourite";
import { MyBooks } from "../models/MyBooks";
import { WishList } from "../models/WishList";
import { Book, BookDocument } from "../models/Books";
const router = express.Router();

router.get('/recommended', protect, verifyAndRefreshToken, async(req:AuthRequest, res):Promise<void>=>{
    try{
        const userId=req.user.id;

        const [fav, myBooks, wishList] = await Promise.all([
            Favourite.findOne({user_id: userId}),
            MyBooks.findOne({user_id: userId}),
            WishList.findOne({user_id: userId})
        ]);

        const favIds = fav?.books_isbn13 || [];
        const myBooksIds=myBooks?.books_isbn13 || [];
        const wishListIds = wishList?.books_isbn13 ||[];

        const allUserIsbn13Set = new Set([...favIds, ...myBooksIds, ...wishListIds]);
        const allUserIsbn13 = Array.from(allUserIsbn13Set);

        const userBooks:BookDocument[]  = await Book.find({isbn13: {$in: allUserIsbn13}});

        const categoryCounts: Record<string, number> = {};

        userBooks.forEach(book => {
            book.categories?.forEach((cat: string) =>{
                categoryCounts[cat] = (categoryCounts[cat] || 0) +1;

            })
        })

         const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat);

        const recommended = await Book.find({
        categories: { $in: sortedCategories.slice(0, 3) },
        isbn13: { $nin: allUserIsbn13 }
        }).limit(10);

        res.json(recommended);
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
});

//get most viewed books
router.get('/popular', async(req: AuthRequest, res):Promise<void> =>{
    try{
        const topBooks = await Book.find({})
        .sort({ratings_count: -1})
        .limit(10)
        .select('isbn13 title authors thumbnail -_id');

        res.status(200).json({ books: topBooks });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
})

//get books with highest rating
router.get('/highest-rating', async(req: AuthRequest, res):Promise<void> =>{

    try{
        const topRatingBooks = await Book.find({})
        .sort({average_rating: -1})
        .limit(10)
        .select('isbn13 title authors thumbnail -_id');

        res.status(200).json({ books: topRatingBooks });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
    
})

//get newest
router.get('/newest', async(req: AuthRequest, res):Promise<void> =>{

    try{
        const newBooks = await Book.find({})
        .sort({published_year: -1})
        .limit(10)
        .select('isbn13 title authors thumbnail -_id');

        res.status(200).json({ books: newBooks });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
    
})

export default router;