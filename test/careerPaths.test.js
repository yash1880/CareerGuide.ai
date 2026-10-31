import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import Career from '../models/Career.js';
import careerPaths from '../data/careerPaths.js';
import careerRoutes from '../routes/careerRoutes.js';
import { getAllCareers } from '../controller/careerController.js';

const viewsDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views'
);
const originalFind = Career.find;

afterEach(() => {
    Career.find = originalFind;
});

function responseRecorder() {
    return {
        statusCode: 200,
        status(code) {
            this.statusCode = code;
            return this;
        },
        render(view, locals) {
            this.view = view;
            this.locals = locals;
            return this;
        }
    };
}

test('career catalog provides detailed paths with practical skills, work, projects, and learning steps', () => {
    assert.ok(careerPaths.length >= 8);
    assert.equal(new Set(careerPaths.map((career) => career.title)).size, careerPaths.length);
    for (const career of careerPaths) {
        assert.ok(career.description.length > 100);
        assert.ok(career.requiredSkills.length >= 5);
        assert.ok(career.typicalResponsibilities.length >= 3);
        assert.ok(career.starterProjects.length >= 2);
        assert.ok(career.learningPath.length >= 4);
    }
});

test('career page loads paths from the database and renders their detail links', async () => {
    const careers = careerPaths.map((career, index) => ({ ...career, _id: `career-${index}` }));
    Career.find = () => ({
        sort: async (sortOrder) => {
            assert.deepEqual(sortOrder, { title: 1 });
            return careers;
        }
    });
    const user = { name: 'Student' };
    const res = responseRecorder();

    await getAllCareers({ user }, res, assert.fail);

    assert.equal(res.view, 'careers');
    assert.equal(res.locals.user, user);
    assert.equal(res.locals.path, '/careers');
    assert.equal(res.locals.careers.length, careerPaths.length);

    const html = await ejs.renderFile(path.join(viewsDirectory, 'careers.ejs'), res.locals);
    assert.match(html, /Frontend Developer/);
    assert.match(html, /MERN Stack Developer/);
    assert.match(html, /View path/);
    assert.match(html, /paths to explore/);
    assert.match(html, /Search career paths by role or skill/);
    assert.match(html, /Build/);
});

test('career detail renders role responsibilities, projects, and a learning path', async () => {
    const career = { ...careerPaths[0], _id: 'career-id' };
    const html = await ejs.renderFile(path.join(viewsDirectory, 'career-result.ejs'), {
        user: { name: 'Student' },
        path: '/careers',
        career
    });

    assert.match(html, /Skills to develop/);
    assert.match(html, /What this role works on/);
    assert.match(html, /Projects to try/);
    assert.match(html, /Suggested learning path/);
    assert.match(html, /responsive portfolio/);
    assert.match(html, /Build my roadmap/);
    assert.match(html, /career-detail-counts/);
});

test('career routes keep the list and detail pages registered', () => {
    const paths = careerRoutes.stack
        .filter((layer) => layer.route)
        .map((layer) => layer.route.path);

    assert.deepEqual(paths, ['/', '/:id', '/']);
});
