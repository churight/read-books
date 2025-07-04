import express from "express"
import { protect } from "../middleware/authMiddleware";
import { verifyAndRefreshToken } from "../middleware/refreshToken";
import { AuthRequest } from "../models/AuthRequest";
import { MyBooks } from "../models/MyBooks";
import { Cart } from "../models/Cart";
import { Book } from "../models/Books";
import { WishList } from "../models/WishList";
import { User } from "../models/User";

const router = express.Router();

//adding to cart
router.post('/add/cart', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { isbn13 } = req.body;

        if (!isbn13) {
            res.status(400).json({ message: "ISBN13 is required" });
            return;
        }

        //if the books is in my-books it cannot be added to cart
        const myBooks = await MyBooks.findOne({ user_id: userId });

        if (myBooks && myBooks.books_isbn13.includes(isbn13)) {
        res.status(409).json({ message: "Book already in your library (My Books)" });
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


router.get('/cart', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void> =>{
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
            .select('isbn13 title authors thumbnail description -_id');
        res.status(200).json({books});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.post('/cart/checkout', protect, verifyAndRefreshToken, async (req: AuthRequest, res):Promise<void>=>{
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

        const totalPrice = cart.books_isbn13.length * 5;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if ((user.balance ?? 0) < totalPrice) {
            res.status(400).json({ message: "Insufficient balance" });
            return;
        }

        //  Deduct balance
        user.balance -= totalPrice;
        await user.save();

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

        const wishlist = await WishList.findOne({user_id: userId});

        if(wishlist){
            const updateWishList = wishlist.books_isbn13.filter(
                isbn => !cart.books_isbn13.includes(isbn)
            );

            if(updateWishList.length !== wishlist.books_isbn13.length){
                wishlist.books_isbn13=updateWishList;
                await wishlist.save();
            }
        }

        res.status(200).json({message: "Books moved to My Books"})
    }catch(error){
        console.error(error);
        res.status(500)
    }
});

router.delete('/delete/cart', protect, verifyAndRefreshToken, async (req: AuthRequest, res): Promise<void> => {
    try {
        const userId = req.user?.id;
        const isbn13 = String(req.query.isbn13).trim();

        if (!isbn13) {
            res.status(400).json({ message: "ISBN13 is required" });
            return;
        }

        const cart = await Cart.findOne({
            user_id: userId,
            status: "waiting for purchase",
        });

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const initialLength = cart.books_isbn13.length;
        cart.books_isbn13 = cart.books_isbn13.filter((id) => String(id) !== isbn13);

        if (cart.books_isbn13.length === initialLength) {
            res.status(404).json({ message: "Book not found in cart" });
            return;
        }

        await cart.save();
        res.status(200).json({ message: "Book removed from cart", cart });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;