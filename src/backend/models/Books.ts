import mongoose, { Schema } from "mongoose";

const BookSchema: Schema = new Schema({
    isbn13: Number,
    isbn10: Number,
    title: String,
    authors: [String],
    categories: [String],
    thumbnail: String,
    description: String,
    published_year: Number,
    average_rating: Number,
    num_pages: Number,
    ratings_count: Number
})
const booksDb = mongoose.connection.useDb('books-data');
export const Book = booksDb.model('Book', BookSchema)