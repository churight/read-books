import mongoose, { Document, Schema } from "mongoose";

export interface MyBooksDocument extends Document {
    user_id: string;
    books_isbn13: number[];
}

const MyBooksSchema: Schema = new Schema({
    user_id: {type:String},
    books_isbn13: [{type:Number}],
})

const myBooksDb=mongoose.connection.useDb('my-books-db');
export const MyBooks = myBooksDb.model<MyBooksDocument>('my_books', MyBooksSchema)