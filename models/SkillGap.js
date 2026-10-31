import mongoose from 'mongoose';

const skillGapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetRole: { type: String, required: true, trim: true, maxlength: 120 },
    currentSkills: [{
        name: { type: String, required: true, trim: true, maxlength: 80 },
        source: { type: String, enum: ['manual'], default: 'manual' },
        level: { type: String, enum: ['unverified'], default: 'unverified' }
    }],
    jobDescription: { type: String, default: '', maxlength: 12000 },
    guidanceType: { type: String, enum: ['job-description', 'general-role'], required: true },
    readinessScore: { type: Number, required: true, min: 0, max: 100 },
    scoreExplanation: { type: String, required: true, maxlength: 1000 },
    requiredSkills: [{
        name: { type: String, required: true, maxlength: 100 },
        importance: { type: String, enum: ['high', 'medium', 'low'], required: true },
        evidenceStatus: { type: String, enum: ['documented', 'partial', 'not-provided'], required: true },
        matchedCurrentSkill: { type: String, default: '', maxlength: 80 },
        reason: { type: String, required: true, maxlength: 500 },
        estimatedLearningHours: { type: Number, required: true, min: 1, max: 1000 }
    }],
    matchedSkills: [{
        name: { type: String, required: true, maxlength: 100 },
        importance: { type: String, enum: ['high', 'medium', 'low'], required: true },
        reason: { type: String, required: true, maxlength: 500 }
    }],
    missingSkills: [{
        name: { type: String, required: true, maxlength: 100 },
        priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
        reason: { type: String, required: true, maxlength: 500 },
        estimatedLearningHours: { type: Number, required: true, min: 1, max: 1000 }
    }],
    improvementAreas: [{
        name: { type: String, required: true, maxlength: 100 },
        reason: { type: String, required: true, maxlength: 500 },
        suggestion: { type: String, required: true, maxlength: 500 }
    }],
    learningRoadmap: [{
        phase: { type: Number, required: true, min: 1 },
        title: { type: String, required: true, maxlength: 160 },
        durationWeeks: { type: Number, required: true, min: 1, max: 24 },
        topics: [{ type: String, required: true, maxlength: 200 }],
        project: { type: String, required: true, maxlength: 500 },
        outcome: { type: String, required: true, maxlength: 500 }
    }],
    projectRecommendations: [{
        title: { type: String, required: true, maxlength: 160 },
        description: { type: String, required: true, maxlength: 500 },
        skills: [{ type: String, required: true, maxlength: 100 }],
        technologies: [{ type: String, required: true, maxlength: 100 }],
        difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
        expectedOutcome: { type: String, required: true, maxlength: 500 }
    }],
    nextSteps: [{ type: String, required: true, maxlength: 300 }],
    progress: {
        completedItems: { type: [{
            itemId: { type: String, required: true },
            completedAt: { type: Date, required: true, default: Date.now }
        }], default: [] }
    }
}, { timestamps: true });

skillGapSchema.index({ user: 1, createdAt: -1 });

const SkillGap = mongoose.model('SkillGap', skillGapSchema);
export default SkillGap;
