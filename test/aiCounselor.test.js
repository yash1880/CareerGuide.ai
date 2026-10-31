import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import {
    DEFAULT_GEMINI_MODEL,
    handleAIQuery,
    requestCareerGuidance
} from '../controller/aiController.js';

const viewsDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views'
);

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

test('AI counselor validates the question before making a request', async () => {
    const res = responseRecorder();
    await handleAIQuery({ body: { prompt: '   ' } }, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /Enter a question/);

    const tooLong = responseRecorder();
    await handleAIQuery({ body: { prompt: 'x'.repeat(1501) } }, tooLong);
    assert.equal(tooLong.statusCode, 400);
    assert.match(tooLong.body.message, /1500 characters/);
});

test('AI counselor defaults to a supported text-generation model', () => {
    assert.equal(DEFAULT_GEMINI_MODEL, 'gemini-3.8-flash');
});

test('AI counselor uses Gemini Interactions API without storing user prompts', async () => {
    const originalModel = process.env.GEMINI_MODEL;
    delete process.env.GEMINI_MODEL;
    let request;
    try {
        const ai = {
            interactions: {
                async create(params) {
                    request = params;
                    return { output_text: 'Build JavaScript fundamentals first.' };
                }
            }
        };
        const response = await requestCareerGuidance(ai, 'How do I start?');
        assert.equal(response.output_text, 'Build JavaScript fundamentals first.');
        assert.equal(request.model, 'gemini-3.8-flash');
        assert.equal(request.input, 'How do I start?');
        assert.equal(request.store, false);
        assert.equal(request.generation_config.max_output_tokens, 1200);
        assert.match(request.system_instruction, /career counselor/);
    } finally {
        if (originalModel === undefined) delete process.env.GEMINI_MODEL;
        else process.env.GEMINI_MODEL = originalModel;
    }
});

test('AI counselor clearly reports missing API configuration', async () => {
    const configuredKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
        const res = responseRecorder();
        await handleAIQuery({ body: { prompt: 'How do I become a frontend developer?' } }, res);
        assert.equal(res.statusCode, 503);
        assert.match(res.body.message, /GEMINI_API_KEY/);
    } finally {
        if (configuredKey === undefined) delete process.env.GEMINI_API_KEY;
        else process.env.GEMINI_API_KEY = configuredKey;
    }
});

test('restored pages render their data and empty states', async () => {
    const pages = [
        ['applications.ejs', { user: { name: 'Student' }, applications: [], selectedApplication: null }],
        ['internships.ejs', { user: { name: 'Student' }, internships: [] }],
        ['careers.ejs', { user: { name: 'Student' }, careers: [] }],
        ['career-result.ejs', {
            user: { name: 'Student' },
            career: { title: 'Developer', description: 'Build software.', requiredSkills: [] }
        }],
        ['ai-counselor.ejs', { user: { name: 'Student' }, path: '/ai/counselor' }],
        ['about.ejs', { user: null, path: '/about' }]
    ];
    for (const [page, locals] of pages) {
        const html = await ejs.renderFile(path.join(viewsDirectory, page), locals);
        assert.match(html, /CareerGuide/);
    }
});

test('About page describes the mission, working features, student benefits, and vision without copying the home hero', async () => {
    const html = await ejs.renderFile(path.join(viewsDirectory, 'about.ejs'), {
        user: null,
        path: '/about'
    });

    assert.match(html, /About CareerGuide AI/);
    assert.match(html, /Our mission/);
    assert.match(html, /Our vision/);
    assert.match(html, /AI Career Guidance/);
    assert.match(html, /Resume ATS Checker/);
    assert.match(html, /Skill Gap Analyzer/);
    assert.match(html, /Career Roadmaps/);
    assert.match(html, /AI Mock Interviews/);
    assert.match(html, /Jobs, Internships & Applications/);
    assert.match(html, /One question at a time/);
    assert.match(html, /images\.unsplash\.com\/photo-1523580494863-6f3031224c94/);
    assert.match(html, /images\.unsplash\.com\/photo-1522202176988-66273c2fd55f/);
    assert.match(html, /Illustrative student photo/);
    assert.match(html, /href="https:\/\/unsplash\.com\/"[^>]*>Unsplash<\/a>/);
    assert.match(html, /Explore possible roles/);
    assert.match(html, /Understand your starting point/);
    assert.match(html, /Prepare with a plan/);
    assert.match(html, /Practise and keep moving/);
    assert.equal((html.match(/<section\b/g) || []).length, 13);
    assert.match(html, /For students figuring out what comes next/);
    assert.match(html, /Discover careers beyond job titles/);
    assert.match(html, /Turn skill gaps into learning priorities/);
    assert.match(html, /Big goals feel better in smaller steps/);
    assert.match(html, /Get application-ready/);
    assert.match(html, /Explore opportunities/);
    assert.doesNotMatch(html, /Job Description Matcher|Study Abroad Guidance|hero-img\.jpeg/);
    assert.match(html, /href="\/auth\/register"/);
    assert.match(html, /href="\/auth\/login"/);

    const appSource = await readFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../app.js'), 'utf8');
    assert.match(appSource, /app\.get\('\/about',\s*optionalAuth/);
    assert.ok(appSource.indexOf("app.get('/about'") < appSource.indexOf("app.use('/careers', requireAuth"));
    assert.match(appSource, /app\.get\('\/dashboard',\s*requireAuth/);
});
