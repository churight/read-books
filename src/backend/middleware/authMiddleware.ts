import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User";
import { AuthRequest } from "../models/AuthRequest";

dotenv.config();

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) =>{
    const token = req.cookies.token;

    if(!token) return res.status(401).json({message: "No token"});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof decoded === 'object' && 'id' in decoded) {
            const user = await User.findById(decoded.id).select('-password');
            if (!user) return res.status(404).json({ message: 'User not found' });
      
            req.user = user;
            next();
          } else {
            return res.status(401).json({ message: 'Invalid token payload' });
          }
    }catch(e){
        return res.status(401).json({message: 'Token is not valid'});
    }

}