import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    careerTitle: { type: String, required: true, trim: true, maxlength: 100 },
    currentSkills: { type: String, default: '', maxlength: 2000 },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    weeklyHours: { type: Number, required: true, min: 1, max: 40 },
    overview: { type: String, required: true, maxlength: 2000 },
    totalDuration: { type: String, required: true, maxlength: 100 },
    totalWeeks: { type: Number, min: 1, max: 80 },
    phases: [{
        stepNumber: { type: Number, required: true, min: 1 },
        title: { type: String, required: true, maxlength: 160 },
        durationWeeks: { type: Number, min: 2, max: 10 },
        topics: [{ type: String, required: true, maxlength: 300 }],
        outcomes: [{ type: String, maxlength: 300 }],
        duration: { type: String, required: true, maxlength: 80 },
        project: { type: String, required: true, maxlength: 1000 },
        resources: [{ type: String, maxlength: 500 }],
        weeklyPlan: [{
            weekNumber: { type: Number, min: 1, max: 10 },
            focus: { type: String, maxlength: 200 },
            tasks: [{ type: String, maxlength: 300 }],
            deliverable: { type: String, maxlength: 500 }
        }]
    }]
}, { timestamps: true });

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
