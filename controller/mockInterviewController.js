import mongoose from 'mongoose';
import MockInterview from '../models/MockInterview.js';
import {
    DIFFICULTIES,
    getQuestionSet,
    SUPPORTED_LANGUAGES
} from '../data/mockInterviewQuestionBank.js';

const TRACKER_PAGE_SIZE = 10;

class InterviewError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function sendError(res, error) {
    if (error instanceof InterviewError) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error('Mock interview operation failed:', error);
    return res.status(500).json({ success: false, message: 'The interview could not be processed. Please try again.' });
}

function getResponseMode(interview) {
    return interview.responseMode ||
        (interview.questions?.some((question) => question.options?.length)
            ? 'multiple-choice'
            : 'open-ended');
}

async function findOwnedInterview(id, userId) {
    if (!mongoose.isValidObjectId(id)) {
        throw new InterviewError(400, 'Invalid interview ID.');
    }
    const interview = await MockInterview.findOne({ _id: id, user: userId });
    if (!interview) {
        throw new InterviewError(404, 'Interview not found.');
    }
    return interview;
}

function toClientSession(interview) {
    const lastQuestionIndex = interview.currentQuestion - 1;
    const lastQuestion = lastQuestionIndex >= 0 ? interview.questions[lastQuestionIndex] : null;
    const currentQuestion = interview.currentQuestion < 15
        ? interview.questions[interview.currentQuestion]
        : null;

    return {
        id: interview._id.toString(),
        language: interview.language,
        difficulty: interview.difficulty,
        interviewType: 'mixed',
        status: interview.status,
        currentQuestion: interview.currentQuestion,
        completedCount: interview.questions.filter((question) => question.submissionStatus === 'evaluated').length,
        answeredCount: interview.questions.filter((question) => question.submissionStatus !== 'pending').length,
        currentQuestionData: currentQuestion ? {
            questionNumber: interview.currentQuestion + 1,
            question: currentQuestion.question,
            topic: currentQuestion.topic,
            kind: currentQuestion.kind,
            ...(currentQuestion.submissionStatus === 'pending' ? { options: currentQuestion.options } : {}),
            ...(currentQuestion.submissionStatus === 'awaiting-score'
                ? {
                    answer: currentQuestion.answer,
                    referenceAnswer: currentQuestion.referenceAnswer,
                    options: currentQuestion.options
                }
                : {})
        } : null,
        responseMode: getResponseMode(interview),
        awaitingScore: currentQuestion?.submissionStatus === 'awaiting-score',
        lastEvaluation: lastQuestion?.evaluation ? {
            questionNumber: lastQuestionIndex + 1,
            question: lastQuestion.question,
            topic: lastQuestion.topic,
            answer: lastQuestion.answer,
            referenceAnswer: lastQuestion.referenceAnswer,
            options: lastQuestion.options,
            selfAssessed: !lastQuestion.options?.length,
            correct: lastQuestion.evaluation.score === 10,
            score: lastQuestion.evaluation.score
        } : null,
        finalReport: interview.finalReport || null,
        createdAt: interview.createdAt,
        completedAt: interview.completedAt
    };
}

function makeQuestionResult(question, index) {
    const selfAssessed = !question.options?.length;
    return {
        questionNumber: index + 1,
        question: question.question,
        topic: question.topic,
        kind: question.kind,
        answer: question.answer,
        score: question.evaluation.score,
        selfAssessed,
        correctPoints: selfAssessed
            ? []
            : question.evaluation.score === 10 ? ['Correct option selected.'] : [],
        missingOrIncorrectPoints: selfAssessed
            ? question.evaluation.score < 7
                ? ['Compare your response with the reference answer and identify the key points you missed.']
                : []
            : question.evaluation.score === 0 ? ['The selected option was incorrect.'] : [],
        explanation: selfAssessed
            ? `You self-rated this response ${question.evaluation.score}/10. This practice score is not an automated assessment.`
            : question.evaluation.score === 10
                ? 'Your selected option matches the reference answer.'
                : 'Review the reference answer and try to understand why it is the best choice.',
        modelAnswer: question.referenceAnswer,
        suggestions: selfAssessed
            ? ['Practise explaining your reasoning aloud, then revisit this question and try again.']
            : []
    };
}

