import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import ejs from 'ejs';
import authRoutes from '../routes/authRoutes.js';
import {
    createGitHubAuthorizationUrl,
    getGitHubOAuthConfig,
    getGitHubProfile,
    matchesOAuthState
} from '../services/githubOAuth.js';
import { getJwtSecret } from '../services/jwtAuth.js';

const config = {
    clientId: 'test-client',
    clientSecret: 'test-secret',
    callbackUrl: 'http://localhost:5000/auth/github/callback'
};
const loginViewPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../views/auth/login.ejs'
);

test('GitHub OAuth configuration and authorization URL include the callback and CSRF state', () => {
    assert.throws(() => getGitHubOAuthConfig({}), /GITHUB_CLIENT_ID/);
    const authorizationUrl = new URL(createGitHubAuthorizationUrl('random-state', config));

    assert.equal(authorizationUrl.origin, 'https://github.com');
    assert.equal(authorizationUrl.pathname, '/login/oauth/authorize');
    assert.equal(authorizationUrl.searchParams.get('client_id'), 'test-client');
    assert.equal(authorizationUrl.searchParams.get('redirect_uri'), config.callbackUrl);
    assert.equal(authorizationUrl.searchParams.get('state'), 'random-state');
    assert.equal(authorizationUrl.searchParams.get('scope'), 'read:user user:email');
});

test('OAuth callback state must match the cookie value', () => {
    assert.equal(matchesOAuthState('state-value', 'state-value'), true);
    assert.equal(matchesOAuthState('state-value', 'different-state'), false);
    assert.equal(matchesOAuthState(undefined, 'state-value'), false);
});

test('JWT signing requires a configured high-entropy secret', () => {
    assert.throws(() => getJwtSecret({}), /JWT_SECRET must be configured/);
    assert.throws(() => getJwtSecret({ JWT_SECRET: 'too-short' }), /at least 32 characters/);
    assert.equal(getJwtSecret({ JWT_SECRET: 'a'.repeat(32) }), 'a'.repeat(32));
});

test('GitHub profile uses the verified primary email and a safe display-name fallback', async () => {
    const requests = [];
    const responses = [
        { ok: true, status: 200, json: async () => ({ access_token: 'access-token' }) },
        { ok: true, status: 200, json: async () => ({ id: 42, login: 'octocat', name: null, avatar_url: 'https://example.test/avatar.png' }) },
        { ok: true, status: 200, json: async () => [
            { email: 'unverified@example.test', primary: true, verified: false },
            { email: 'student@example.test', primary: true, verified: true }
        ] }
    ];
    const profile = await getGitHubProfile('oauth-code', config, async (...args) => {
        requests.push(args);
        return responses.shift();
    });

    assert.deepEqual(profile, {
        githubId: '42',
        name: 'octocat',
        email: 'student@example.test',
        profileImage: 'https://example.test/avatar.png'
    });
    assert.equal(requests.length, 3);
    assert.match(requests[1][1].headers.Authorization, /^Bearer access-token$/);
});

test('GitHub OAuth rejects accounts without a verified primary email', async () => {
    const responses = [
        { ok: true, status: 200, json: async () => ({ access_token: 'access-token' }) },
        { ok: true, status: 200, json: async () => ({ id: 42, login: 'octocat' }) },
        { ok: true, status: 200, json: async () => [{ email: 'student@example.test', primary: true, verified: false }] }
    ];
    await assert.rejects(
        getGitHubProfile('oauth-code', config, async () => responses.shift()),
        /verified primary email/
    );
});

test('password accounts require a password while GitHub accounts may use provider authentication', async () => {
    const passwordAccount = new User({
        name: 'Password user',
        email: 'password-user@example.test'
    });
    await assert.rejects(passwordAccount.validate(), (error) =>
        error instanceof mongoose.Error.ValidationError && Boolean(error.errors.password)
    );

    const githubAccount = new User({
        name: 'GitHub user',
        email: 'github-user@example.test',
        githubId: '12345'
    });
    await assert.doesNotReject(githubAccount.validate());
});

test('login page shows GitHub sign-in only when configured and safely renders callback errors', async () => {
    const enabledHtml = await ejs.renderFile(loginViewPath, {
        githubConfigured: true,
        error: 'GitHub sign-in failed.'
    });
    const disabledHtml = await ejs.renderFile(loginViewPath, {
        githubConfigured: false,
        error: null
    });

    assert.match(enabledHtml, /href="\/auth\/github"/);
    assert.match(enabledHtml, /GitHub sign-in failed\./);
    assert.doesNotMatch(disabledHtml, /href="\/auth\/github"/);
});

test('GitHub authorization and callback routes are registered in the auth router', () => {
    const paths = authRoutes.stack
        .map((layer) => layer.route?.path)
        .filter(Boolean);

    assert.ok(paths.includes('/github'));
    assert.ok(paths.includes('/github/callback'));
});
