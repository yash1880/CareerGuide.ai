import User from '../models/User.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Internship from '../models/Internship.js';
import { v2 as cloudinary } from 'cloudinary';

const PROFILE_FIELDS = ['name', 'email', 'targetRole', 'githubLink', 'country', 'language', 'profileImage'];

async function uploadProfileImage(buffer) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
    });

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'career-guidance/profile-images', resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                if (!result?.secure_url) {
                    return reject(new Error('Cloudinary did not return a secure image URL.'));
                }
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
}

export function getProfileCompletion(user) {
    const completedFields = PROFILE_FIELDS.filter((field) =>
        typeof user[field] === 'string' && user[field].trim().length > 0
    ).length;
    return Math.round((completedFields / PROFILE_FIELDS.length) * 100);
}

function getProfileFormValue(value, field, maxLength) {
    if (typeof value !== 'string') {
        throw new TypeError(`${field} must be text.`);
    }
    const normalized = value.trim();
    if (normalized.length > maxLength) {
        throw new RangeError(`${field} must be ${maxLength} characters or fewer.`);
    }
    return normalized;
}

function normalizeGithubLink(value) {
    if (!value) return '';
    const usernameOrUrl = value.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/$/, '');
    if (!/^[A-Za-z0-9-]{1,39}$/.test(usernameOrUrl)) {
        throw new TypeError('Enter a valid GitHub username or github.com profile link.');
    }
    return `https://github.com/${usernameOrUrl}`;
}

// 1. Render Dashboard with Dynamic Logged-In User Data
export const getDashboard = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.redirect('/auth/login');
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.redirect('/auth/login');
        }

        const storedApplications = await Application.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .lean();
        const jobIds = storedApplications
            .filter((application) => application.type === 'Job')
            .map((application) => application.jobOrInternshipId);
        const internshipIds = storedApplications
            .filter((application) => application.type === 'Internship')
            .map((application) => application.jobOrInternshipId);
        const [jobs, internships] = await Promise.all([
            Job.find({ _id: { $in: jobIds } }).select('title company').lean(),
            Internship.find({ _id: { $in: internshipIds } }).select('title company').lean()
        ]);
        const opportunities = new Map([
            ...jobs.map((item) => [`Job:${item._id}`, item]),
            ...internships.map((item) => [`Internship:${item._id}`, item])
        ]);
        const applications = storedApplications.map((application) => {
            const opportunity = opportunities.get(`${application.type}:${application.jobOrInternshipId}`);
            return {
                ...application,
                companyName: opportunity?.company || 'Opportunity no longer available',
                role: opportunity?.title || 'Opportunity details unavailable',
                dateApplied: application.createdAt
            };
        });

        res.render('dashboard', { 
            user: user, 
            applications,
            path: '/dashboard'
        });

    } catch (err) {
        console.error("Dashboard Load Error:", err);
        res.status(500).send("Unable to load dashboard.");
    }
};

// 2. Fetch User Profile Page
export const getUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.redirect('/auth/login');
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.redirect('/auth/login');
        }

        res.render('profile', {
            user,
            path: '/users/profile',
            profileCompletion: getProfileCompletion(user)
        });

    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).send("Server Error");
    }
};

// 3. Update User Profile / Onboarding Data & Profile Image
export const updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.redirect('/auth/login');
        }

        const updateData = {
            name: getProfileFormValue(req.body.name || '', 'Name', 100),
            targetRole: getProfileFormValue(req.body.targetRole || '', 'Target role', 100),
            githubLink: normalizeGithubLink(getProfileFormValue(req.body.githubLink || '', 'GitHub profile', 255)),
            country: getProfileFormValue(req.body.country || '', 'Country', 100),
            language: getProfileFormValue(req.body.language || '', 'Language', 100)
        };
        if (!updateData.name) {
            return res.status(400).send('Name is required.');
        }

        if (req.file) {
            updateData.profileImage = await uploadProfileImage(req.file.buffer);
        }

        await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });

        return res.redirect('/users/profile');

    } catch (err) {
        if (err instanceof TypeError || err instanceof RangeError) {
            return res.status(400).send(err.message);
        }
        console.error("Update Profile Error:", err);
        res.status(500).send("Error updating profile: " + err.message);
    }
};