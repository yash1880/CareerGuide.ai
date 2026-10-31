import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import Internship from '../models/Internship.js';
import Job from '../models/Job.js';
import { getInternshipsPage } from '../controller/internshipController.js';

const viewsDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views'
);
const originalInternshipFind = Internship.find;
const originalJobFind = Job.find;

afterEach(() => {
    Internship.find = originalInternshipFind;
    Job.find = originalJobFind;
});

function responseRecorder() {
    return {
        render(view, locals) {
            this.view = view;
            this.locals = locals;
            return this;
        },
        status(code) {
            this.statusCode = code;
            return this;
        },
        send(body) {
            this.body = body;
            return this;
        }
    };
}

test('internship page includes saved internships and seeded internship listings', async () => {
    const savedInternship = {
        _id: 'saved-id',
        title: 'Design Intern',
        company: 'Studio',
        stipend: '₹12,000/month',
        duration: '3 months',
        location: 'Surat',
        description: 'Help with product design.'
    };
    const legacyInternship = {
        _id: 'seed-id',
        title: 'React UI Intern',
        company: 'Code Studio',
        salary: '₹15,000/month',
        location: 'Remote, India',
        description: 'Build React interfaces.',
        postedDate: '1 day ago'
    };
    Internship.find = () => ({
        sort() {
            return this;
        },
        lean: async () => [savedInternship]
    });
    Job.find = (filter) => {
        assert.deepEqual(filter, { type: 'Internship' });
        return {
            select() {
                return this;
            },
            sort() {
                return this;
            },
            lean: async () => [legacyInternship]
        };
    };
    const user = { name: 'Student' };
    const res = responseRecorder();

    await getInternshipsPage({ user }, res);

    assert.equal(res.view, 'internships');
    assert.equal(res.locals.user, user);
    assert.deepEqual(res.locals.internships.map((item) => item.trackerType), ['Internship', 'Job']);
    assert.equal(res.locals.internships[1].stipend, '₹15,000/month');
});

test('internship page avoids duplicate records already copied to the internship collection', async () => {
    const savedInternship = {
        _id: 'saved-id',
        title: 'React UI Intern',
        company: 'Code Studio',
        stipend: '₹15,000/month',
        duration: '3 months',
        location: 'Remote, India'
    };
    Internship.find = () => ({
        sort() {
            return this;
        },
        lean: async () => [savedInternship]
    });
    Job.find = () => ({
        select() {
            return this;
        },
        sort() {
            return this;
        },
        lean: async () => [{
            _id: 'legacy-id',
            title: 'React UI Intern',
            company: 'Code Studio',
            location: 'Remote, India'
        }]
    });
    const res = responseRecorder();

    await getInternshipsPage({ user: null }, res);

    assert.equal(res.locals.internships.length, 1);
    assert.equal(res.locals.internships[0].trackerType, 'Internship');
});

test('internship listing displays legacy listings and sends the correct tracker type', async () => {
    const html = await ejs.renderFile(path.join(viewsDirectory, 'internships.ejs'), {
        user: null,
        internships: [{
            _id: 'legacy-id',
            title: 'React UI Intern',
            company: 'Code Studio',
            stipend: '₹15,000/month',
            duration: '',
            location: 'Remote, India',
            description: 'Build React interfaces.',
            postedDate: '1 day ago',
            trackerType: 'Job'
        }]
    });

    assert.match(html, /React UI Intern/);
    assert.match(html, /Duration not specified/);
    assert.match(html, /₹15,000\/month/);
    assert.match(html, /data-type="Job"/);
    assert.match(html, /type: button\.dataset\.type/);
});
