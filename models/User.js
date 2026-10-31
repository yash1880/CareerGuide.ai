import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function passwordRequired() {
            return !this.githubId;
        }
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    targetRole: {
        type: String,
        default: ''
    },
    githubLink: {
       type: String,
        default: ''
    },
    country: {
        type: String,
        default: 'India'
    },
    language: {
        type: String,
        default: 'English'
    },
    profileImage: {
        type: String,
        default: ''
    },
    aiCredits: {
        type: Number,
        default: 500
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;