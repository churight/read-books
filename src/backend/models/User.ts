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

const authDb = mongoose.connection.useDb('auth_db');

export const User = authDb.model<IUser>('User', UserSchema)