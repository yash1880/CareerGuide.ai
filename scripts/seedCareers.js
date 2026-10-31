import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Career from '../models/Career.js';
import careerPaths from '../data/careerPaths.js';
import connectDB from '../config/db.js';

dotenv.config();

try {
    await connectDB();
    const result = await Career.bulkWrite(careerPaths.map((career) => ({
        updateOne: {
            filter: { title: career.title },
            update: { $setOnInsert: career },
            upsert: true
        }
    })));
    console.log(`Career paths ready. Added ${result.upsertedCount} new paths.`);
} catch (error) {
    console.error('Career path seeding failed:', error);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
