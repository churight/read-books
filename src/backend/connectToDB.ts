import mongoose from "mongoose";

const connectToDB = () =>{
    mongoose.connect('mongodb://localhost:27017/auth_db', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as mongoose.ConnectOptions)
    .then(() => console.log('Connected'))
    .catch(err => console.error(err));
}

export default connectToDB;