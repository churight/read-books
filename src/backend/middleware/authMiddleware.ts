import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request{
    user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) =>{
    const token = req.header('Authorization')?.replace('Bearer', '');

    if(!token) return res.status(401).json({message: "No token"});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    }catch(e){
        return res.status(401).json({message: 'Token is not valid'});
    }

}