function makeLocalReport(interview) {
    const questionResults = interview.questions.map(makeQuestionResult);
    const totalScore = questionResults.reduce((sum, question) => sum + question.score, 0);
    const percentage = Math.round((totalScore / 150) * 10000) / 100;
    const topicScores = new Map();

    for (const question of questionResults) {
        const current = topicScores.get(question.topic) || { total: 0, count: 0 };
        current.total += question.score;
        current.count += 1;
        topicScores.set(question.topic, current);
    }

    const rankedTopics = [...topicScores.entries()]
        .map(([topic, result]) => ({ topic, average: result.total / result.count }))
        .sort((left, right) => right.average - left.average || left.topic.localeCompare(right.topic));
    const strongestTopics = rankedTopics.slice(0, 3).map(({ topic }) => topic);
    const weakestTopics = rankedTopics.slice(-3).reverse().map(({ topic }) => topic);
    const codingResults = questionResults.filter((question) =>
        ['coding', 'debugging', 'practical'].includes(question.kind)
    );
    const codingPercentage = codingResults.length
        ? codingResults.reduce((sum, question) => sum + question.score, 0) / (codingResults.length * 10) * 100
        : null;

    const selfAssessed = questionResults.some((question) => question.selfAssessed);
    let performanceSummary;
    if (selfAssessed) {
        if (percentage >= 80) {
            performanceSummary = `Your self-assessed score was ${totalScore}/150 (${percentage}%). Compare your responses with the reference answers and use the topic breakdown to guide further practice.`;
        } else if (percentage >= 60) {
            performanceSummary = `Your self-assessed score was ${totalScore}/150 (${percentage}%). Review the reference answers and focus your next practice on the topics listed below.`;
        } else {
            performanceSummary = `Your self-assessed score was ${totalScore}/150 (${percentage}%). Use the reference answers and lower-rated topics as a guide for focused practice.`;
        }
    } else if (percentage >= 80) {
        performanceSummary = `You answered ${totalScore / 10} of 15 questions correctly (${percentage}%). Your results show strong knowledge across this question set.`;
    } else if (percentage >= 60) {
        performanceSummary = `You answered ${totalScore / 10} of 15 questions correctly (${percentage}%). Your results show a developing understanding, with some topics worth revisiting.`;
    } else {
        performanceSummary = `You answered ${totalScore / 10} of 15 questions correctly (${percentage}%). Use the reference answers and lower-scoring topics as a guide for focused practice.`;
    }

    return {
        totalScore,
        percentage,
        performanceSummary,
        strongestTopics,
        weakestTopics,
        technicalKnowledgeAssessment: selfAssessed
            ? `You self-rated your responses at ${totalScore}/150 across 15 open-ended practice questions.`
            : `You answered ${totalScore / 10} of 15 multiple-choice questions correctly.`,
        codingDebuggingAssessment: codingPercentage === null
            ? 'This question set did not include practical or coding-style questions.'
            : selfAssessed
                ? `Your average self-rating on ${codingResults.length} practical, coding, and debugging questions was ${Math.round(codingPercentage * 10) / 10}%.`
                : `You answered ${codingResults.filter((question) => question.score === 10).length} of ${codingResults.length} practical, coding, and debugging questions correctly.`,
        topicsToRevise: weakestTopics,
        improvementPlan: weakestTopics.length
            ? weakestTopics.map((topic) => `Review ${topic}, compare your response with its reference answer, and practise explaining the concept or solution again.`)
            : ['Review the reference answers and practise explaining your reasoning clearly.'],
        questionResults
    };
}

function getStoredScore(value) {
    return Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
}

function getInterviewBreakdowns(interview) {
    const aggregate = (field) => {
        const scores = new Map();
        for (const question of interview.questions || []) {
            const name = question[field]?.trim();
            const score = question.evaluation?.score;
            if (!name || !Number.isFinite(score) || score < 0 || score > 10) continue;
            const current = scores.get(name) || { total: 0, count: 0 };
            current.total += score;
            current.count += 1;
            scores.set(name, current);
        }
        return Object.fromEntries([...scores.entries()]
            .map(([name, result]) => [name, Math.round((result.total / result.count) * 100) / 10])
            .sort(([left], [right]) => left.localeCompare(right)));
    };

    return {
        kinds: aggregate('kind'),
        topics: aggregate('topic')
    };
}

