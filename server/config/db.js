import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri || uri.includes('<username>')) {
            console.warn('⚠️  MONGODB_URI is not configured with your credentials in server/.env.');
            console.warn('⚠️  Please update MONGODB_URI in server/.env with your MongoDB Atlas or local MongoDB connection string.');
            return;
        }

        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
};

export default connectDB;
