export function getJwtSecret(env = process.env) {
    const secret = env.JWT_SECRET;
    if (typeof secret !== 'string' || secret.length < 32) {
        throw new Error('JWT_SECRET must be configured with a random value of at least 32 characters.');
    }
    return secret;
}
