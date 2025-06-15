import mongoose, { Schema } from "mongoose";

export interface ReviewDocument extends Document {
    user_id: String,
    book_isbn13: Number,
    review: String,
    date: Date,
    parentReviewId?: mongoose.Types.ObjectId | null
}

const ReviewSchema: Schema = new Schema <ReviewDocument>({
    user_id: {type: String, required: true},
    book_isbn13: {type: Number, required: true},
    review: {type:String, required: true},
    date: {type: Date, default: Date.now},
    parentReviewId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        default: null,
    }
})

const reviewDb=mongoose.connection.useDb('book-reviews-db');
export const Review = reviewDb.model('Reviews', ReviewSchema)