function toTrackerAttempt(interview) {
    return {
        id: interview._id.toString(),
        language: interview.language,
        difficulty: interview.difficulty,
        responseMode: getResponseMode(interview),
        totalScore: Number.isFinite(interview.finalReport?.totalScore) &&
            interview.finalReport.totalScore >= 0 &&
            interview.finalReport.totalScore <= 150
            ? interview.finalReport.totalScore
            : null,
        percentage: getStoredScore(interview.finalReport?.percentage),
        completedAt: interview.completedAt || interview.createdAt,
        performanceSummary: interview.finalReport?.performanceSummary || '',
        strongestTopics: interview.finalReport?.strongestTopics || [],
        weakestTopics: interview.finalReport?.weakestTopics || [],
        technicalKnowledgeAssessment: interview.finalReport?.technicalKnowledgeAssessment || '',
        codingDebuggingAssessment: interview.finalReport?.codingDebuggingAssessment || '',
        topicsToRevise: interview.finalReport?.topicsToRevise || [],
        improvementPlan: interview.finalReport?.improvementPlan || [],
        questionResults: interview.finalReport?.questionResults || [],
        ...getInterviewBreakdowns(interview)
    };
}

function compareMetric(name, before, after) {
    const availableBefore = getStoredScore(before);
    const availableAfter = getStoredScore(after);
    if (availableBefore === null || availableAfter === null) {
        return { name, before: availableBefore, after: availableAfter, change: null, direction: 'unavailable' };
    }
    const change = Math.round((availableAfter - availableBefore) * 10) / 10;
    return {
        name,
        before: availableBefore,
        after: availableAfter,
        change,
        direction: change > 0 ? 'improved' : change < 0 ? 'declined' : 'unchanged'
    };
}

export function buildInterviewComparison(firstInterview, secondInterview) {
    const first = toTrackerAttempt(firstInterview);
    const second = toTrackerAttempt(secondInterview);
    const compareBreakdown = (key) => [...new Set([
        ...Object.keys(first[key]),
        ...Object.keys(second[key])
    ])].sort((left, right) => left.localeCompare(right))
        .map((name) => compareMetric(name, first[key][name], second[key][name]));

    return {
        first: {
            id: first.id,
            language: first.language,
            difficulty: first.difficulty,
            responseMode: first.responseMode,
            completedAt: first.completedAt,
            totalScore: first.totalScore,
            percentage: first.percentage
        },
        second: {
            id: second.id,
            language: second.language,
            difficulty: second.difficulty,
            responseMode: second.responseMode,
            completedAt: second.completedAt,
            totalScore: second.totalScore,
            percentage: second.percentage
        },
        overall: compareMetric('Overall score', first.percentage, second.percentage),
        kinds: compareBreakdown('kinds'),
        topics: compareBreakdown('topics')
    };
}

export function getMockInterviewPage(req, res) {
    return res.render('mock-interview', {
        user: req.user,
        path: '/ai/mock-interview',
        supportedLanguages: SUPPORTED_LANGUAGES
    });
}

export async function startInterview(req, res) {
    try {
        const { language, difficulty } = req.body || {};
        if (typeof language !== 'string' || !SUPPORTED_LANGUAGES.includes(language)) {
            throw new InterviewError(400, 'Choose one of the available languages: JavaScript, Python, Java, C++, or PHP.');
        }
        if (typeof difficulty !== 'string' || !DIFFICULTIES.includes(difficulty)) {
            throw new InterviewError(400, 'Choose Easy, Medium, or Hard difficulty.');
        }

        const questions = getQuestionSet(language, difficulty);
        if (questions.length !== 15) {
            throw new InterviewError(500, 'The selected question bank must contain exactly 15 questions.');
        }

        const interview = await MockInterview.create({
            user: req.user._id,
            language,
            difficulty,
            responseMode: 'multiple-choice',
            interviewType: 'mixed',
            questions
        });
        return res.status(201).json({ success: true, session: toClientSession(interview) });
    } catch (error) {
        return sendError(res, error);
    }
}

