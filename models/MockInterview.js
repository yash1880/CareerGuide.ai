import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
    score: { type: Number, required: true, min: 0, max: 10 }
}, { _id: false });

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true, maxlength: 2000 },
    topic: { type: String, required: true, trim: true, maxlength: 120 },
    kind: { type: String, required: true, trim: true, maxlength: 40 },
    options: {
        type: [{ type: String, required: true, maxlength: 1200 }],
        default: undefined,
        validate: {
            validator: (options) => options.length === 4 && new Set(options).size === 4,
            message: 'A multiple-choice question must have four distinct options.'
        }
    },
    correctOption: { type: Number, min: 0, max: 3 },
    answer: { type: String, default: '', maxlength: 10000 },
    referenceAnswer: { type: String, required: true, maxlength: 1200 },
    submissionStatus: {
        type: String,
        enum: ['pending', 'awaiting-score', 'evaluated'],
        default: 'pending'
    },
    evaluation: { type: evaluationSchema, default: undefined }
});

const finalReportSchema = new mongoose.Schema({
    totalScore: { type: Number, required: true, min: 0, max: 150 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    performanceSummary: { type: String, required: true, maxlength: 2000 },
    strongestTopics: [{ type: String, maxlength: 500 }],
    weakestTopics: [{ type: String, maxlength: 500 }],
    technicalKnowledgeAssessment: { type: String, required: true, maxlength: 2000 },
    codingDebuggingAssessment: { type: String, required: true, maxlength: 2000 },
    topicsToRevise: [{ type: String, maxlength: 500 }],
    improvementPlan: [{ type: String, maxlength: 500 }],
    questionResults: [{
        questionNumber: { type: Number, required: true, min: 1, max: 15 },
        question: { type: String, required: true, maxlength: 2000 },
        topic: { type: String, required: true, maxlength: 120 },
        kind: { type: String, required: true },
        answer: { type: String, required: true, maxlength: 10000 },
        score: { type: Number, required: true, min: 0, max: 10 },
        selfAssessed: { type: Boolean, default: false },
        correctPoints: [{ type: String, maxlength: 400 }],
        missingOrIncorrectPoints: [{ type: String, maxlength: 400 }],
        explanation: { type: String, required: true, maxlength: 2000 },
        modelAnswer: { type: String, required: true, maxlength: 4000 },
        suggestions: [{ type: String, maxlength: 400 }]
    }]
}, { _id: false });

const mockInterviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    language: { type: String, required: true, trim: true, maxlength: 50 },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
        default: 'hard'
    },
    responseMode: {
        type: String,
        enum: ['open-ended', 'multiple-choice']
    },
    interviewType: {
        type: String,
        required: true,
        enum: ['technical', 'coding-debugging', 'mixed']
    },
    questions: {
        type: [questionSchema],
        required: true,
        validate: {
            validator: (questions) => questions.length === 15,
            message: 'An interview must contain exactly 15 questions.'
        }
    },
    currentQuestion: { type: Number, required: true, min: 0, max: 15, default: 0 },
    status: {
        type: String,
        enum: ['in-progress', 'report-pending', 'completed'],
        default: 'in-progress',
        required: true
    },
    finalReport: { type: finalReportSchema, default: undefined },
    completedAt: { type: Date, default: null }
}, { timestamps: true });

mockInterviewSchema.index({ user: 1, createdAt: -1 });

const MockInterview = mongoose.model('MockInterview', mockInterviewSchema);
export default MockInterview;
