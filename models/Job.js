import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: 
    { 
        type: String, 
        required: true 
    },
    company: 
    { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true
    },
    salary: 
    { 
        type: String 
    },
    type: 
    { 
        type: String, 
        default: 'Full-time' 
    },
    description: 
    { 
        type: String 
    },
    requirements: {
        type: [String],
        default: []
    },
    postedDate: 
    { 
        type: String, 
        default: 'Recently' 
    },
    applyLink: 
    { 
        type: String, 
        default: '#' 
    }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);