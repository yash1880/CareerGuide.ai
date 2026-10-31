import mongoose from 'mongoose';

const sectionScoresSchema = new mongoose.Schema({
    formatting: { type: Number, min: 0, max: 100, required: true },
    contactInformation: { type: Number, min: 0, max: 100, required: true },
    summary: { type: Number, min: 0, max: 100, required: true },
    skills: { type: Number, min: 0, max: 100, required: true },
    experience: { type: Number, min: 0, max: 100, required: true },
    education: { type: Number, min: 0, max: 100, required: true },
    projects: { type: Number, min: 0, max: 100, required: true },
    certifications: { type: Number, min: 0, max: 100, required: true }
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
    resumeLength: { type: String, required: true },
    atsCompatibility: { type: String, required: true },
    actionVerbs: { type: String, required: true },
    quantifiedAchievements: { type: String, required: true },
    technicalSkills: { type: String, required: true },
    skillMatch: { type: String, required: true },
    experienceMatch: { type: String, required: true }
}, { _id: false });

const atsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeFileName: { type: String, required: true },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    summary: { type: String, required: true },
    sectionScores: { type: sectionScoresSchema, required: true },
    assessment: { type: assessmentSchema, required: true },
    keywords: {
        found: [{ type: String }],
        missing: [{ type: String }]
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    improvements: [{ type: String }],
    formattingIssues: [{ type: String }],
    grammarIssues: [{ type: String }],
    recommendations: [{ type: String }],
    jobDescription: { type: String, default: '' },
    targetRole: { type: String, default: '' }
}, { timestamps: true });

const AtsResult = mongoose.model('AtsResult', atsSchema);
export default AtsResult;