export async function getInterviewSession(req, res) {
    try {
        const interview = await findOwnedInterview(req.params.id, req.user._id);
        return res.json({ success: true, session: toClientSession(interview) });
    } catch (error) {
        return sendError(res, error);
    }
}

export async function submitInterviewAnswer(req, res) {
    try {
        const interview = await findOwnedInterview(req.params.id, req.user._id);
        const { questionNumber, answer } = req.body || {};
        if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > 15) {
            throw new InterviewError(400, 'Provide a valid question number.');
        }
        const questionIndex = questionNumber - 1;
        const question = interview.questions[questionIndex];

        if (question.options?.length) {
            if (!Number.isInteger(answer) || answer < 0 || answer > 3) {
                throw new InterviewError(400, 'Select one of the four answer options.');
            }
            if (questionIndex < interview.currentQuestion) {
                if (question.submissionStatus !== 'pending' &&
                    question.answer === question.options[answer]) {
                    return res.json({ success: true, duplicate: true, session: toClientSession(interview) });
                }
                throw new InterviewError(409, 'This question has already been answered.');
            }
            if (questionIndex !== interview.currentQuestion || interview.status !== 'in-progress') {
                throw new InterviewError(409, 'That is not the current open question.');
            }
            if (question.submissionStatus !== 'pending') {
                throw new InterviewError(409, 'This question has already been answered.');
            }

            const finalQuestion = questionIndex === 14;
            const saved = await MockInterview.findOneAndUpdate(
                {
                    _id: interview._id,
                    user: req.user._id,
                    status: 'in-progress',
                    currentQuestion: questionIndex,
                    questions: { $elemMatch: { _id: question._id, submissionStatus: 'pending' } }
                },
                {
                    $set: {
                        'questions.$.answer': question.options[answer],
                        'questions.$.submissionStatus': 'awaiting-score',
                        ...(finalQuestion ? { status: 'report-pending' } : {})
                    },
                    $inc: { currentQuestion: 1 }
                },
                { new: true, runValidators: true }
            );
            if (!saved) {
                throw new InterviewError(409, 'This answer was already submitted. Refresh the interview to continue.');
            }
            return res.json({ success: true, session: toClientSession(saved) });
        }

        if (typeof answer !== 'string' || !answer.trim() || answer.trim().length > 10000) {
            throw new InterviewError(400, 'Enter an answer between 1 and 10,000 characters.');
        }
        if (questionIndex < interview.currentQuestion) {
            if (question.submissionStatus === 'awaiting-score' && question.answer === answer.trim()) {
                return res.json({ success: true, duplicate: true, session: toClientSession(interview) });
            }
            throw new InterviewError(409, 'This question has already been answered.');
        }
        if (questionIndex !== interview.currentQuestion || interview.status !== 'in-progress') {
            throw new InterviewError(409, 'That is not the current open question.');
        }

        if (question.submissionStatus !== 'pending') {
            if (question.submissionStatus === 'awaiting-score' && question.answer === answer.trim()) {
                return res.json({ success: true, duplicate: true, session: toClientSession(interview) });
            }
            throw new InterviewError(409, 'This question is already awaiting your self-rating.');
        }

        const saved = await MockInterview.findOneAndUpdate(
            {
                _id: interview._id,
                user: req.user._id,
                status: 'in-progress',
                currentQuestion: questionIndex,
                questions: { $elemMatch: { _id: question._id, submissionStatus: 'pending' } }
            },
            {
                $set: {
                    'questions.$.answer': answer.trim(),
                    'questions.$.submissionStatus': 'awaiting-score'
                }
            },
            { new: true, runValidators: true }
        );
        if (!saved) {
            throw new InterviewError(409, 'This answer was already submitted. Refresh the interview to continue.');
        }
        return res.json({ success: true, session: toClientSession(saved) });
    } catch (error) {
        return sendError(res, error);
    }
}

