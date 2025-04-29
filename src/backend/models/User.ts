import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
    nickname: string,
    email:string,
    password: string
}

const UserSchema: Schema = new Schema<IUser>({
    nickname: {type:String, required: true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required: true}
})

export const User = mongoose.model<IUser>('User', UserSchema)