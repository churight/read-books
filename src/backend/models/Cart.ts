import mongoose, { Document, Schema } from "mongoose";

export interface CartDocument extends Document {
    user_id: string;
    books_isbn13: number[];
}

const CartSchema: Schema = new Schema({
    user_id: {type:String},
    books_isbn13: [{type:Number}]
})

const cartDb=mongoose.connection.useDb('cart-db');
export const Cart = cartDb.model<CartDocument>('cart', CartSchema)