import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';
import { getProfileCompletion, getUserProfile, updateUserProfile } from '../controller/userController.js';

const viewsDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views'
);
const originalFindById = User.findById;
const originalFindByIdAndUpdate = User.findByIdAndUpdate;
const originalUploadStream = cloudinary.uploader.upload_stream;
const originalCloudinaryEnv = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

afterEach(() => {
    User.findById = originalFindById;
    User.findByIdAndUpdate = originalFindByIdAndUpdate;
    cloudinary.uploader.upload_stream = originalUploadStream;
    for (const [key, value] of Object.entries(originalCloudinaryEnv)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
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
        redirect(path) {
            this.redirectPath = path;
            return this;
        },
        render(view, locals) {
            this.view = view;
            this.locals = locals;
            return this;
        }
    };
}

test('profile completion is calculated from fields actually present on the user', () => {
    assert.equal(getProfileCompletion({ name: 'A', email: 'a@example.test' }), 29);
    assert.equal(getProfileCompletion({
        name: 'A',
        email: 'a@example.test',
        targetRole: 'Developer',
        githubLink: '',
        country: 'India',
        language: 'English',
        profileImage: '/uploads/profile.png'
    }), 86);
    assert.equal(getProfileCompletion({
        name: 'A',
        email: 'a@example.test',
        targetRole: 'Developer',
        githubLink: 'https://github.com/example',
        country: 'India',
        language: 'English',
        profileImage: '/uploads/profile.png'
    }), 100);
});

test('profile page loads for the authenticated user with its active path and completion', async () => {
    const user = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Student',
        email: 'student@example.test'
    };
    User.findById = async (id) => {
        assert.equal(String(id), String(user._id));
        return user;
    };
    const res = responseRecorder();

    await getUserProfile({ user: { _id: user._id } }, res);

    assert.equal(res.view, 'profile');
    assert.equal(res.locals.user, user);
    assert.equal(res.locals.path, '/users/profile');
    assert.equal(res.locals.profileCompletion, 29);
});

test('profile update normalizes a GitHub username and preserves other editable profile fields', async () => {
    const userId = new mongoose.Types.ObjectId();
    let savedId;
    let update;
    let options;
    User.findByIdAndUpdate = async (...args) => {
        [savedId, update, options] = args;
    };
    const res = responseRecorder();

    await updateUserProfile({
        user: { _id: userId },
        body: {
            name: ' Student ',
            targetRole: 'Frontend Developer',
            githubLink: 'octocat',
            country: 'India',
            language: 'English'
        }
    }, res);

    assert.equal(String(savedId), String(userId));
    assert.deepEqual(update, {
        name: 'Student',
        targetRole: 'Frontend Developer',
        githubLink: 'https://github.com/octocat',
        country: 'India',
        language: 'English'
    });
    assert.deepEqual(options, { new: true, runValidators: true });
    assert.equal(res.redirectPath, '/users/profile');
});

