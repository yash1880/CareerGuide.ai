import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, test } from 'node:test';
import ejs from 'ejs';
import mongoose from 'mongoose';
import MockInterview from '../models/MockInterview.js';
import {
    buildInterviewComparison,
    compareInterviewAttempts,
    getInterviewImprovementTracker,
    getInterviewTrackerDetail
} from '../controller/mockInterviewController.js';
import aiRoutes from '../routes/aiRoutes.js';

const originalFind = MockInterview.find;
const originalFindOne = MockInterview.findOne;
const originalCountDocuments = MockInterview.countDocuments;
const trackerViewPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views/interview-improvement-tracker.ejs'
);

afterEach(() => {
    MockInterview.find = originalFind;
    MockInterview.findOne = originalFindOne;
    MockInterview.countDocuments = originalCountDocuments;
});

function interview({ id, percentage, questionScores, topics = ['Promises'] }) {
    return {
        _id: id,
        language: 'JavaScript',
        difficulty: 'medium',
        completedAt: new Date('2026-10-01T00:00:00.000Z'),
        createdAt: new Date('2026-10-01T00:00:00.000Z'),
        questions: questionScores.map((score, index) => ({
            kind: index === 0 ? 'conceptual' : 'practical',
            topic: topics[index] || topics[0],
            evaluation: { score }
        })),
        finalReport: {
            percentage,
            totalScore: percentage === null ? null : percentage * 1.5,
            performanceSummary: 'Stored report summary',
            strongestTopics: [],
            weakestTopics: [],
            technicalKnowledgeAssessment: '',
            codingDebuggingAssessment: '',
            topicsToRevise: [],
            improvementPlan: [],
            questionResults: []
        }
    };
}

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

test('comparison calculates stored score changes and leaves missing categories unavailable', () => {
    const firstId = new mongoose.Types.ObjectId();
    const secondId = new mongoose.Types.ObjectId();
    const first = interview({
        id: firstId,
        percentage: 60,
        questionScores: [8, 4],
        topics: ['Promises', 'Promises']
    });
    const second = interview({
        id: secondId,
        percentage: 73.3,
        questionScores: [10, 6],
        topics: ['Promises', 'Closures']
    });

    const comparison = buildInterviewComparison(first, second);
    assert.deepEqual(comparison.overall, {
        name: 'Overall score',
        before: 60,
        after: 73.3,
        change: 13.3,
        direction: 'improved'
    });
    assert.deepEqual(comparison.kinds.find(({ name }) => name === 'conceptual'), {
        name: 'conceptual',
        before: 80,
        after: 100,
        change: 20,
        direction: 'improved'
    });
    assert.deepEqual(comparison.kinds.find(({ name }) => name === 'practical'), {
        name: 'practical',
        before: 40,
        after: 60,
        change: 20,
        direction: 'improved'
    });
    assert.deepEqual(comparison.topics.find(({ name }) => name === 'Promises'), {
        name: 'Promises',
        before: 60,
        after: 100,
        change: 40,
        direction: 'improved'
    });

    const missingCategoryComparison = buildInterviewComparison(
        interview({ id: firstId, percentage: 60, questionScores: [8], topics: ['Promises'] }),
        interview({ id: secondId, percentage: 60, questionScores: [6], topics: ['Closures'] })
    );
    assert.deepEqual(missingCategoryComparison.topics.find(({ name }) => name === 'Promises'), {
        name: 'Promises',
        before: 80,
        after: null,
        change: null,
        direction: 'unavailable'
    });
    assert.equal(missingCategoryComparison.overall.direction, 'unchanged');
});

test('tracker history paginates completed attempts and scopes reads and counts to the signed-in user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const filters = [];
    const countFilters = [];
    let skipped;
    MockInterview.find = (filter) => {
        filters.push(filter);
        let isPaginatedQuery = false;
        return {
            sort() { return this; },
            skip(value) { skipped = value; isPaginatedQuery = true; return this; },
            limit(value) { assert.equal(value, filter.status === 'completed' && !isPaginatedQuery ? 20 : 10); return this; },
            select() { return this; },
            lean: async () => {
                if (filter.status === 'completed') return [];
                return [{
                    _id: new mongoose.Types.ObjectId(),
                    language: 'JavaScript',
                    difficulty: 'medium',
                    status: 'in-progress',
                    currentQuestion: 6,
                    createdAt: new Date('2026-10-01T00:00:00.000Z')
                }];
            }
        };
    };
    MockInterview.countDocuments = async (filter) => {
        countFilters.push(filter);
        return filter.status === 'completed' ? 0 : 1;
    };
    const res = responseRecorder();

    await getInterviewImprovementTracker({
        query: { page: '2' },
        user: { _id: userId }
    }, res);

    assert.equal(res.view, 'interview-improvement-tracker');
    assert.equal(res.locals.totalAttempts, 0);
    assert.equal(res.locals.attempts.length, 0);
    assert.equal(res.locals.activeAttemptCount, 1);
    assert.equal(res.locals.activeAttempts.length, 1);
    assert.equal(res.locals.activeAttempts[0].language, 'JavaScript');
    assert.equal(res.locals.activeAttempts[0].currentQuestion, 6);
    assert.equal(skipped, 10);
    assert.equal(filters.length, 3);
    assert.deepEqual(filters[0], {
        user: userId,
        status: 'completed',
        finalReport: { $exists: true }
    });
    assert.deepEqual(filters[1], {
        user: userId,
        status: 'completed',
        finalReport: { $exists: true },
        $or: [
            { responseMode: 'multiple-choice' },
            {
                responseMode: { $exists: false },
                'questions.0.options.0': { $exists: true }
            }
        ]
    });
    assert.deepEqual(filters[2], {
        user: userId,
        status: { $in: ['in-progress', 'report-pending'] }
    });
    assert.equal(countFilters.length, 2);
    for (const filter of [...filters, ...countFilters]) {
        assert.equal(filter.user, userId);
    }
});

