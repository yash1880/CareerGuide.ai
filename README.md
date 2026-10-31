# Career Guidance Platform

A full-stack career guidance and student success platform built with Node.js, Express, MongoDB, and EJS. The project helps students and job seekers discover suitable career paths, measure skill gaps, upload resumes, track applications, prepare for mock interviews, and access AI-powered guidance.

## Overview

This application acts as a digital career advisor for students and early-career professionals. It combines core career development workflows into a single web application:

- AI-powered career counseling and actionable suggestions
- Resume scoring with ATS analysis and optimization feedback
- Skill gap evaluation and personalized roadmap generation
- Career exploration based on interests, strengths, and goals
- Job and internship discovery and tracking
- Application monitoring and status management
- Mock interview preparation and improvement tracking
- Authentication with JWT and GitHub OAuth

## Why this project exists

Many students struggle with:

- not knowing which career path matches their profile
- having weak visibility into their skill gaps
- lacking structured guidance for interviews, resumes, and job search
- managing multiple job/application tasks across different platforms

This project addresses these issues with a guided, data-driven platform that combines career planning, skills assessment, and application tracking in one experience.

## Core Features

### 1. Career Planning and Guidance
- Recommend career paths based on user interests and profile strength
- Explore alternative or emerging career opportunities
- Receive AI-based recommendations to improve direction and strategy

### 2. Resume Analysis and ATS Review
- Upload resume documents in supported formats
- Parse resume content for skills, experience, and qualifications
- Evaluate ATS compatibility and identify weak areas
- Get suggestions for stronger resume wording and content structure

### 3. Skill Gap Analysis
- Compare current skills against target roles or career goals
- Highlight missing capabilities and recommended learning priorities
- Generate step-by-step roadmaps for career progress

### 4. Interview Preparation
- Start mock interview sessions with structured prompts
- Submit answers and get evaluation feedback
- Review performance trends over multiple attempts
- Track learning improvements over time

### 5. Job and Internship Discovery
- Browse available jobs and internships
- Open detailed views for company and role information
- Support career-oriented discovery and opportunity filtering

### 6. Application Tracking
- Save and monitor application records
- Track progress from submitted to shortlisted or rejected
- Keep a focused workflow for job-search management

### 7. User Accounts and Security
- Secure registration and login flow
- Password hashing with bcrypt
- JWT-based session handling
- GitHub OAuth login support for quick access

## Tech Stack

- Backend: Node.js, Express.js
- Frontend: EJS templates with static assets and custom CSS/JS
- Database: MongoDB with Mongoose
- Authentication: JWT, bcryptjs, GitHub OAuth
- AI: Google Gemini via Google GenAI SDK
- Resume parsing: PDF and Mammoth Word document support
- Testing: Node.js built-in test runner

## Architecture Overview

The app follows a simple MVC-style structure:

- `app.js` initializes Express and mounts the web app
- `routes/` handles HTTP endpoints and page navigation
- `controller/` contains business logic and rendering code
- `models/` defines MongoDB schemas
- `middleware/` handles validation, auth, and error handling
- `services/` hosts reusable integrations such as JWT and GitHub OAuth
- `views/` contains EJS templates for the web UI
- `public/` stores frontend assets and static files

## Project Structure

