import Application from '../models/Application.js';
import mongoose from 'mongoose';
import Internship from '../models/Internship.js';
import Job from '../models/Job.js';

const getApplicationsForUser = async (userId) => {
    const applications = await Application.find({ userId }).sort({ createdAt: -1 }).lean();
    const jobIds = applications.filter((application) => application.type === 'Job')
        .map((application) => application.jobOrInternshipId);
    const internshipIds = applications.filter((application) => application.type === 'Internship')
        .map((application) => application.jobOrInternshipId);
    const [jobs, internships] = await Promise.all([
        Job.find({ _id: { $in: jobIds } }).select('title company location').lean(),
        Internship.find({ _id: { $in: internshipIds } }).select('title company location').lean()
    ]);
    const opportunities = new Map([
        ...jobs.map((item) => [`Job:${item._id}`, item]),
        ...internships.map((item) => [`Internship:${item._id}`, item])
    ]);

    return applications.map((application) => ({
        ...application,
        opportunity: opportunities.get(`${application.type}:${application.jobOrInternshipId}`) || null
    }));
};

const renderApplications = async (req, res, selectedApplication = null) => {
    const applications = await getApplicationsForUser(req.user._id);
    res.render('applications', {
        user: req.user,
        path: '/applications',
        applications,
        selectedApplication: selectedApplication
            ? applications.find((application) => String(application._id) === String(selectedApplication._id))
            : null
    });
};

export const getApplicationsPage = async (req, res, next) => {
    try {
        await renderApplications(req, res);
    } catch (error) {
        next(error);
    }
};

export const getApplicationDetail = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Application not found.');
        }
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).lean();
        if (!application) {
            return res.status(404).send('Application not found.');
        }
        await renderApplications(req, res, application);
    } catch (error) {
        next(error);
    }
};

export const applyPosition = async (req, res, next) => {
    try {
        const { jobOrInternshipId, type } = req.body;
        if (!mongoose.isValidObjectId(jobOrInternshipId) || !['Job', 'Internship'].includes(type)) {
            return res.status(400).json({ message: 'A valid opportunity and type are required.' });
        }
        const Opportunity = type === 'Job' ? Job : Internship;
        const opportunity = await Opportunity.findById(jobOrInternshipId).select('_id');
        if (!opportunity) {
            return res.status(404).json({ message: 'The selected opportunity was not found.' });
        }
        const existingApplication = await Application.findOne({
            userId: req.user._id,
            jobOrInternshipId,
            type
        });
        if (existingApplication) {
            return res.status(409).json({ message: 'You have already applied to this opportunity.' });
        }
        const application = await Application.create({
            userId: req.user._id,
            jobOrInternshipId,
            type
        });
        res.status(201).json({ message: 'Application submitted successfully.', application });
    } catch (error) {
        next(error);
    }
};
