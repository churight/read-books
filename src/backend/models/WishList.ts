import mongoose, { Document, Schema } from "mongoose";

export interface WishListDocument extends Document {
    user_id: string;
    books_isbn13: number[];
}

const WishListSchema: Schema = new Schema({
    user_id: {type:String},
    books_isbn13: [{type:Number}]
})

const wishListeDb=mongoose.connection.useDb('wish-list-db');
export const WishList = wishListeDb.model<WishListDocument>('Wish_list', WishListSchema)