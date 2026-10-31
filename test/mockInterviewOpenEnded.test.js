import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { afterEach, test } from 'node:test';
import MockInterview from '../models/MockInterview.js';
import {
    completeInterview,
    rateInterviewAnswer,
    submitInterviewAnswer
} from '../controller/mockInterviewController.js';

const originalFindOne = MockInterview.findOne;
const originalFindOneAndUpdate = MockInterview.findOneAndUpdate;

afterEach(() => {
    MockInterview.findOne = originalFindOne;
    MockInterview.findOneAndUpdate = originalFindOneAndUpdate;
});

function makeInterview({ currentQuestion = 0, status = 'in-progress', awaitingScore = false } = {}) {
    const interview = {
        _id: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
        language: 'JavaScript',
        difficulty: 'medium',
        status,
        currentQuestion,
        createdAt: new Date('2026-10-01T00:00:00.000Z'),
        completedAt: null,
        finalReport: undefined,
        questions: Array.from({ length: 15 }, (_, index) => ({
            _id: new mongoose.Types.ObjectId(),
            topic: 'Promises',
            kind: 'scenario',
            question: `Explain question ${index + 1}.`,
            referenceAnswer: `Reference answer ${index + 1}.`,
            answer: awaitingScore && index === currentQuestion ? 'My own response.' : '',
            submissionStatus: awaitingScore && index === currentQuestion ? 'awaiting-score' : 'pending',
            evaluation: undefined
        }))
    };
    interview.toObject = () => ({
        ...interview,
        questions: interview.questions
    });
    return interview;
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
        }
    };
}

test('submitting an open-ended answer saves it for review without advancing or grading it', async () => {
    const interview = makeInterview();
    let capturedUpdate;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async (_filter, update) => {
        capturedUpdate = update;
        interview.questions[0].answer = update.$set['questions.$.answer'];
        interview.questions[0].submissionStatus = update.$set['questions.$.submissionStatus'];
        return interview;
    };
    const res = responseRecorder();

    await submitInterviewAnswer({
        params: { id: interview._id.toString() },
        user: { _id: interview.user },
        body: { questionNumber: 1, answer: '  My explanation of the problem.  ' }
    }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.session.currentQuestion, 0);
    assert.equal(res.body.session.responseMode, 'open-ended');
    assert.equal(res.body.session.awaitingScore, true);
    assert.equal(res.body.session.currentQuestionData.answer, 'My explanation of the problem.');
    assert.equal(res.body.session.currentQuestionData.referenceAnswer, 'Reference answer 1.');
    assert.equal(interview.questions[0].submissionStatus, 'awaiting-score');
    assert.equal(capturedUpdate.$inc, undefined);
    assert.equal(capturedUpdate.$set['questions.$.evaluation.score'], undefined);
});

