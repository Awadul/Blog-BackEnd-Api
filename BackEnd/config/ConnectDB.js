import mongoose from 'mongoose';
import 'dotenv/config'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected successfully to the database");
    } catch (error) {
        console.error("error in connecting to database");
        throw error;
    }
}