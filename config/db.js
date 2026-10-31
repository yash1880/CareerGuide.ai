import mongoose from 'mongoose';

// Serverless me connection cache karna zaroori hai
let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    // Local me fallback chalega, Vercel pe MONGO_URI zaroori hai
    const uri =
        process.env.MONGO_URI ||
        (process.env.VERCEL ? null : 'mongodb://localhost:27017/career-guide');

    if (!uri) {
        throw new Error('MONGO_URI environment variable set nahi hai');
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(uri, { bufferCommands: false })
            .then((m) => {
                console.log('✅ Connected to MongoDB successfully!');
                return m;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }

    return cached.conn;
};

export default connectDB;