import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [String],
    typicalResponsibilities: [String],
    starterProjects: [String],
    learningPath: [String],
    averageSalary: { type: String },
    growthRate: { type: String }
}, { timestamps: true });

export default mongoose.model('Career', careerSchema);