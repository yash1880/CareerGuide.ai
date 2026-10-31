import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: Object, required: true },
    recommendedCareer: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Assessment', assessmentSchema);