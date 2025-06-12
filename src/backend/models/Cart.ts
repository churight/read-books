import mongoose, { Document, Schema } from "mongoose";

export interface CartDocument extends Document {
    user_id: string;
    purchase_id: number;
    books_isbn13: number[];
    status: string;
}

const CartSchema: Schema = new Schema({
    user_id: {type:String},
    purchase_id: {type: Number, required: true},
    books_isbn13: [{type:Number}],
    status: {type:String},

})

CartSchema.index({ user_id: 1, purchase_id: 1 }, { unique: true });

const cartDb=mongoose.connection.useDb('cart-db');
export const Cart = cartDb.model<CartDocument>('cart', CartSchema)