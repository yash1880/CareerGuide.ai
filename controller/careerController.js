import Career from '../models/Career.js';
import mongoose from 'mongoose';

// Get all career paths (Renders EJS view)
export const getAllCareers = async (req, res, next) => {
    try {
        const careers = await Career.find().sort({ title: 1 });
        res.render('careers', { careers, user: req.user, path: '/careers' });
    } catch (error) {
        next(error);
    }
};

// Get single career path by ID
export const getCareerById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Career path not found.');
        }
        const career = await Career.findById(req.params.id);
        if (!career) {
            return res.status(404).send('Career path not found.');
        }
        res.render('career-result', { career, user: req.user, path: '/careers' });
    } catch (error) {
        next(error);
    }
};

// Create a new career path (API endpoint)
export const createCareer = async (req, res) => {
    try {
        const newCareer = new Career(req.body);
        await newCareer.save();
        res.status(201).json({ message: 'Career created successfully', career: newCareer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating career', error: error.message });
    }
};