import express, { Request, Response, Router } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { protect } from "../middleware/authMiddleware";

dotenv.config();

const router: Router = express.Router();

//register

router.post('/register', async (req: Request, res: Response) => {
    const { nickname, email, password } = req.body;

    if (!email || !password || !nickname) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password should be at least 8 characters" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ nickname, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ message: "Error", error: e });
    }
});

//login

router.post('/login', async (req: Request, res: Response) =>{
    const {email, password} = req. body;
    
    if (!email || !password) return res.status(400).json({message:"fill email AND password"});

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "No user found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Wrong password"});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET as string, {expiresIn: '1h'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
          });
          
          res.json({ message: 'Login successful' });
    }catch(e){
        res.status(500).json({message:"Server Error", e})
    }
});

//profile

router.get('/profile',protect, async (req: express.Request & { user?: any }, res: Response) =>{
    try{
        const user = await User.findById(req.user?._id).select('-password');
        if(!user) return res.status(404).json({message: "User not found"});
        res.json({
            nickname: user.nickname,
            email: user.email,
          });
    }catch(e){
        res.status(500).json({message:"Server Error", e})
    }
})

//sign out
router.post('/logout', async(req: Request, res: Response) =>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({message: "Login out successful"})

    }catch(e){
        res.status(500).json({message:"Server error", e})
    }
})

export default router;