test('tracker analytics calculate the score trend and topic averages from recent completed attempts', async () => {
    const userId = new mongoose.Types.ObjectId();
    const olderAttempt = interview({
        id: new mongoose.Types.ObjectId(),
        percentage: 60,
        questionScores: [8, 4],
        topics: ['Arrays', 'Promises']
    });
    olderAttempt.completedAt = new Date('2026-09-01T00:00:00.000Z');
    const newerAttempt = interview({
        id: new mongoose.Types.ObjectId(),
        percentage: 80,
        questionScores: [10, 6],
        topics: ['Arrays', 'Promises']
    });
    newerAttempt.completedAt = new Date('2026-10-01T00:00:00.000Z');

    MockInterview.find = (filter) => {
        let paginated = false;
        return {
            sort() { return this; },
            skip() { paginated = true; return this; },
            limit(value) {
                assert.equal(value, filter.status === 'completed' && !paginated ? 20 : 10);
                return this;
            },
            select() { return this; },
            lean: async () => {
                if (filter.status !== 'completed' || paginated) return [];
                return [newerAttempt, olderAttempt];
            }
        };
    };
    MockInterview.countDocuments = async (filter) => filter.status === 'completed' ? 2 : 0;
    const res = responseRecorder();

    await getInterviewImprovementTracker({ query: {}, user: { _id: userId } }, res);

    assert.equal(res.locals.averageScore, 70);
    assert.equal(res.locals.bestScore, 80);
    assert.equal(res.locals.scoreTrend, 20);
    assert.equal(res.locals.chartPoints.length, 2);
    assert.equal(res.locals.chartPoints[0].label, '60%');
    assert.equal(res.locals.chartPoints[1].label, '80%');
    assert.deepEqual(res.locals.topicPerformance.map(({ topic, percentage }) => ({ topic, percentage })), [
        { topic: 'Promises', percentage: 50 },
        { topic: 'Arrays', percentage: 90 }
    ]);
});

test('tracker renders the empty state when no completed interviews exist', async () => {
    const html = await ejs.renderFile(trackerViewPath, {
        user: { name: 'Student' },
        path: '/ai/mock-interview/tracker',
        attempts: [],
        totalAttempts: 0,
        activeAttempts: [],
        activeAttemptCount: 0,
        page: 1,
        pageCount: 1,
        chartPoints: [],
        averageScore: null,
        bestScore: null,
        scoreTrend: null,
        analyticsAttemptCount: 0,
        topicPerformance: []
    });
    assert.match(html, /active question progress appears below/);
    assert.match(html, /No completed interviews yet/);
});

test('tracker displays and offers a resume action for an unfinished interview', async () => {
    const attemptId = new mongoose.Types.ObjectId().toString();
    const html = await ejs.renderFile(trackerViewPath, {
        user: { name: 'Student' },
        path: '/ai/mock-interview/tracker',
        attempts: [],
        totalAttempts: 0,
        activeAttempts: [{
            id: attemptId,
            language: 'JavaScript',
            difficulty: 'medium',
            responseMode: 'multiple-choice',
            status: 'in-progress',
            currentQuestion: 6,
            createdAt: new Date('2026-10-01T00:00:00.000Z')
        }],
        activeAttemptCount: 1,
        page: 1,
        pageCount: 1,
        chartPoints: [],
        averageScore: null,
        bestScore: null,
        scoreTrend: null,
        analyticsAttemptCount: 0,
        topicPerformance: []
    });
    assert.match(html, /Active interview progress/);
    assert.match(html, /6 of 15 answers saved/);
    assert.match(html, new RegExp(`/ai/mock-interview\\?session=${attemptId}`));
    assert.match(html, /Resume interview/);
});

