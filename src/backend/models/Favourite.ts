import mongoose, { Schema } from "mongoose";

const FavouriteSchema: Schema = new Schema({
    user_id: String,
    books_id: [String]
})

const favouriteDb=mongoose.connection.useDb('favourite-books-db');
export const Favourite = favouriteDb.model('Favoutite_Books', FavouriteSchema)