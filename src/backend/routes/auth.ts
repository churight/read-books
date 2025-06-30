import express, { Request, Response, Router } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { protect } from "../middleware/authMiddleware";
import {OAuth2Client} from 'google-auth-library';

dotenv.config();

const router = express.Router();

//register

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { nickname, email, password } = req.body;

    if (!email || !password || !nickname) {
        res.status(400).json({ message: "Please enter all fields" });
        return;
    }

    if (password.length < 8) {
        res.status(400).json({ message: "Password should be at least 8 characters" });
        return;
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser){
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ nickname, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ message: "Error", error: e });
    }
});

//login

router.post('/login', async (req: Request, res: Response): Promise<void> =>{
    const {email, password} = req. body;
    
    if (!email || !password) {
        res.status(400).json({message:"fill email AND password"});
        return;
        }
    try{
        const user = await User.findOne({email});
        if(!user) {
            res.status(400).json({message: "No user found"});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(400).json({message: "Wrong password"});
            return;
        }

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

router.get('/profile',protect, async (req: Request & { user?: any }, res: Response): Promise<void> =>{
    try{
        const user = await User.findById(req.user?._id).select('-password');
        if(!user) {
            res.status(404).json({message: "User not found"});
            return;
        }
        res.json({
            nickname: user.nickname,
            email: user.email,
            profilePicture: user.profilePicture
          });
    }catch(e){
        res.status(500).json({message:"Server Error", e})
    }
})

//sign out
router.post('/logout', async(req: Request, res: Response): Promise<void> =>{
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
});

//google auth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async(req: Request, res:Response):Promise<void> =>{
    const {token} = req.body;

    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if(!payload){
            res.status(400).json({message: "Invalid google token"});
            return;
        }

        const {email, name, picture} = payload;

        let user = await User.findOne({email});

        //autoregister if user not found
        if(!user){
            user = new User({
                email,
                nickname: name,
                password: '',
                profilePicture: picture,
                provider: 'google',
            });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
            });

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        res.json({ message: 'Google login successful' });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "server error"})
    }
})

export default router;