test('tracker renders its score graph, summary metrics, and topic mastery bars', async () => {
    const html = await ejs.renderFile(trackerViewPath, {
        user: { name: 'Student' },
        path: '/ai/mock-interview/tracker',
        attempts: [],
        totalAttempts: 2,
        activeAttempts: [],
        activeAttemptCount: 0,
        page: 1,
        pageCount: 1,
        chartPoints: [
            { x: 64, y: 104, label: '60%', date: '9/1/2026', completedAt: new Date('2026-09-01T00:00:00.000Z') },
            { x: 764, y: 64, label: '80%', date: '10/1/2026', completedAt: new Date('2026-10-01T00:00:00.000Z') }
        ],
        averageScore: 70,
        bestScore: 80,
        scoreTrend: 20,
        analyticsAttemptCount: 2,
        topicPerformance: [{ topic: 'Promises', percentage: 50, questionCount: 2 }]
    });

    assert.match(html, /Performance snapshot/);
    assert.match(html, /Personal best/);
    assert.match(html, /Score trend/);
    assert.match(html, /<polyline/);
    assert.match(html, /Topic mastery/);
    assert.match(html, /Promises/);
    assert.match(html, /50%/);
});

test('attempt detail query is restricted to the authenticated owner and completed reports', async () => {
    const userId = new mongoose.Types.ObjectId();
    const attemptId = new mongoose.Types.ObjectId();
    let capturedFilter;
    MockInterview.findOne = (filter) => {
        capturedFilter = filter;
        return {
            select() { return this; },
            lean: async () => null
        };
    };
    const res = responseRecorder();

    await getInterviewTrackerDetail({
        params: { id: attemptId.toString() },
        user: { _id: userId }
    }, res);

    assert.equal(res.statusCode, 404);
    assert.equal(capturedFilter.user, userId);
    assert.equal(capturedFilter.status, 'completed');
    assert.deepEqual(capturedFilter.finalReport, { $exists: true });
});

test('comparison validates IDs and queries both attempts only for the authenticated owner', async () => {
    const userId = new mongoose.Types.ObjectId();
    const firstId = new mongoose.Types.ObjectId();
    const secondId = new mongoose.Types.ObjectId();
    let capturedFilter;
    MockInterview.find = (filter) => {
        capturedFilter = filter;
        return {
            select() { return this; },
            lean: async () => []
        };
    };
    const res = responseRecorder();

    await compareInterviewAttempts({
        query: { firstId: firstId.toString(), secondId: secondId.toString() },
        user: { _id: userId }
    }, res);
    assert.equal(res.statusCode, 404);
    assert.deepEqual(capturedFilter._id.$in, [firstId.toString(), secondId.toString()]);
    assert.equal(capturedFilter.user, userId);
    assert.equal(capturedFilter.status, 'completed');
    assert.deepEqual(capturedFilter.finalReport, { $exists: true });

    const invalidIdResponse = responseRecorder();
    await compareInterviewAttempts({
        query: { firstId: 'invalid', secondId: secondId.toString() },
        user: { _id: userId }
    }, invalidIdResponse);
    assert.equal(invalidIdResponse.statusCode, 400);

    const sameIdResponse = responseRecorder();
    await compareInterviewAttempts({
        query: { firstId: firstId.toString(), secondId: firstId.toString().toUpperCase() },
        user: { _id: userId }
    }, sameIdResponse);
    assert.equal(sameIdResponse.statusCode, 400);

    const legacyAttempt = interview({ id: firstId, percentage: 60, questionScores: [6] });
    legacyAttempt.questions[0].options = ['A', 'B', 'C', 'D'];
    const openEndedAttempt = interview({ id: secondId, percentage: 70, questionScores: [7] });
    MockInterview.find = () => ({
        select() { return this; },
        lean: async () => [legacyAttempt, openEndedAttempt]
    });
    const mixedFormatResponse = responseRecorder();
    await compareInterviewAttempts({
        query: { firstId: firstId.toString(), secondId: secondId.toString() },
        user: { _id: userId }
    }, mixedFormatResponse);
    assert.equal(mixedFormatResponse.statusCode, 400);
    assert.match(mixedFormatResponse.body.message, /same format/);
});

test('tracker and comparison endpoints are registered before the generic interview ID route', () => {
    const paths = aiRoutes.stack
        .map((layer) => layer.route?.path)
        .filter(Boolean);
    assert.ok(paths.includes('/mock-interview/tracker'));
    assert.ok(paths.includes('/mock-interview/tracker/:id'));
    assert.ok(paths.includes('/mock-interview/tracker/compare'));
    assert.ok(paths.includes('/mock-interview/:id/rate'));
    assert.ok(paths.indexOf('/mock-interview/tracker/compare') < paths.indexOf('/mock-interview/tracker/:id'));
    assert.ok(paths.indexOf('/mock-interview/tracker/compare') < paths.indexOf('/mock-interview/:id'));
});
