import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Internship from '../models/Internship.js';
import { applyPosition } from '../controller/applicationController.js';
import applicationRoutes from '../routes/applicationRoutes.js';
import internshipRoutes from '../routes/internshipRoutes.js';

const originals = {
    applicationCreate: Application.create,
    applicationFindOne: Application.findOne,
    jobFindById: Job.findById
};

afterEach(() => {
    Application.create = originals.applicationCreate;
    Application.findOne = originals.applicationFindOne;
    Job.findById = originals.jobFindById;
});

function responseRecorder() {
    return {
        statusCode: 200,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

test('application endpoint rejects invalid opportunity IDs and types', async () => {
    const res = responseRecorder();
    await applyPosition({
        user: { _id: new mongoose.Types.ObjectId() },
        body: { jobOrInternshipId: 'not-an-id', type: 'Job' }
    }, res, assert.fail);

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /valid opportunity/);
});

test('application endpoint rejects opportunities that do not exist', async () => {
    const id = new mongoose.Types.ObjectId();
    Job.findById = () => ({ select: async () => null });
    const res = responseRecorder();
    await applyPosition({
        user: { _id: new mongoose.Types.ObjectId() },
        body: { jobOrInternshipId: String(id), type: 'Job' }
    }, res, assert.fail);

    assert.equal(res.statusCode, 404);
    assert.match(res.body.message, /not found/);
});

test('application endpoint saves a new user application and rejects duplicates', async () => {
    const userId = new mongoose.Types.ObjectId();
    const opportunityId = new mongoose.Types.ObjectId();
    Job.findById = () => ({ select: async () => ({ _id: opportunityId }) });
    Application.findOne = async () => null;
    let saved;
    Application.create = async (application) => {
        saved = application;
        return { ...application, _id: new mongoose.Types.ObjectId() };
    };
    const res = responseRecorder();
    await applyPosition({
        user: { _id: userId },
        body: { jobOrInternshipId: String(opportunityId), type: 'Job' }
    }, res, assert.fail);

    assert.equal(res.statusCode, 201);
    assert.equal(String(saved.userId), String(userId));
    assert.equal(String(saved.jobOrInternshipId), String(opportunityId));

    Application.findOne = async () => ({ _id: new mongoose.Types.ObjectId() });
    const duplicate = responseRecorder();
    await applyPosition({
        user: { _id: userId },
        body: { jobOrInternshipId: String(opportunityId), type: 'Job' }
    }, duplicate, assert.fail);
    assert.equal(duplicate.statusCode, 409);
});

test('application and internship routers use paths relative to their app mounts', () => {
    const applicationPaths = applicationRoutes.stack
        .filter((layer) => layer.route)
        .map((layer) => layer.route.path);
    const internshipPaths = internshipRoutes.stack
        .filter((layer) => layer.route)
        .map((layer) => layer.route.path);

    assert.deepEqual(applicationPaths, ['/', '/view/:id', '/api/apply']);
    assert.deepEqual(internshipPaths, ['/', '/api/internships']);
});
