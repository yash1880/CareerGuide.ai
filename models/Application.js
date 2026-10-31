import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobOrInternshipId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['Job', 'Internship'], required: true },
    status: { type: String, enum: ['Applied', 'Reviewing', 'Accepted', 'Rejected'], default: 'Applied' }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);