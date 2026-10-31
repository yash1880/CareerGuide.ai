import Job from '../models/Job.js';
import mongoose from 'mongoose';

const JOB_SKILLS = [
    'JavaScript', 'ES6+', 'TypeScript', 'React Native', 'React.js', 'React',
    'Redux Toolkit', 'Context API', 'Node.js', 'Express.js', 'MongoDB',
    'REST APIs', 'JWT', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS',
    'Figma', 'Python', 'Java', 'Django', 'Flask', 'Spring Boot',
    'Postman', 'Firebase', 'Cloudinary', 'Git', 'GitHub', 'AWS',
    'Cloud deployment', 'Microservices', 'SQL', 'Data processing',
    'Automation', 'Web scraping', 'React Testing Library'
];

function getJobDetails(job) {
    const title = job.title || '';
    const sourceText = `${title} ${job.description || ''}`.toLocaleLowerCase();
    const mentionedSkills = JOB_SKILLS.filter((skill) =>
        new RegExp(`(^|[^a-z0-9])${skill.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(sourceText)
    );
    const normalizedSkills = [...new Set(mentionedSkills)].filter((skill, index, skills) =>
        !(skill === 'React' && skills.includes('React.js'))
    );
    const titleLower = title.toLocaleLowerCase();
    let experienceLevel = 'Not specified in the listing';
    if (/\bintern(ship)?\b|\btrainee\b/.test(titleLower)) {
        experienceLevel = 'Internship / trainee role';
    } else if (/\bjunior\b|\bentry[- ]level\b/.test(titleLower)) {
        experienceLevel = 'Junior-level role';
    } else if (/\bsenior\b|\barchitect\b/.test(titleLower)) {
        experienceLevel = 'Senior-level role';
    }

    const roleFocus = [];
    const frontendSkills = normalizedSkills.filter((skill) =>
        ['React Native', 'React.js', 'React', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS', 'Figma'].includes(skill)
    );
    const backendSkills = normalizedSkills.filter((skill) =>
        ['Node.js', 'Express.js', 'REST APIs', 'Java', 'Spring Boot', 'Python', 'Django', 'Flask'].includes(skill)
    );

    if (frontendSkills.length > 0) {
        roleFocus.push(`Build or update user-facing interfaces with ${frontendSkills.join(', ')}.`);
    }
    if (backendSkills.length > 0) {
        roleFocus.push(`Work on server-side features or APIs using ${backendSkills.join(', ')}.`);
    }
    if (normalizedSkills.includes('MongoDB') || normalizedSkills.includes('SQL')) {
        roleFocus.push(`Work with application data using ${normalizedSkills.filter((skill) => ['MongoDB', 'SQL'].includes(skill)).join(', ')}.`);
    }
    if (/\bintern(ship)?\b|\btrainee\b/.test(titleLower)) {
        roleFocus.push('Contribute to assigned development tasks in a learning-focused role.');
    }

    return {
        ...job,
        detailSkills: normalizedSkills,
        roleFocus,
        experienceLevel,
        workMode: /\bremote\b/i.test(job.location || '')
            ? 'Remote'
            : 'Work mode not specified'
    };
}

export const getJobsPage = async (req, res) => {
    try {
        // Controller ab sirf database se data fetch karega
        const jobs = await Job.find({});

        res.render('jobs', { 
            user: req.user, 
            jobs: jobs,
            path: '/jobs'
        });

    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).send("Server Error");
    }
};

export const getJobDetail = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Job not found.');
        }

        const job = await Job.findById(req.params.id).lean();
        if (!job) {
            return res.status(404).send('Job not found.');
        }

        return res.render('job-details', {
            user: req.user,
            job: getJobDetails(job),
            path: '/jobs'
        });
    } catch (error) {
        return next(error);
    }
};

export { getJobDetails };