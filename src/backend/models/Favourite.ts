import mongoose, { Document, Schema } from "mongoose";

export interface FavouriteDocument extends Document {
    user_id: string;
    books_isbn13: number[];
}

const FavouriteSchema: Schema = new Schema({
    user_id: {type:String},
    books_isbn13: [{type:Number}]
})

const favouriteDb=mongoose.connection.useDb('favourite-books-db');
export const Favourite = favouriteDb.model<FavouriteDocument>('Favoutite_Books', FavouriteSchema)