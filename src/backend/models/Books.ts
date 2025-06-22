import mongoose, { Schema, Document } from "mongoose";

export interface BookDocument extends Document{
    isbn13: number,
    isbn10: number,
    title: string,
    authors: string[],
    categories: string[],
    thumbnail: string,
    description: string,
    published_year: number,
    average_rating: number,
    num_pages: number,
    ratings_count: number
}

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