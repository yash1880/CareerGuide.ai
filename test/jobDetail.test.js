import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import ejs from 'ejs';
import Job from '../models/Job.js';
import jobRoutes from '../routes/jobRoutes.js';
import { getJobDetail, getJobDetails } from '../controller/jobController.js';

const originalFindById = Job.findById;
const viewsDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views'
);

afterEach(() => {
    Job.findById = originalFindById;
});

function responseRecorder() {
    return {
        statusCode: 200,
        status(code) {
            this.statusCode = code;
            return this;
        },
        send(body) {
            this.body = body;
            return this;
        },
        render(view, locals) {
            this.view = view;
            this.locals = locals;
            return this;
        }
    };
}

test('job detail returns 404 for an invalid job ID without querying the database', async () => {
    Job.findById = assert.fail;
    const res = responseRecorder();

    await getJobDetail({ params: { id: 'invalid-id' } }, res, assert.fail);

    assert.equal(res.statusCode, 404);
    assert.equal(res.body, 'Job not found.');
});

test('job detail renders the complete matching job', async () => {
    const id = new mongoose.Types.ObjectId();
    const job = {
        _id: id,
        title: 'Frontend Developer',
        company: 'Example Co',
        location: 'Surat',
        salary: '₹6 LPA',
        type: 'Full-time',
        description: 'Build accessible web applications.',
        postedDate: 'Recently',
        applyLink: 'https://example.test/apply'
    };
    Job.findById = (requestedId) => {
        assert.equal(requestedId, id.toString());
        return { lean: async () => job };
    };
    const user = { _id: new mongoose.Types.ObjectId() };
    const res = responseRecorder();

    await getJobDetail({ params: { id: id.toString() }, user }, res, assert.fail);

    assert.equal(res.view, 'job-details');
    assert.equal(res.locals.job.title, job.title);
    assert.deepEqual(res.locals.job.detailSkills, []);
    assert.equal(res.locals.user, user);
    assert.equal(res.locals.path, '/jobs');
});

test('job detail returns 404 when the job does not exist', async () => {
    const id = new mongoose.Types.ObjectId();
    Job.findById = () => ({ lean: async () => null });
    const res = responseRecorder();

    await getJobDetail({ params: { id: id.toString() } }, res, assert.fail);

    assert.equal(res.statusCode, 404);
});

test('job detail page presents available listing information without inventing missing details', async () => {
    const html = await ejs.renderFile(path.join(viewsDirectory, 'job-details.ejs'), {
        job: {
            _id: new mongoose.Types.ObjectId(),
            title: 'Frontend Developer',
            company: 'Example Co',
            location: 'Surat',
            salary: '',
            type: 'Full-time',
            description: 'Build accessible web applications.\nWork with the existing product team.',
            postedDate: 'Recently',
            applyLink: '#'
        },
        user: null
    });

    assert.match(html, /Job overview/);
    assert.match(html, /Role description/);
    assert.match(html, /About the employer/);
    assert.match(html, /Build accessible web applications\.\nWork with the existing product team\./);
    assert.match(html, /Not specified by employer/);
    assert.match(html, /Company profile details, benefits, and hiring information were not included/);
    assert.match(html, /external application link has not been provided/i);
    assert.doesNotMatch(html, /undefined|null/);
    assert.equal((html.match(/<body\b/g) || []).length, 1);
});

test('job details extracts only skills mentioned and does not claim unspecified qualifications', () => {
    const details = getJobDetails({
        title: 'Junior React.js Developer',
        location: 'Surat, Gujarat',
        description: 'Build interfaces using React and JavaScript ES6+.'
    });

    assert.deepEqual(details.detailSkills, ['JavaScript', 'ES6+', 'React.js']);
    assert.deepEqual(details.roleFocus, ['Build or update user-facing interfaces with React.js.']);
    assert.equal(details.experienceLevel, 'Junior-level role');
    assert.equal(details.workMode, 'Work mode not specified');
});

test('job detail page renders employer-provided requirements as a list', async () => {
    const html = await ejs.renderFile(path.join(viewsDirectory, 'job-details.ejs'), {
        job: {
            _id: new mongoose.Types.ObjectId(),
            title: 'Frontend Developer',
            company: 'Example Co',
            location: 'Surat',
            type: 'Full-time',
            requirements: ['React.js experience', 'JavaScript ES6+'],
            applyLink: '#'
        },
        user: null
    });

    assert.match(html, /Requirements mentioned in the listing/);
    assert.match(html, /<li>React\.js experience<\/li>/);
    assert.match(html, /<li>JavaScript ES6\+<\/li>/);
    assert.doesNotMatch(html, /employer has not provided separate job requirements/i);
});

test('job router registers the listing before the job detail route', () => {
    const paths = jobRoutes.stack
        .filter((layer) => layer.route)
        .map((layer) => layer.route.path);

    assert.deepEqual(paths, ['/', '/:id']);
});
