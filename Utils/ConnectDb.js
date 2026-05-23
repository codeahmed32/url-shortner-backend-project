import mongoose from 'mongoose';

const ConnectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Data Base Connected")
    } catch (err) {
        console.log("Db connection Error",err)
    }
}

export default ConnectDb;