export async function rateInterviewAnswer(req, res) {
    try {
        const interview = await findOwnedInterview(req.params.id, req.user._id);
        const { questionNumber, score } = req.body || {};
        if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > 15) {
            throw new InterviewError(400, 'Provide a valid question number.');
        }
        if (!Number.isInteger(score) || score < 0 || score > 10) {
            throw new InterviewError(400, 'Choose an honest self-rating from 0 to 10.');
        }

        const questionIndex = questionNumber - 1;
        const question = interview.questions[questionIndex];
        if (questionIndex < interview.currentQuestion &&
            question.submissionStatus === 'evaluated' &&
            question.evaluation?.score === score) {
            return res.json({ success: true, duplicate: true, session: toClientSession(interview) });
        }
        if (questionIndex !== interview.currentQuestion ||
            interview.status !== 'in-progress' ||
            question.submissionStatus !== 'awaiting-score') {
            throw new InterviewError(409, 'Submit your response before rating it.');
        }

        const update = {
            $set: {
                'questions.$.submissionStatus': 'evaluated',
                'questions.$.evaluation.score': score
            },
            $inc: { currentQuestion: 1 }
        };
        if (questionIndex === 14) update.$set.status = 'report-pending';
        const saved = await MockInterview.findOneAndUpdate(
            {
                _id: interview._id,
                user: req.user._id,
                status: 'in-progress',
                currentQuestion: questionIndex,
                questions: { $elemMatch: { _id: question._id, submissionStatus: 'awaiting-score' } }
            },
            update,
            { new: true, runValidators: true }
        );
        if (!saved) {
            throw new InterviewError(409, 'This response was already rated. Refresh the interview to continue.');
        }
        return res.json({ success: true, session: toClientSession(saved) });
    } catch (error) {
        return sendError(res, error);
    }
}

export async function completeInterview(req, res) {
    try {
        const interview = await findOwnedInterview(req.params.id, req.user._id);
        if (interview.status === 'completed') {
            return res.json({ success: true, session: toClientSession(interview) });
        }
        if (interview.currentQuestion !== 15) {
            throw new InterviewError(409, 'Answer all 15 questions before submitting the interview.');
        }

        if (interview.questions.some((question) =>
            question.options?.length
                ? question.submissionStatus === 'pending' || !question.options.includes(question.answer)
                : question.submissionStatus !== 'evaluated'
        )) {
            throw new InterviewError(409, 'Answer all 15 questions before submitting the interview.');
        }

        const reportInterview = {
            ...interview.toObject(),
            questions: interview.questions.map((question) => {
                if (!question.options?.length) return question.toObject?.() || question;
                const score = question.options[question.correctOption] === question.answer ? 10 : 0;
                return {
                    ...question.toObject?.() || question,
                    submissionStatus: 'evaluated',
                    evaluation: { score }
                };
            })
        };
        const report = makeLocalReport(reportInterview);
        const questionUpdates = {};
        interview.questions.forEach((question, index) => {
            if (!question.options?.length) return;
            questionUpdates[`questions.${index}.submissionStatus`] = 'evaluated';
            questionUpdates[`questions.${index}.evaluation.score`] =
                question.options[question.correctOption] === question.answer ? 10 : 0;
        });
        const completed = await MockInterview.findOneAndUpdate(
            { _id: interview._id, user: req.user._id, status: 'report-pending', currentQuestion: 15 },
            {
                $set: {
                    status: 'completed',
                    completedAt: new Date(),
                    finalReport: report,
                    ...questionUpdates
                }
            },
            { new: true, runValidators: true }
        );
        if (!completed) {
            const latest = await findOwnedInterview(req.params.id, req.user._id);
            if (latest.status === 'completed') {
                return res.json({ success: true, session: toClientSession(latest) });
            }
            throw new InterviewError(409, 'The report could not be saved. Refresh and try again.');
        }
        return res.json({ success: true, session: toClientSession(completed) });
    } catch (error) {
        return sendError(res, error);
    }
}

export async function getInterviewReport(req, res) {
    try {
        const interview = await findOwnedInterview(req.params.id, req.user._id);
        if (interview.status !== 'completed' || !interview.finalReport) {
            throw new InterviewError(409, 'The report is available after you complete and submit all 15 answers.');
        }
        return res.json({
            success: true,
            interview: {
                id: interview._id.toString(),
                language: interview.language,
                difficulty: interview.difficulty,
                createdAt: interview.createdAt,
                completedAt: interview.completedAt
            },
            report: interview.finalReport
        });
    } catch (error) {
        return sendError(res, error);
    }
}

