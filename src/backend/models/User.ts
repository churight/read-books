import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
    nickname: string,
    email:string,
    password: string,
    profilePicture?: string,
    provider?: 'google' | 'local',
    balance: number
}

const UserSchema: Schema = new Schema<IUser>({
    nickname: {type:String, required: function (this: IUser) {
      return this.provider !== 'google';
    }},
    email: {type:String, required:true, unique:true},
    password: {type:String, required: function (this: IUser) {
      return this.provider !== 'google'}
    },
    profilePicture:{type: String},
    provider: { type: String, enum: ['google', 'local'], default: 'local' },
    balance: {type: Number, default: 0}
})

const authDb = mongoose.connection.useDb('auth_db');

export const User = authDb.model<IUser>('User', UserSchema)