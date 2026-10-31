import { timingSafeEqual } from 'node:crypto';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API_URL = 'https://api.github.com';

export function getGitHubOAuthConfig(env = process.env) {
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = env;
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
        throw new Error('GitHub sign-in requires GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL.');
    }

    return {
        clientId: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackUrl: GITHUB_CALLBACK_URL
    };
}

export function createGitHubAuthorizationUrl(state, config) {
    const url = new URL(GITHUB_AUTHORIZE_URL);
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('redirect_uri', config.callbackUrl);
    url.searchParams.set('scope', 'read:user user:email');
    url.searchParams.set('state', state);
    return url.toString();
}

export function matchesOAuthState(expectedState, receivedState) {
    if (typeof expectedState !== 'string' || typeof receivedState !== 'string') return false;
    const expected = Buffer.from(expectedState);
    const received = Buffer.from(receivedState);
    return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function getGitHubProfile(code, config, fetchImpl = fetch) {
    const tokenResponse = await fetchImpl(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'CareerGuide-AI'
        },
        body: JSON.stringify({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            redirect_uri: config.callbackUrl
        })
    });
    if (!tokenResponse.ok) {
        throw new Error(`GitHub token exchange failed with HTTP ${tokenResponse.status}.`);
    }

    const tokenData = await tokenResponse.json();
    if (typeof tokenData.access_token !== 'string' || !tokenData.access_token) {
        throw new Error('GitHub did not return an access token.');
    }

    const apiHeaders = {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${tokenData.access_token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'CareerGuide-AI'
    };
    const [userResponse, emailsResponse] = await Promise.all([
        fetchImpl(`${GITHUB_API_URL}/user`, { headers: apiHeaders }),
        fetchImpl(`${GITHUB_API_URL}/user/emails`, { headers: apiHeaders })
    ]);
    if (!userResponse.ok) {
        throw new Error(`GitHub profile request failed with HTTP ${userResponse.status}.`);
    }
    if (!emailsResponse.ok) {
        throw new Error(`GitHub email request failed with HTTP ${emailsResponse.status}.`);
    }

    const [user, emails] = await Promise.all([userResponse.json(), emailsResponse.json()]);
    const primaryEmail = Array.isArray(emails)
        ? emails.find((entry) => entry.primary === true && entry.verified === true)
        : null;
    if (!primaryEmail || typeof primaryEmail.email !== 'string') {
        throw new Error('GitHub account has no verified primary email address.');
    }
    if (user.id === undefined || user.id === null || typeof user.login !== 'string') {
        throw new Error('GitHub returned an invalid user profile.');
    }

    return {
        githubId: String(user.id),
        name: typeof user.name === 'string' && user.name.trim() ? user.name.trim() : user.login,
        email: primaryEmail.email.trim().toLowerCase(),
        profileImage: typeof user.avatar_url === 'string' ? user.avatar_url : ''
    };
}