export async function getInterviewHistory(req, res) {
    try {
        const history = await MockInterview.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(25)
            .select('_id language difficulty responseMode status currentQuestion questions.options finalReport.totalScore finalReport.percentage createdAt completedAt')
            .lean();
        return res.json({
            success: true,
            history: history.map((item) => ({
                id: item._id.toString(),
                language: item.language,
                difficulty: item.difficulty,
                responseMode: getResponseMode(item),
                status: item.status,
                completedCount: item.currentQuestion,
                totalScore: item.finalReport?.totalScore ?? null,
                percentage: item.finalReport?.percentage ?? null,
                createdAt: item.createdAt,
                completedAt: item.completedAt
            }))
        });
    } catch (error) {
        return sendError(res, error);
    }
}

export async function getInterviewImprovementTracker(req, res) {
    const rawPage = req.query.page ?? '1';
    if (!/^\d+$/.test(String(rawPage)) || Number(rawPage) < 1) {
        return res.status(400).send('Page must be a positive integer.');
    }
    const page = Number(rawPage);
    if (!Number.isSafeInteger(page)) {
        return res.status(400).send('Page must be a positive integer.');
    }

    try {
        const filter = {
            user: req.user._id,
            status: 'completed',
            finalReport: { $exists: true }
        };
        const activeFilter = {
            user: req.user._id,
            status: { $in: ['in-progress', 'report-pending'] }
        };
        const analyticsFilter = {
            ...filter,
            $or: [
                { responseMode: 'multiple-choice' },
                {
                    responseMode: { $exists: false },
                    'questions.0.options.0': { $exists: true }
                }
            ]
        };
        const [interviews, totalAttempts, analyticsInterviews, activeInterviews, activeAttemptCount] = await Promise.all([
            MockInterview.find(filter)
                .sort({ completedAt: -1, createdAt: -1 })
                .skip((page - 1) * TRACKER_PAGE_SIZE)
                .limit(TRACKER_PAGE_SIZE)
                .select('_id language difficulty responseMode completedAt createdAt questions.options questions.topic questions.kind questions.evaluation.score finalReport')
                .lean(),
            MockInterview.countDocuments(filter),
            MockInterview.find(analyticsFilter)
                .sort({ completedAt: -1, createdAt: -1 })
                .limit(20)
                .select('_id responseMode completedAt createdAt questions.options questions.topic questions.evaluation.score finalReport.percentage')
                .lean(),
            MockInterview.find(activeFilter)
                .sort({ updatedAt: -1 })
                .limit(TRACKER_PAGE_SIZE)
                .select('_id language difficulty responseMode status currentQuestion createdAt questions.options questions.submissionStatus')
                .lean(),
            MockInterview.countDocuments(activeFilter)
        ]);
        const attempts = interviews.map(toTrackerAttempt);
        const activeAttempts = activeInterviews.map((interview) => ({
            id: interview._id.toString(),
            language: interview.language,
            difficulty: interview.difficulty,
            responseMode: getResponseMode(interview),
            status: interview.status,
            currentQuestion: interview.currentQuestion,
            awaitingScore: interview.questions?.[interview.currentQuestion]?.submissionStatus === 'awaiting-score',
            createdAt: interview.createdAt
        }));
        const chartAttempts = analyticsInterviews
            .map((interview) => ({
                percentage: getStoredScore(interview.finalReport?.percentage),
                completedAt: interview.completedAt || interview.createdAt
            }))
            .filter((attempt) => attempt.percentage !== null)
            .reverse();
        const chartPoints = chartAttempts.map((attempt, index) => ({
            x: Math.round((index / Math.max(chartAttempts.length - 1, 1)) * 700) + 64,
            y: Math.round(224 - (attempt.percentage / 100) * 200),
            label: `${attempt.percentage}%`,
            date: new Date(attempt.completedAt).toLocaleDateString(),
            completedAt: attempt.completedAt
        }));
        const scoredPercentages = chartAttempts.map((attempt) => attempt.percentage);
        const averageScore = scoredPercentages.length
            ? Math.round((scoredPercentages.reduce((total, score) => total + score, 0) / scoredPercentages.length) * 10) / 10
            : null;
        const bestScore = scoredPercentages.length ? Math.max(...scoredPercentages) : null;
        const scoreTrend = scoredPercentages.length > 1
            ? Math.round((scoredPercentages.at(-1) - scoredPercentages.at(-2)) * 10) / 10
            : null;
        const topicScores = new Map();
        for (const interview of analyticsInterviews) {
            for (const question of interview.questions || []) {
                const topic = question.topic?.trim();
                const score = question.evaluation?.score;
                if (!topic || !Number.isFinite(score) || score < 0 || score > 10) continue;
                const current = topicScores.get(topic) || { total: 0, count: 0 };
                current.total += score;
                current.count += 1;
                topicScores.set(topic, current);
            }
        }
        const topicPerformance = [...topicScores.entries()]
            .map(([topic, result]) => ({
                topic,
                percentage: Math.round((result.total / (result.count * 10)) * 1000) / 10,
                questionCount: result.count
            }))
            .sort((left, right) => left.percentage - right.percentage || left.topic.localeCompare(right.topic))
            .slice(0, 6);

        return res.render('interview-improvement-tracker', {
            user: req.user,
            path: '/ai/mock-interview/tracker',
            attempts,
            totalAttempts,
            activeAttempts,
            activeAttemptCount,
            page,
            pageCount: Math.max(1, Math.ceil(totalAttempts / TRACKER_PAGE_SIZE)),
            chartPoints,
            averageScore,
            bestScore,
            scoreTrend,
            topicPerformance,
            analyticsAttemptCount: analyticsInterviews.length
        });
    } catch (error) {
        console.error('Interview improvement tracker could not be loaded:', error);
        return res.status(500).send('The interview improvement tracker could not be loaded. Please try again.');
    }
}

