import Internship from '../models/Internship.js';
import Job from '../models/Job.js';

export const getInternshipsPage = async (req, res) => {
    try {
        const [storedInternships, legacyInternships] = await Promise.all([
            Internship.find().sort({ createdAt: -1 }).lean(),
            Job.find({ type: 'Internship' })
                .select('title company salary location description postedDate createdAt')
                .sort({ createdAt: -1 })
                .lean()
        ]);
        const storedKeys = new Set(storedInternships.map((internship) =>
            `${internship.title}|${internship.company}|${internship.location}`.toLocaleLowerCase()
        ));
        const internships = [
            ...storedInternships.map((internship) => ({
                ...internship,
                trackerType: 'Internship'
            })),
            ...legacyInternships
                .filter((internship) => !storedKeys.has(
                    `${internship.title}|${internship.company}|${internship.location}`.toLocaleLowerCase()
                ))
                .map((internship) => ({
                    ...internship,
                    stipend: internship.salary || '',
                    duration: '',
                    trackerType: 'Job'
                }))
        ];
        res.render('internships', { internships, user: req.user, path: '/internships' });
    } catch (error) {
        console.error('Error fetching internships:', error);
        res.status(500).send('Unable to load internships.');
    }
};

export const postInternship = async (req, res) => {
    try {
        const fields = ['title', 'company', 'stipend', 'duration', 'location', 'description'];
        const details = Object.fromEntries(fields.map((field) => [
            field,
            typeof req.body[field] === 'string' ? req.body[field].trim() : ''
        ]));
        if (fields.some((field) => !details[field])) {
            return res.status(400).json({ message: 'All internship fields are required.' });
        }
        const internship = new Internship(details);
        await internship.save();
        res.status(201).json({ message: 'Internship posted successfully', internship });
    } catch (error) {
        console.error('Error posting internship:', error);
        res.status(500).json({ message: 'Unable to post internship.' });
    }
};