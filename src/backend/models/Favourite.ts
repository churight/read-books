import mongoose, { Schema } from "mongoose";

const FavouriteSchema: Schema = new Schema({
    user_id: {type:String},
    books_isbn13: [{type:Number}]
})

const favouriteDb=mongoose.connection.useDb('favourite-books-db');
export const Favourite = favouriteDb.model('Favoutite_Books', FavouriteSchema)