export async function getInterviewTrackerDetail(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid interview ID.');
    }
    try {
        const interview = await MockInterview.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'completed',
            finalReport: { $exists: true }
        })
            .select('_id user language difficulty responseMode completedAt createdAt questions.options questions.topic questions.kind questions.evaluation.score finalReport')
            .lean();
        if (!interview) {
            return res.status(404).send('Completed interview not found.');
        }
        return res.render('interview-improvement-tracker', {
            user: req.user,
            path: '/ai/mock-interview/tracker',
            attempt: toTrackerAttempt(interview)
        });
    } catch (error) {
        console.error('Interview improvement tracker detail could not be loaded:', error);
        return res.status(500).send('The interview report could not be loaded. Please try again.');
    }
}

export async function compareInterviewAttempts(req, res) {
    const requestedFirstId = req.query.firstId;
    const requestedSecondId = req.query.secondId;
    if (typeof requestedFirstId !== 'string' || typeof requestedSecondId !== 'string' ||
        !mongoose.isValidObjectId(requestedFirstId) || !mongoose.isValidObjectId(requestedSecondId)) {
        return res.status(400).json({ success: false, message: 'Choose two valid interview attempts.' });
    }
    const firstId = requestedFirstId.toLowerCase();
    const secondId = requestedSecondId.toLowerCase();
    if (firstId === secondId) {
        return res.status(400).json({ success: false, message: 'Choose two different interview attempts.' });
    }

    try {
        const interviews = await MockInterview.find({
            _id: { $in: [firstId, secondId] },
            user: req.user._id,
            status: 'completed',
            finalReport: { $exists: true }
        })
            .select('_id language difficulty responseMode completedAt createdAt questions.options questions.topic questions.kind questions.evaluation.score finalReport')
            .lean();
        const firstInterview = interviews.find((interview) => interview._id.toString() === firstId);
        const secondInterview = interviews.find((interview) => interview._id.toString() === secondId);
        if (!firstInterview || !secondInterview) {
            throw new InterviewError(404, 'One or both completed interviews were not found.');
        }
        if (getResponseMode(firstInterview) !== getResponseMode(secondInterview)) {
            return res.status(400).json({
                success: false,
                message: 'Compare two interviews with the same format. Legacy multiple-choice scores and open-ended self-ratings are not directly comparable.'
            });
        }
        return res.json({
            success: true,
            comparison: buildInterviewComparison(firstInterview, secondInterview)
        });
    } catch (error) {
        return sendError(res, error);
    }
}
