import { Request } from "express";

export interface AuthRequest extends Request{
    cookies: any;
    user?: any;
}