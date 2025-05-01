import mongoose, { Schema } from "mongoose";

//the idea right now is to save it in different db and download reviews by book_id (maybe isbn13 if its even valid method, cause i need to do more research) 

const ReviewSchema: Schema = new Schema({
    book_id: String,
    user_id: String,
    date: Date,
    review_text: String
})

const reviewDb=mongoose.connection.useDb('books-review-db');
export const Review = reviewDb.model('Review', ReviewSchema)
