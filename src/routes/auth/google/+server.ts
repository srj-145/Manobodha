import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID } from '$env/static/private';
import type { RequestHandler } from './$types';
import crypto from 'node:crypto';

export const GET: RequestHandler = async ({ url, cookies }) => {
	// If credentials are not configured, redirect back to login with error parameter
	if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith('your_')) {
		throw redirect(302, '/login?error=google_not_configured');
	}

	// 1. Generate cryptographically secure random state token
	const state = crypto.randomBytes(32).toString('hex');

	// 2. Store state token in an httpOnly, sameSite: 'lax' cookie (valid for 10 minutes)
	cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	// 3. Build Google OAuth 2.0 authorization URL
	const redirectUri = `${url.origin}/auth/google/callback`;
	const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
	authUrl.searchParams.set('redirect_uri', redirectUri);
	authUrl.searchParams.set('response_type', 'code');
	authUrl.searchParams.set('scope', 'openid email profile');
	authUrl.searchParams.set('state', state);
	authUrl.searchParams.set('access_type', 'online');
	authUrl.searchParams.set('prompt', 'select_account');

	// 4. Redirect user to Google consent screen
	throw redirect(302, authUrl.toString());
};