```text
career-guidance/
├── app.js
├── README.md
├── package.json
├── .env.example
├── config/
│   └── db.js
├── controller/
│   ├── aiController.js
│   ├── applicationController.js
│   ├── assessmentController.js
│   ├── atsController.js
│   ├── authController.js
│   ├── careerController.js
│   ├── internshipController.js
│   ├── jobController.js
│   ├── mockInterviewController.js
│   ├── resumeController.js
│   ├── roadmapController.js
│   ├── skillController.js
│   ├── skillGapController.js
│   └── userController.js
├── data/
│   ├── careerPaths.js
│   └── mockInterviewQuestionBank.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── roleMiddleware.js
│   ├── uploadMiddleware.js
│   └── ...
├── models/
│   ├── Application.js
│   ├── Assessment.js
│   ├── AtsResult.js
│   ├── Career.js
│   ├── Internship.js
│   ├── Job.js
│   ├── MockInterview.js
│   ├── Resume.js
│   ├── Roadmap.js
│   ├── Skill.js
│   ├── SkillGap.js
│   └── User.js
├── public/
│   ├── assets/
│   ├── uploads/
│   └── favicon.svg
├── routes/
│   ├── aiRoutes.js
│   ├── applicationRoutes.js
│   ├── assessmentRoutes.js
│   ├── authRoutes.js
│   ├── careerRoutes.js
│   ├── internshipRoutes.js
│   ├── jobRoutes.js
│   ├── resumeRoutes.js
│   ├── roadmapRoutes.js
│   ├── skillRoutes.js
│   └── userRoutes.js
├── scripts/
│   ├── seed.js
│   └── seedCareers.js
├── services/
│   ├── githubOAuth.js
│   └── jwtAuth.js
├── test/
│   ├── aiCounselor.test.js
│   ├── applicationController.test.js
│   ├── careerPaths.test.js
│   ├── githubOAuth.test.js
│   ├── internshipPage.test.js
│   ├── interviewImprovementTracker.test.js
│   ├── jobDetail.test.js
│   ├── mockInterviewOpenEnded.test.js
│   ├── mockInterviewQuestionBank.test.js
│   └── userProfile.test.js
├── views/
│   ├── auth/
│   ├── about.ejs
│   ├── admin-dashboard.ejs
│   ├── ai-counselor.ejs
│   ├── dashboard.ejs
│   ├── home.ejs
│   ├── jobs.ejs
│   ├── internships.ejs
│   ├── profile.ejs
│   ├── resume-ats.ejs
│   ├── roadmap.ejs
│   ├── skills.ejs
│   └── ...
└── public/uploads/
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or later
- MongoDB running locally or a reachable MongoDB Atlas connection
- A Google Gemini API key for AI-powered features
- Optional GitHub OAuth credentials if you want GitHub sign-in enabled
- A valid environment configuration for the app

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd career-guidance
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/career-guide
JWT_SECRET=your-super-secure-jwt-secret
GEMINI_API_KEY=your_gemini_api_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Notes for environment variables

- `JWT_SECRET` must be at least 32 characters long and should be randomly generated.
- `GEMINI_API_KEY` is required for AI-powered career guidance, ATS reviews, and roadmap generation.
- GitHub OAuth settings are optional unless you want GitHub sign-in enabled.
- Cloudinary settings are needed for profile image uploads, including on Vercel.
- If you are using MongoDB Atlas or another remote database, replace `MONGO_URI` with your connection string.

## Running the App

Start the development server:

```bash
npm run dev
```

Or run in standard mode:

```bash
npm start
```

Once the server starts, open the app in your browser:

```text
http://localhost:5000
```

## Seed Data

The project includes seed scripts to initialize database data:

```bash
npm run seed
npm run seed:careers
```

These commands populate default data for the application and career-related content.

## Project Scripts

```bash
npm run dev        # Start the app in watch mode
npm start          # Start the app normally
npm run seed       # Seed default project data
npm run seed:careers # Seed career data
npm test           # Run the automated test suite
```

## Test Suite

The project includes Node-based tests for key functionality such as:

- AI counselor behavior
- application workflow
- career path generation
- GitHub OAuth helpers
- internship and interview logic
- profile/user behavior

Run tests with:

```bash
npm test
```

## Main Routes

The app exposes a number of routes for different user journeys, including:

- `/` – landing page
- `/about` – about page
- `/auth/login` – login page
- `/auth/register` – registration page
- `/dashboard` – authenticated dashboard
- `/careers` – career exploration
- `/resume-ats` – resume ATS review
- `/skills` – skill and competency pages
- `/roadmap` – roadmap generation
- `/jobs` – job listings
- `/internships` – internship listings
- `/applications` – application tracker
- `/ai/counselor` – AI guidance interface
- `/ai/mock-interview` – interview practice module

## How the app works

1. User registers or signs in
2. The system loads their profile data and dashboard context
3. User explores career paths, skills, and opportunities
4. Resume and interview features process uploaded content or answers using AI
5. Structured insights and recommendations are displayed in the web dashboard
6. User tracks jobs, applications, and career progress over time

## Notes

- AI features rely on a valid `GEMINI_API_KEY`.
- GitHub sign-in will only work when the corresponding OAuth environment variables are configured.
- MongoDB must be available before the server can boot successfully.
- Profile images are uploaded to Cloudinary; set the three `CLOUDINARY_*` variables in your local `.env` and deployment environment. Never commit API secrets.
- Resume uploads are processed by the server and should use storage appropriate to the deployment platform.

## Future Enhancements

Potential improvements for this project include:

- admin dashboard for system management
- richer analytics and progress reporting
- more advanced AI evaluation prompts
- better role-based access control
- deployment setup for production environments
- CI/CD configuration for automated validation

## License

This project is provided as-is for educational, learning, and internal use. If you plan to distribute or publish it publicly, consider adding an explicit license file such as MIT or Apache-2.0.

## Contributing

Contributions are welcome. To contribute:

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Run the relevant tests
5. Open a pull request with a clear summary

## Contact

For questions or collaboration opportunities, use the project repository or contact the maintainer through the available project channels.