test('profile update uploads the image to Cloudinary and stores its secure URL', async () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';
    const imageBuffer = Buffer.from('test-image');
    let update;
    User.findByIdAndUpdate = async (id, data) => {
        update = data;
    };
    cloudinary.uploader.upload_stream = (options, callback) => {
        assert.deepEqual(options, {
            folder: 'career-guidance/profile-images',
            resource_type: 'image'
        });
        return {
            end(buffer) {
                assert.deepEqual(buffer, imageBuffer);
                callback(null, { secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/profile.png' });
            }
        };
    };
    const res = responseRecorder();

    await updateUserProfile({
        user: { _id: new mongoose.Types.ObjectId() },
        body: { name: 'Student' },
        file: { buffer: imageBuffer }
    }, res);

    assert.equal(update.profileImage, 'https://res.cloudinary.com/test-cloud/image/upload/profile.png');
    assert.equal(res.redirectPath, '/users/profile');
});

test('profile update rejects an invalid GitHub link without writing profile data', async () => {
    User.findByIdAndUpdate = assert.fail;
    const res = responseRecorder();

    await updateUserProfile({
        user: { _id: new mongoose.Types.ObjectId() },
        body: {
            name: 'Student',
            githubLink: 'javascript:alert(1)',
            targetRole: '',
            country: 'India',
            language: 'English'
        }
    }, res);

    assert.equal(res.statusCode, 400);
    assert.match(res.body, /valid GitHub username/i);
});

test('profile template uses actual profile fields and working section links', async () => {
    const html = await ejs.renderFile(path.join(viewsDirectory, 'profile.ejs'), {
        user: {
            name: 'Student',
            email: 'student@example.test',
            targetRole: '',
            githubLink: '',
            country: 'India',
            language: 'English',
            profileImage: '',
            aiCredits: 0
        },
        path: '/users/profile',
        profileCompletion: 29
    });

    assert.match(html, /Profile completion:/);
    assert.match(html, /href="#personalInformation"/);
    assert.match(html, /href="#careerGoals"/);
    assert.match(html, /href="#accountInformation"/);
    assert.match(html, /id="profileName"/);
    assert.match(html, /Add your target role/);
    assert.match(html, /profile-action-btn/);
    assert.match(html, /profile-photo-upload/);
    assert.match(html, /0 Credits/);
    assert.doesNotMatch(html, /85%|23\/9\/2026|githubUsername/);
});

test('sidebar keeps long active labels aligned with their text and marks the current page', async () => {
    const html = await ejs.renderFile(path.join(viewsDirectory, 'partials/sidebar.ejs'), {
        user: { name: 'Student', profileImage: '' },
        path: '/ai/mock-interview/tracker'
    });
    const trackerLink = html.match(/<a href="\/ai\/mock-interview\/tracker"[^>]*>[\s\S]*?<\/a>/)?.[0];

    assert.ok(trackerLink);
    assert.match(trackerLink, /aria-current="page"/);
    assert.match(trackerLink, /sidebar-nav-icon/);
    assert.match(trackerLink, /<span class="sidebar-nav-label">Interview Improvement Tracker<\/span>/);
    assert.match(html, /sidebar-navigation \.sidebar-nav-label\s*\{[^}]*min-width:\s*0;/);
    assert.match(html, /id="sidebarMenuToggle"/);
    assert.match(html, /id="sidebarBackdrop"/);
    assert.match(html, /@media \(max-width: 991\.98px\)/);
    assert.match(html, /event\.key === 'Escape'/);
    assert.match(html, /class="nav nav-pills flex-column gap-1 sidebar-navigation"/);
    assert.match(html, /sidebar-navigation\s*\{[^}]*overflow-y:\s*auto;/);
    assert.match(html, /class="dropdown dropup sidebar-user-footer/);
    assert.match(html, /sidebar-user-footer\s*\{[^}]*flex:\s*0 0 auto;/);
    assert.equal((html.match(/href="\/applications"/g) || []).length, 1);
    assert.equal((html.match(/href="\/ai\/mock-interview"/g) || []).length, 1);
    assert.doesNotMatch(html, /LinkedIn Profile Review|linkedin-reviewer/);
    assert.ok(html.indexOf('href="/dashboard"') < html.indexOf('href="/ai/mock-interview"'));
    assert.ok(html.indexOf('href="/ai/mock-interview"') < html.indexOf('href="/ai/mock-interview/tracker"'));
    assert.ok(html.indexOf('class="nav nav-pills flex-column gap-1 sidebar-navigation"') <
        html.indexOf('class="dropdown dropup sidebar-user-footer'));
    assert.match(html, /overflow-y:\s*auto;\s*overflow-x:\s*hidden;/);

    const mockInterviewHtml = await ejs.renderFile(path.join(viewsDirectory, 'partials/sidebar.ejs'), {
        user: { name: 'Student', profileImage: '' },
        path: '/ai/mock-interview'
    });
    const mockInterviewLink = mockInterviewHtml.match(/<a href="\/ai\/mock-interview"[^>]*>[\s\S]*?<\/a>/)?.[0];

    assert.ok(mockInterviewLink);
    assert.match(mockInterviewLink, /aria-current="page"/);
    assert.match(mockInterviewLink, /active bg-primary text-white/);
    assert.match(mockInterviewLink, /<span class="sidebar-nav-label">Mock Interview<\/span>/);
});

test('navbar groups opportunity and career links into dropdowns', async () => {
    const html = await ejs.renderFile(path.join(viewsDirectory, 'partials/navbar.ejs'), {
        user: null
    });

    assert.match(html, /id="opportunitiesDropdown"/);
    assert.match(html, /id="careerToolsDropdown"/);
    assert.match(html, /href="\/jobs"/);
    assert.match(html, /href="\/internships"/);
    assert.match(html, /href="\/">Home<\/a>[\s\S]*href="\/about">About<\/a>/);
    assert.match(html, /href="\/resume-ats"/);
    assert.match(html, /href="\/ai\/mock-interview\/tracker"/);
    assert.equal((html.match(/class="nav-item dropdown"/g) || []).length, 2);
});
