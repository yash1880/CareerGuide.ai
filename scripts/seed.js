import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const initialOpportunities = [
    // ==================== SURAT (5 Jobs + 5 Internships) ====================
    {
        title: 'Full Stack MERN Developer',
        company: 'TechCorp Solutions',
        location: 'Surat, Gujarat',
        salary: '₹6L - ₹10L PA',
        type: 'Full-time',
        description: 'Looking for a skilled MERN stack developer with hands-on experience in React, Node.js, Express, and MongoDB.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Junior React.js Developer',
        company: 'CodeLogic Systems',
        location: 'Surat, Gujarat',
        salary: '₹3.5L - ₹5L PA',
        type: 'Full-time',
        description: 'Great opportunity for junior developers with good command over JavaScript ES6+, HTML5, CSS3, and React components.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'Junior Web Developer (MERN)',
        company: 'Shree InfoTech',
        location: 'Surat, Gujarat',
        salary: '₹3L - ₹4.5L PA',
        type: 'Full-time',
        description: 'Looking for enthusiastic local developers to assist in building client web portals and E-commerce templates.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'Junior Full Stack Engineer',
        company: 'AlphaByte Technologies',
        location: 'Surat, Gujarat',
        salary: '₹3.8L - ₹6L PA',
        type: 'Full-time',
        description: 'Assist senior developers in writing clean MERN stack code, debugging issues, and maintaining Git repositories.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Frontend React Engineer',
        company: 'SuratWeb Studio',
        location: 'Surat, Gujarat',
        salary: '₹4.5L - ₹7.5L PA',
        type: 'Full-time',
        description: 'Build responsive single-page applications and interactive user dashboards using React and Bootstrap 5.',
        postedDate: '5 days ago',
        applyLink: '#'
    },
    {
        title: 'MERN Stack Trainee / Intern',
        company: 'DevStudio India',
        location: 'Surat, Gujarat',
        salary: '₹15,000 - ₹25,000 /month',
        type: 'Internship',
        description: 'Intensive internship program for aspiring full stack developers with conversion to full-time role based on performance.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Junior Web Developer Intern',
        company: 'Shree InfoTech',
        location: 'Surat, Gujarat',
        salary: '₹8,000 - ₹15,000 /month',
        type: 'Internship',
        description: 'Assist in developing static and dynamic website templates using HTML5, CSS3, JavaScript, and Bootstrap.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'JavaScript Programming Intern',
        company: 'CodeLogic Systems',
        location: 'Surat, Gujarat',
        salary: '₹10,000 - ₹15,000 /month',
        type: 'Internship',
        description: 'Practice core JavaScript algorithms, DOM manipulation, asynchronous programming, and event listeners.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'E-Commerce Website Intern',
        company: 'ShopCart India',
        location: 'Surat, Gujarat',
        salary: '₹10,000 - ₹16,000 /month',
        type: 'Internship',
        description: 'Build product listing grids, shopping cart state management, and filter systems for online stores.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Cloudinary & Firebase Integration Intern',
        company: 'DevStudio India',
        location: 'Surat, Gujarat',
        salary: '₹12,000 - ₹18,000 /month',
        type: 'Internship',
        description: 'Implement user authentication flows via Firebase Auth and media uploads using Cloudinary SDK.',
        postedDate: '5 days ago',
        applyLink: '#'
    },

    // ==================== AHMEDABAD (5 Jobs + 5 Internships) ====================
    {
        title: 'Frontend React Developer',
        company: 'WebCraft Digital',
        location: 'Ahmedabad, Gujarat',
        salary: '₹4L - ₹7L PA',
        type: 'Full-time',
        description: 'Seeking a frontend developer proficient in React.js, Tailwind CSS, Bootstrap 5, and Redux Toolkit.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'MERN Stack Developer',
        company: 'Apex Web Solutions',
        location: 'Ahmedabad, Gujarat',
        salary: '₹6L - ₹9L PA',
        type: 'Full-time',
        description: 'Develop scalable backend services in Node.js and dynamic user interfaces using React.js and Context API.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'Full Stack JavaScript Engineer',
        company: 'Gujarat Tech Hub',
        location: 'Ahmedabad, Gujarat',
        salary: '₹7L - ₹11L PA',
        type: 'Full-time',
        description: 'Design and deploy end-to-end web applications with optimal database queries and clean UI components.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'Node.js Backend Developer',
        company: 'Sabarmati Softwares',
        location: 'Ahmedabad, Gujarat',
        salary: '₹6.5L - ₹10L PA',
        type: 'Full-time',
        description: 'Manage REST API routing, user authorization, and secure database schemas using Express and MongoDB.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'UI/UX Frontend Engineer',
        company: 'Karnavati Designs',
        location: 'Ahmedabad, Gujarat',
        salary: '₹5L - ₹8L PA',
        type: 'Full-time',
        description: 'Transform Figma layouts into lightning-fast, accessible, and responsive React frontend applications.',
        postedDate: '5 days ago',
        applyLink: '#'
    },
    {
        title: 'Frontend React Internship',
        company: 'WebCraft Digital',
        location: 'Ahmedabad, Gujarat',
        salary: '₹10,000 - ₹18,000 /month',
        type: 'Internship',
        description: 'Learn and build responsive user interfaces using React, Bootstrap 5, and Tailwind CSS under senior mentors.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Full Stack Trainee',
        company: 'Apex Web Solutions',
        location: 'Ahmedabad, Gujarat',
        salary: '₹12,000 - ₹18,000 /month',
        type: 'Internship',
        description: 'Complete project-based training covering MongoDB schemas, Express routing, React components, and Node servers.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'JavaScript Coding Intern',
        company: 'Sabarmati Softwares',
        location: 'Ahmedabad, Gujarat',
        salary: '₹9,000 - ₹14,000 /month',
        type: 'Internship',
        description: 'Assist developers in fixing frontend bugs and writing modular JavaScript functions.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'React UI Design Intern',
        company: 'Karnavati Designs',
        location: 'Ahmedabad, Gujarat',
        salary: '₹10,000 - ₹16,000 /month',
        type: 'Internship',
        description: 'Create reusable UI components and buttons library using Tailwind CSS and React.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Backend Trainee',
        company: 'Gujarat Tech Hub',
        location: 'Ahmedabad, Gujarat',
        salary: '₹11,000 - ₹17,000 /month',
        type: 'Internship',
        description: 'Learn basic REST endpoint testing via Postman and MongoDB document structure setup.',
        postedDate: '5 days ago',
        applyLink: '#'
    },

    // ==================== REMOTE (5 Jobs + 5 Internships) ====================
    {
        title: 'Node.js Backend Engineer',
        company: 'CloudScale Tech',
        location: 'Remote, India',
        salary: '₹8L - ₹14L PA',
        type: 'Full-time',
        description: 'Build and maintain scalable REST APIs, JWT authentication modules, and database schemas using Node.js and MongoDB.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Frontend Engineer (Tailwind & React)',
        company: 'DesignFirst Corp',
        location: 'Remote, India',
        salary: '₹7.5L - ₹12L PA',
        type: 'Full-time',
        description: 'Craft responsive landing pages, dashboard widgets, and component libraries using Tailwind CSS and React.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'Senior MERN Developer',
        company: 'Global Remote Inc',
        location: 'Remote, India',
        salary: '₹12L - ₹18L PA',
        type: 'Full-time',
        description: 'Work independently on high-performance web applications with complete ownership of frontend and backend modules.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'Full Stack JavaScript Architect',
        company: 'RemoteWorks Global',
        location: 'Remote, India',
        salary: '₹14L - ₹22L PA',
        type: 'Full-time',
        description: 'Design microservices architecture and review code quality for distributed development teams.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'React Native Mobile Developer',
        company: 'AppSync Remote',
        location: 'Remote, India',
        salary: '₹9L - ₹15L PA',
        type: 'Full-time',
        description: 'Develop cross-platform mobile apps with seamless API synchronization and offline storage.',
        postedDate: '5 days ago',
        applyLink: '#'
    },
    {
        title: 'Backend Node.js Intern',
        company: 'CloudScale Tech',
        location: 'Remote, India',
        salary: '₹12,000 - ₹20,000 /month',
        type: 'Internship',
        description: 'Gain hands-on experience in building Express routing, connecting MongoDB databases, and testing via Postman.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Bootstrap & Tailwind CSS Intern',
        company: 'DesignFirst Corp',
        location: 'Remote, India',
        salary: '₹8,000 - ₹12,000 /month',
        type: 'Internship',
        description: 'Design responsive layouts and modern UI components using Tailwind utility classes and Bootstrap grid systems.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'React.js UI Intern',
        company: 'NextGen Apps',
        location: 'Remote, India',
        salary: '₹15,000 - ₹20,000 /month',
        type: 'Internship',
        description: 'Build component-driven user interfaces, handle props and state, and consume RESTful APIs in React.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'Redux Toolkit Learning Intern',
        company: 'InnoVation Labs',
        location: 'Remote, India',
        salary: '₹14,000 - ₹20,000 /month',
        type: 'Internship',
        description: 'Implement global application state management slices and asynchronous thunks using Redux Toolkit.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Mobile App Development Intern',
        company: 'AppSync Remote',
        location: 'Remote, India',
        salary: '₹13,000 - ₹19,000 /month',
        type: 'Internship',
        description: 'Assist in building hybrid mobile application views using React Native and JavaScript foundations remotely.',
        postedDate: '5 days ago',
        applyLink: '#'
    },

    // ==================== MUMBAI (5 Jobs + 5 Internships) ====================
    {
        title: 'UI/UX Integrated Frontend Developer',
        company: 'PixelPerfect Studio',
        location: 'Mumbai, Maharashtra',
        salary: '₹5L - ₹8.5L PA',
        type: 'Full-time',
        description: 'Convert complex wireframes into responsive, highly optimized, and interactive user interfaces using modern CSS frameworks and React.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Database Administrator (MongoDB)',
        company: 'DataCore Systems',
        location: 'Mumbai, Maharashtra',
        salary: '₹10L - ₹16L PA',
        type: 'Full-time',
        description: 'Optimize MongoDB aggregation pipelines, index structures, replica sets, and secure database clusters.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'Fintech Full Stack Developer',
        company: 'Bombay FinTech',
        location: 'Mumbai, Maharashtra',
        salary: '₹9L - ₹15L PA',
        type: 'Full-time',
        description: 'Build secure payment transaction processing workflows and real-time dashboard analytics using React and Node.js.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'React Frontend Engineer',
        company: 'Marine Drive Tech',
        location: 'Mumbai, Maharashtra',
        salary: '₹6L - ₹10L PA',
        type: 'Full-time',
        description: 'Develop high-frequency trading user interfaces and media streaming portals with React.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Backend API Developer',
        company: 'Colaba Softwares',
        location: 'Mumbai, Maharashtra',
        salary: '₹7L - ₹12L PA',
        type: 'Full-time',
        description: 'Implement secure RESTful endpoints and middleware error handlers in Express.js.',
        postedDate: '5 days ago',
        applyLink: '#'
    },
    {
        title: 'UI/UX Design & Frontend Intern',
        company: 'PixelPerfect Studio',
        location: 'Mumbai, Maharashtra',
        salary: '₹10,000 - ₹22,000 /month',
        type: 'Internship',
        description: 'Transform Figma design systems into clean, semantic frontend code using React and modern CSS.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Python & JavaScript Intern',
        company: 'DataCore Systems',
        location: 'Mumbai, Maharashtra',
        salary: '₹12,000 - ₹20,000 /month',
        type: 'Internship',
        description: 'Work on data processing scripts, automation utility tools, and web scraping modules.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'Fintech Frontend Intern',
        company: 'Bombay FinTech',
        location: 'Mumbai, Maharashtra',
        salary: '₹12,000 - ₹18,000 /month',
        type: 'Internship',
        description: 'Learn financial dashboard layout designing and charting libraries integration in React.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'React UI Intern',
        company: 'Marine Drive Tech',
        location: 'Mumbai, Maharashtra',
        salary: '₹10,000 - ₹16,000 /month',
        type: 'Internship',
        description: 'Build interactive form components and validation logic in React under senior developers.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Node.js Trainee',
        company: 'Colaba Softwares',
        location: 'Mumbai, Maharashtra',
        salary: '₹11,000 - ₹17,000 /month',
        type: 'Internship',
        description: 'Assist in setting up Express server routes and testing database connectivity.',
        postedDate: '5 days ago',
        applyLink: '#'
    },

    // ==================== PUNE (5 Jobs + 5 Internships) ====================
    {
        title: 'Full Stack JavaScript Engineer',
        company: 'NextGen Apps',
        location: 'Pune, Maharashtra',
        salary: '₹7L - ₹12L PA',
        type: 'Full-time',
        description: 'Develop end-to-end web applications using React, Express, MongoDB, and integrate cloud services like Cloudinary.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'Software Engineer - JavaScript',
        company: 'Binary Roots',
        location: 'Pune, Maharashtra',
        salary: '₹7L - ₹11L PA',
        type: 'Full-time',
        description: 'Work with vanilla JavaScript, ES6+, async programming, DOM manipulation, and cross-browser performance tuning.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'JavaScript Automation Tester',
        company: 'QualityFirst QA',
        location: 'Pune, Maharashtra',
        salary: '₹6L - ₹9.5L PA',
        type: 'Full-time',
        description: 'Write automated test scripts using Jest, Mocha, and Cypress for modern MERN stack web applications.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'Senior React Developer',
        company: 'Pune Cyber Labs',
        location: 'Pune, Maharashtra',
        salary: '₹11L - ₹17L PA',
        type: 'Full-time',
        description: 'Lead frontend module development and state architecture optimization using Redux.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'MERN Stack Engineer',
        company: 'Deccan Web Solutions',
        location: 'Pune, Maharashtra',
        salary: '₹8L - ₹13L PA',
        type: 'Full-time',
        description: 'Build robust web applications with full MERN stack integration and secure authentication.',
        postedDate: '5 days ago',
        applyLink: '#'
    },
    {
        title: 'Git & GitHub Version Control Intern',
        company: 'Binary Roots',
        location: 'Pune, Maharashtra',
        salary: '₹10,000 - ₹15,000 /month',
        type: 'Internship',
        description: 'Manage codebase branches, pull requests, merge conflict resolutions, and repository documentation.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'QA & Testing Intern',
        company: 'QualityFirst QA',
        location: 'Pune, Maharashtra',
        salary: '₹9,000 - ₹14,000 /month',
        type: 'Internship',
        description: 'Perform manual exploratory testing, report bugs, and write basic integration test cases.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'JavaScript Intern',
        company: 'Pune Cyber Labs',
        location: 'Pune, Maharashtra',
        salary: '₹10,000 - ₹16,000 /month',
        type: 'Internship',
        description: 'Learn modern ES6 features, array methods, and asynchronous callback handling.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'React Trainee',
        company: 'Deccan Web Solutions',
        location: 'Pune, Maharashtra',
        salary: '₹11,000 - ₹17,000 /month',
        type: 'Internship',
        description: 'Assist in building React functional components and managing state hooks.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Full Stack Intern',
        company: 'NextGen Apps',
        location: 'Pune, Maharashtra',
        salary: '₹12,000 - ₹18,000 /month',
        type: 'Internship',
        description: 'Gain exposure to Express controllers and React frontend integration.',
        postedDate: '5 days ago',
        applyLink: '#'
    },

    // ==================== BANGALORE (5 Jobs + 5 Internships) ====================
    {
        title: 'API Developer & Integration Specialist',
        company: 'SoftEdge Tech',
        location: 'Bangalore, Karnataka',
        salary: '₹9L - ₹15L PA',
        type: 'Full-time',
        description: 'Design robust RESTful APIs, manage middleware validation, handle error handling, and test endpoints via Postman.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'React Native Developer',
        company: 'AppMorph Labs',
        location: 'Bangalore, Karnataka',
        salary: '₹8L - ₹13L PA',
        type: 'Full-time',
        description: 'Build cross-platform mobile apps using React Native, connecting with REST backends and local storage systems.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'Lead Software Developer',
        company: 'Zenith Innovations',
        location: 'Bangalore, Karnataka',
        salary: '₹18L - ₹28L PA',
        type: 'Full-time',
        description: 'Lead a team of 8+ developers, review pull requests, plan sprints, and deliver high-impact enterprise products.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'Senior Full Stack Engineer',
        company: 'Silicon Valley India',
        location: 'Bangalore, Karnataka',
        salary: '₹15L - ₹24L PA',
        type: 'Full-time',
        description: 'Architect scalable web services and high-concurrency Node.js microservices.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'Frontend Tech Lead',
        company: 'Bangalore UI Hub',
        location: 'Bangalore, Karnataka',
        salary: '₹14L - ₹20L PA',
        type: 'Full-time',
        description: 'Manage React design systems, performance profiling, and component library standardization.',
        postedDate: '5 days ago',
        applyLink: '#'
    },
    {
        title: 'Database & API Intern',
        company: 'SoftEdge Tech',
        location: 'Bangalore, Karnataka',
        salary: '₹18,000 - ₹25,000 /month',
        type: 'Internship',
        description: 'Learn REST API design principles, JSON data formatting, and MongoDB document modeling.',
        postedDate: '1 day ago',
        applyLink: '#'
    },
    {
        title: 'AI Workflow Integration Intern',
        company: 'Zenith Innovations',
        location: 'Bangalore, Karnataka',
        salary: '₹20,000 - ₹30,000 /month',
        type: 'Internship',
        description: 'Explore prompt engineering, API integrations, and AI-driven automation workflows in web applications.',
        postedDate: '2 days ago',
        applyLink: '#'
    },
    {
        title: 'Mobile App Development Intern',
        company: 'AppMorph Labs',
        location: 'Bangalore, Karnataka',
        salary: '₹15,000 - ₹22,000 /month',
        type: 'Internship',
        description: 'Assist in building hybrid mobile application views using React Native and JavaScript foundations.',
        postedDate: '3 days ago',
        applyLink: '#'
    },
    {
        title: 'Full Stack Trainee Intern',
        company: 'Silicon Valley India',
        location: 'Bangalore, Karnataka',
        salary: '₹16,000 - ₹24,000 /month',
        type: 'Internship',
        description: 'Work alongside senior architects on cloud deployment pipelines and backend route optimization.',
        postedDate: '4 days ago',
        applyLink: '#'
    },
    {
        title: 'React UI Intern',
        company: 'Bangalore UI Hub',
        location: 'Bangalore, Karnataka',
        salary: '₹14,000 - ₹20,000 /month',
        type: 'Internship',
        description: 'Design responsive layouts and test user interaction flow using React testing library.',
        postedDate: '5 days ago',
        applyLink: '#'
    }
];

const seedDB = async () => {
    try {
        await Job.deleteMany({});
        await Job.insertMany(initialOpportunities);
        console.log("Database Seeded Successfully with Jobs!");
        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

seedDB();