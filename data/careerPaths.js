const careerPaths = [
    {
        title: 'Frontend Developer',
        description: 'Build the interfaces people use in websites and web applications. Frontend developers turn designs into responsive, accessible experiences and connect them to backend services.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive design', 'Accessibility', 'Git'],
        typicalResponsibilities: [
            'Build reusable interface components and page layouts.',
            'Connect screens to APIs and handle loading, error, and empty states.',
            'Test responsive behavior, accessibility, and browser compatibility.'
        ],
        starterProjects: [
            'Create a responsive portfolio with accessible navigation.',
            'Build a searchable dashboard that consumes a public API.'
        ],
        learningPath: ['HTML and semantic structure', 'CSS layouts and responsive design', 'JavaScript and browser APIs', 'React components and state', 'Testing, accessibility, and deployment']
    },
    {
        title: 'MERN Stack Developer',
        description: 'Develop end-to-end web applications with MongoDB, Express, React, and Node.js. This path combines user-interface work with API and database development.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication', 'Git'],
        typicalResponsibilities: [
            'Create React interfaces and connect them to backend APIs.',
            'Design server routes, validation, and data models.',
            'Integrate authentication and test application workflows.'
        ],
        starterProjects: [
            'Build a task manager with user accounts and CRUD operations.',
            'Create a job tracker with filters, saved records, and a REST API.'
        ],
        learningPath: ['HTML, CSS, and JavaScript fundamentals', 'React and client-side state', 'Node.js and Express APIs', 'MongoDB data modeling', 'Authentication, testing, and deployment']
    },
    {
        title: 'Backend Developer',
        description: 'Build the server-side systems behind applications: APIs, business rules, data storage, authentication, and integrations.',
        requiredSkills: ['JavaScript or another backend language', 'Node.js', 'Express', 'REST APIs', 'Databases', 'Authentication', 'Testing', 'Git'],
        typicalResponsibilities: [
            'Design reliable API endpoints and validate incoming data.',
            'Store and retrieve information using suitable database models.',
            'Add authorization, error handling, logging, and automated tests.'
        ],
        starterProjects: [
            'Build a REST API with input validation and API documentation.',
            'Create an authenticated service with role-based access and tests.'
        ],
        learningPath: ['Choose a backend language and learn its fundamentals', 'HTTP and REST API design', 'Database queries and modeling', 'Authentication and security basics', 'Testing, deployment, and monitoring']
    },
    {
        title: 'Data Analyst',
        description: 'Turn raw data into clear findings that support decisions. Analysts clean datasets, investigate questions, and communicate results with reports and visualizations.',
        requiredSkills: ['Spreadsheets', 'SQL', 'Data cleaning', 'Statistics fundamentals', 'Data visualization', 'Communication'],
        typicalResponsibilities: [
            'Clean, validate, and combine data from available sources.',
            'Use queries and analysis to answer specific business questions.',
            'Present findings with clear charts, reports, and caveats.'
        ],
        starterProjects: [
            'Analyze a public dataset and document the questions and assumptions.',
            'Build a small dashboard with filters and a written summary of findings.'
        ],
        learningPath: ['Spreadsheet formulas and data quality', 'SQL querying and joins', 'Descriptive statistics', 'Visualization and dashboard design', 'Communicating evidence and limitations']
    },
    {
        title: 'Data Scientist / Machine Learning Engineer',
        description: 'Use programming, statistics, and machine learning to analyze data or build predictive systems. Strong foundations and careful evaluation matter as much as model choice.',
        requiredSkills: ['Python', 'Statistics', 'SQL', 'Data preparation', 'Machine learning', 'Model evaluation', 'Data visualization'],
        typicalResponsibilities: [
            'Explore datasets and prepare features for analysis or modeling.',
            'Train models and evaluate them against appropriate baselines.',
            'Explain model performance, assumptions, and limitations.'
        ],
        starterProjects: [
            'Compare simple prediction models on a public dataset and report the metrics.',
            'Build a reproducible data-cleaning and model-evaluation notebook.'
        ],
        learningPath: ['Python and data structures', 'Statistics and exploratory analysis', 'Pandas, NumPy, and SQL', 'Machine-learning fundamentals and evaluation', 'Reproducible projects and model deployment basics']
    },
    {
        title: 'Java Backend Developer',
        description: 'Create backend services and enterprise applications using Java. The work often involves APIs, persistence, testing, and frameworks such as Spring Boot.',
        requiredSkills: ['Java', 'Object-oriented programming', 'Spring Boot', 'REST APIs', 'SQL', 'Testing', 'Git'],
        typicalResponsibilities: [
            'Implement service logic and REST endpoints.',
            'Connect application code to relational or document databases.',
            'Write tests and maintain readable, reliable code.'
        ],
        starterProjects: [
            'Create a Spring Boot API for a library or inventory service.',
            'Add database persistence, validation, and automated tests to the API.'
        ],
        learningPath: ['Java syntax and object-oriented programming', 'Collections, exceptions, and build tools', 'SQL and persistence', 'Spring Boot and REST APIs', 'Testing, security, and deployment']
    },
    {
        title: 'UI/UX Designer',
        description: 'Research user needs and design clear, usable digital experiences. Designers move from flows and wireframes to visual systems and prototypes, then validate decisions with users.',
        requiredSkills: ['User research', 'Information architecture', 'Wireframing', 'Prototyping', 'Visual design', 'Accessibility', 'Figma'],
        typicalResponsibilities: [
            'Map user journeys and identify usability problems.',
            'Create wireframes, prototypes, and consistent interface patterns.',
            'Gather feedback and refine designs for clarity and accessibility.'
        ],
        starterProjects: [
            'Redesign one confusing flow and explain the evidence behind changes.',
            'Create a small design system and clickable prototype for a mobile app.'
        ],
        learningPath: ['User-centered design principles', 'Research and journey mapping', 'Wireframes and information architecture', 'Visual design and prototyping', 'Usability testing and portfolio case studies']
    },
    {
        title: 'DevOps / Cloud Engineer',
        description: 'Help teams build, release, and operate software reliably. The role connects automation, cloud infrastructure, deployment pipelines, observability, and security practices.',
        requiredSkills: ['Linux', 'Networking basics', 'Git', 'Scripting', 'CI/CD', 'Containers', 'Cloud fundamentals', 'Monitoring'],
        typicalResponsibilities: [
            'Automate build, test, and deployment workflows.',
            'Configure application environments and containerized services.',
            'Monitor reliability and help diagnose deployment or infrastructure issues.'
        ],
        starterProjects: [
            'Containerize a small web app and document local setup.',
            'Create a CI pipeline that runs tests and builds a deployable artifact.'
        ],
        learningPath: ['Linux, shell, and networking fundamentals', 'Git and scripting', 'Containers and Docker', 'CI/CD pipelines', 'Cloud deployment, monitoring, and infrastructure as code']
    },
    {
        title: 'QA Automation Engineer',
        description: 'Improve software quality by planning tests and automating repeatable checks. QA engineers explore edge cases, report clear defects, and help teams prevent regressions.',
        requiredSkills: ['Testing fundamentals', 'Test case design', 'JavaScript or Python', 'Browser automation', 'API testing', 'Git', 'Bug reporting'],
        typicalResponsibilities: [
            'Translate user stories into test scenarios and edge cases.',
            'Automate important browser or API workflows.',
            'Report reproducible defects and maintain regression checks.'
        ],
        starterProjects: [
            'Write browser tests for sign-up, login, and a common user journey.',
            'Build API tests that check success, validation errors, and authorization.'
        ],
        learningPath: ['Testing concepts and test design', 'A programming language for test automation', 'API testing and assertions', 'Browser automation fundamentals', 'CI integration and maintainable test suites']
    }
];

export default careerPaths;
