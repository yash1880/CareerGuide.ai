import assert from 'node:assert/strict';
import { test } from 'node:test';
import mongoose from 'mongoose';
import {
    DIFFICULTIES,
    getQuestionSet,
    SUPPORTED_LANGUAGES,
    validateQuestionBank
} from '../data/mockInterviewQuestionBank.js';
import MockInterview from '../models/MockInterview.js';
import ejs from 'ejs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const interviewViewPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views/mock-interview.ejs'
);

test('question bank provides fifteen valid MCQs with reference answers for every selection', () => {
    assert.ok(validateQuestionBank() > 0);

    for (const language of SUPPORTED_LANGUAGES) {
        for (const difficulty of DIFFICULTIES) {
            const questions = getQuestionSet(language, difficulty, () => 0.999999);
            assert.equal(questions.length, 15, `${language} ${difficulty}`);
            assert.equal(new Set(questions.map(({ question }) => question)).size, 15);
            for (const question of questions) {
                assert.ok(question.question.trim());
                assert.ok(question.referenceAnswer.trim());
                assert.equal(question.options.length, 4);
                assert.equal(new Set(question.options).size, 4);
                assert.equal(question.options[question.correctOption], question.referenceAnswer);
            }
        }
    }
});

test('JavaScript MCQ pool draws varied questions from the supplied quiz bank', () => {
    const easyQuestions = getQuestionSet('JavaScript', 'easy', () => 0.999999);
    const mediumQuestions = getQuestionSet('JavaScript', 'medium', () => 0.999999);
    const hardQuestions = getQuestionSet('JavaScript', 'hard', () => 0.999999);
    const selectedSets = DIFFICULTIES.map((difficulty) =>
        [
            getQuestionSet('JavaScript', difficulty, () => 0),
            getQuestionSet('JavaScript', difficulty, () => 0.999999)
        ]
    );

    assert.equal(easyQuestions.find(({ topic }) => topic === 'Null type').referenceAnswer, '`"object"`');
    assert.equal(easyQuestions.find(({ topic }) => topic === 'Work rate').referenceAnswer, '2.5 days');
    const salaryQuestion = easyQuestions.find(({ topic }) => topic === 'Salary calculation');
    assert.equal(salaryQuestion.referenceAnswer, '₹30,000/7 (about ₹4,285.71)');
    assert.deepEqual(new Set(salaryQuestion.options), new Set([
        '₹30,000/7 (about ₹4,285.71)', '₹6,000', '₹7,500', '₹9,000'
    ]));
    assert.equal(mediumQuestions.find(({ topic }) => topic === 'Event loop output').referenceAnswer, 'A C B');
    assert.equal(mediumQuestions.find(({ topic }) => topic === 'Type coercion').referenceAnswer, '20');
    assert.equal(hardQuestions.find(({ topic }) => topic === 'Train crossing').referenceAnswer, '12 seconds');
    assert.equal(hardQuestions.find(({ topic }) => topic === 'Platform crossing').referenceAnswer, '36 km/h');
    assert.ok(selectedSets.every((sets) =>
        new Set(sets.map((questions) => questions.map(({ question }) => question).join('|'))).size > 1
    ));
    assert.ok(selectedSets.flat().every((questions) => questions.length === 15));
});

test('interview setup exposes Easy, Medium, and Hard question levels', async () => {
    const html = await ejs.renderFile(interviewViewPath, {
        user: { name: 'Student' },
        path: '/ai/mock-interview',
        supportedLanguages: SUPPORTED_LANGUAGES
    });

    assert.match(html, /Question level/);
    assert.match(html, /<option value="easy">Easy<\/option>/);
    assert.match(html, /<option value="medium">Medium<\/option>/);
    assert.match(html, /<option value="hard" selected>Hard<\/option>/);
    assert.match(html, /15 MCQs/);
    assert.match(html, /Results at the end/);
    assert.doesNotMatch(html, /15 open-ended questions/);
});

test('MCQ questions and open-ended legacy sessions both validate', async () => {
    const multipleChoiceQuestions = getQuestionSet('JavaScript', 'easy');
    const legacyQuestions = multipleChoiceQuestions.map((question) => ({
        ...question,
        options: ['First', 'Second', 'Third', 'Fourth'],
        correctOption: 0
    }));
    const openEndedQuestions = multipleChoiceQuestions.map(({ options, correctOption, ...question }) => question);
    const base = {
        user: new mongoose.Types.ObjectId(),
        language: 'JavaScript',
        difficulty: 'easy',
        interviewType: 'mixed'
    };

    await new MockInterview({ ...base, questions: legacyQuestions }).validate();
    await new MockInterview({ ...base, questions: openEndedQuestions }).validate();
});