test('self-rating records an integer score and advances the interview', async () => {
    const interview = makeInterview({ awaitingScore: true });
    let capturedUpdate;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async (_filter, update) => {
        capturedUpdate = update;
        interview.questions[0].submissionStatus = update.$set['questions.$.submissionStatus'];
        interview.questions[0].evaluation = { score: update.$set['questions.$.evaluation.score'] };
        interview.currentQuestion += update.$inc.currentQuestion;
        return interview;
    };
    const res = responseRecorder();

    await rateInterviewAnswer({
        params: { id: interview._id.toString() },
        user: { _id: interview.user },
        body: { questionNumber: 1, score: 7 }
    }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(interview.questions[0].submissionStatus, 'evaluated');
    assert.equal(interview.questions[0].evaluation.score, 7);
    assert.equal(interview.currentQuestion, 1);
    assert.equal(res.body.session.completedCount, 1);
    assert.equal(res.body.session.awaitingScore, false);
    assert.equal(capturedUpdate.$inc.currentQuestion, 1);
});

test('self-rating the final answer moves the interview into report-pending', async () => {
    const interview = makeInterview({ currentQuestion: 14, awaitingScore: true });
    for (const question of interview.questions.slice(0, 14)) {
        question.submissionStatus = 'evaluated';
        question.evaluation = { score: 6 };
    }
    let capturedUpdate;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async (_filter, update) => {
        capturedUpdate = update;
        interview.questions[14].submissionStatus = update.$set['questions.$.submissionStatus'];
        interview.questions[14].evaluation = { score: update.$set['questions.$.evaluation.score'] };
        interview.currentQuestion += update.$inc.currentQuestion;
        interview.status = update.$set.status;
        return interview;
    };
    const res = responseRecorder();

    await rateInterviewAnswer({
        params: { id: interview._id.toString() },
        user: { _id: interview.user },
        body: { questionNumber: 15, score: 8 }
    }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(interview.currentQuestion, 15);
    assert.equal(interview.status, 'report-pending');
    assert.equal(capturedUpdate.$set.status, 'report-pending');
});

test('self-rating rejects values outside the 0 to 10 range', async () => {
    const interview = makeInterview({ awaitingScore: true });
    let updateCalled = false;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async () => {
        updateCalled = true;
        return interview;
    };
    const res = responseRecorder();

    await rateInterviewAnswer({
        params: { id: interview._id.toString() },
        user: { _id: interview.user },
        body: { questionNumber: 1, score: 11 }
    }, res);

    assert.equal(res.statusCode, 400);
    assert.equal(updateCalled, false);
});

test('final report describes open-ended scores as self-assessments, not correct answers', async () => {
    const interview = makeInterview({ currentQuestion: 15, status: 'report-pending' });
    for (const question of interview.questions) {
        question.answer = 'My considered response.';
        question.submissionStatus = 'evaluated';
        question.evaluation = { score: 7 };
    }
    let savedReport;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async (_filter, update) => {
        savedReport = update.$set.finalReport;
        interview.status = update.$set.status;
        interview.completedAt = update.$set.completedAt;
        interview.finalReport = savedReport;
        return interview;
    };
    const res = responseRecorder();

    await completeInterview({
        params: { id: interview._id.toString() },
        user: { _id: interview.user }
    }, res);

    assert.equal(res.statusCode, 200);
    assert.match(savedReport.performanceSummary, /self-assessed score/);
    assert.doesNotMatch(savedReport.performanceSummary, /questions correctly/);
    assert.equal(savedReport.questionResults.length, 15);
    assert.equal(savedReport.questionResults[0].selfAssessed, true);
    assert.match(savedReport.questionResults[0].explanation, /not an automated assessment/);
});

test('multiple-choice answers save for the final report and advance to the next question', async () => {
    const interview = makeInterview();
    interview.questions[0].options = ['wrong', 'reference', 'also wrong', 'not relevant'];
    interview.questions[0].correctOption = 1;
    let capturedUpdate;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async (_filter, update) => {
        capturedUpdate = update;
        interview.questions[0].answer = update.$set['questions.$.answer'];
        interview.questions[0].submissionStatus = update.$set['questions.$.submissionStatus'];
        interview.currentQuestion += update.$inc.currentQuestion;
        return interview;
    };
    const res = responseRecorder();

    await submitInterviewAnswer({
        params: { id: interview._id.toString() },
        user: { _id: interview.user },
        body: { questionNumber: 1, answer: 1 }
    }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.correct, undefined);
    assert.equal(res.body.session.responseMode, 'multiple-choice');
    assert.equal(interview.questions[0].submissionStatus, 'awaiting-score');
    assert.equal(interview.questions[0].evaluation, undefined);
    assert.equal(capturedUpdate.$inc.currentQuestion, 1);
    assert.equal(res.body.session.currentQuestion, 1);
});

test('final multiple-choice submission scores all answers and completes the interview', async () => {
    const interview = makeInterview({ currentQuestion: 15, status: 'report-pending' });
    for (const question of interview.questions) {
        question.options = ['Wrong response', question.referenceAnswer, 'Another distractor', 'A fourth option'];
        question.correctOption = 1;
        question.answer = question.options[1];
        question.submissionStatus = 'awaiting-score';
    }
    for (const question of interview.questions) {
        question.toObject = () => ({ ...question });
    }
    let capturedUpdate;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async (_filter, update) => {
        capturedUpdate = update;
        interview.status = update.$set.status;
        interview.completedAt = update.$set.completedAt;
        interview.finalReport = update.$set.finalReport;
        for (const [path, score] of Object.entries(update.$set)) {
            const match = path.match(/^questions\.(\d+)\.evaluation\.score$/);
            if (match) {
                const question = interview.questions[Number(match[1])];
                question.evaluation = { score };
                question.submissionStatus = 'evaluated';
            }
        }
        return interview;
    };
    const res = responseRecorder();

    await completeInterview({
        params: { id: interview._id.toString() },
        user: { _id: interview.user }
    }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(interview.status, 'completed');
    assert.equal(res.body.session.completedCount, 15);
    assert.equal(capturedUpdate.$set['questions.0.evaluation.score'], 10);
    assert.equal(capturedUpdate.$set['questions.14.evaluation.score'], 10);
    assert.match(capturedUpdate.$set.finalReport.performanceSummary, /15 of 15 questions correctly/);
});

test('final multiple-choice submission cannot complete unanswered questions', async () => {
    const interview = makeInterview({ currentQuestion: 15, status: 'report-pending' });
    for (const question of interview.questions.slice(0, 14)) {
        question.options = ['A', 'B', 'C', 'D'];
        question.correctOption = 0;
        question.answer = 'A';
        question.submissionStatus = 'awaiting-score';
    }
    interview.questions[14].options = ['A', 'B', 'C', 'D'];
    interview.questions[14].correctOption = 0;
    let updateCalled = false;
    MockInterview.findOne = async () => interview;
    MockInterview.findOneAndUpdate = async () => {
        updateCalled = true;
        return interview;
    };
    const res = responseRecorder();

    await completeInterview({
        params: { id: interview._id.toString() },
        user: { _id: interview.user }
    }, res);

    assert.equal(res.statusCode, 409);
    assert.equal(updateCalled, false);
});
