import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    atsScore: { type: Number, default: 0 },
    missingKeywords: [String],
    suggestions: [String]
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);