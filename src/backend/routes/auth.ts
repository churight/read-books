import express from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();

//register

router.post('/register', async (req, res) =>{
    const {nickname, email, password} = req.body;

    if(!email||!password||!nickname){
        return res.status(400).json({message:"Please enter all fields"})
    }

    if (password.length<8){
        return res.status(400).json({message: "Password should be at least 8 characters"})
    }

    try{
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message: "User already exists"})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({nickname, email, password:hashedPassword});
        await user.save();

        res.status(201).json({message: "user registered successful"})
    }catch(e){
        res.status(500).json({message:"Error", e})
    }
});

//login

router.post('/login', async (req, res) =>{
    const {email, password} = req. body;
    
    if (!email || !password) return res.status(400).json({message:"fill email AND password"});

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "No user found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Wrong password"});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET as string, {expiresIn: '1h'})

        res.json({token});
    }catch(e){
        res.status(500).json({message:"Server Error", e})
    }
});

export default router;