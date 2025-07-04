import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRY_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const verifyAndRefreshToken = async (req: Request, res:Response, next:NextFunction):Promise<void> =>{
    const token = req.cookies?.token; //get token from cookies

    if(!token){
        res.status(401).json({message:'unauthorized'});
        return;
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const currentTime=Date.now();
        const expTime = decoded.exp*1000;

        const timeLeft = expTime - currentTime;

        if (timeLeft <TOKEN_EXPIRY_THRESHOLD_MS){
            const newToken = jwt.sign({id:decoded.id}, JWT_SECRET, {expiresIn:"1h"});

            res.cookie('token', newToken, {
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            })
        }

        next();
    }catch(err){
        res.status(401).json({message: 'token verification failed'});
        return;
    }

}