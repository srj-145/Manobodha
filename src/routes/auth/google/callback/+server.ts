import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { dbPool } from '$lib/server/db';
import { isUserAdmin } from '$lib/server/auth';
import type { RequestHandler } from './$types';
import type { RowDataPacket } from 'mysql2';
import crypto from 'node:crypto';

interface UserRow extends RowDataPacket {
	id: string;
	email: string;
	name: string;
	is_admin: number;
	google_id: string | null;
	auth_provider: string;
}

interface GoogleTokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	id_token?: string;
}

interface GoogleUserInfo {
	id: string;
	email: string;
	verified_email?: boolean;
	name: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const oauthError = url.searchParams.get('error');

	// Always clear the temporary OAuth state cookie
	const storedState = cookies.get('google_oauth_state');
	cookies.delete('google_oauth_state', { path: '/' });

	// Handle OAuth rejection or cancellation
	if (oauthError) {
		if (oauthError === 'access_denied') {
			throw redirect(302, '/login?error=google_cancelled');
		}
		throw redirect(302, '/login?error=google_failed');
	}

	// Validate state parameter to protect against CSRF attacks
	if (!state || !storedState || state !== storedState) {
		throw redirect(302, '/login?error=invalid_oauth_state');
	}

	if (!code) {
		throw redirect(302, '/login?error=google_failed');
	}

	// 1. Exchange authorization code for access token
	const redirectUri = `${url.origin}/auth/google/callback`;
	let tokenData: GoogleTokenResponse;

	try {
		const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				code,
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code'
			})
		});

		if (!tokenResponse.ok) {
			const errBody = await tokenResponse.text();
			console.error('[Google OAuth] Token exchange error:', errBody);
			throw redirect(302, '/login?error=google_failed');
		}

		tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
	} catch (err) {
		if (err instanceof Response || (typeof err === 'object' && err !== null && 'status' in err)) {
			throw err;
		}
		console.error('[Google OAuth] Failed to request token:', err);
		throw redirect(302, '/login?error=google_failed');
	}

	// 2. Fetch user profile with openid, email, and profile info
	let googleUser: GoogleUserInfo;

	try {
		const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			}
		});

		if (!userInfoResponse.ok) {
			const errBody = await userInfoResponse.text();
			console.error('[Google OAuth] UserInfo request error:', errBody);
			throw redirect(302, '/login?error=google_failed');
		}

		googleUser = (await userInfoResponse.json()) as GoogleUserInfo;
	} catch (err) {
		if (err instanceof Response || (typeof err === 'object' && err !== null && 'status' in err)) {
			throw err;
		}
		console.error('[Google OAuth] Failed to fetch user info:', err);
		throw redirect(302, '/login?error=google_failed');
	}

	if (!googleUser.id || !googleUser.email) {
		console.error('[Google OAuth] Missing id or email in user profile');
		throw redirect(302, '/login?error=google_failed');
	}

	const normalizedEmail = googleUser.email.trim().toLowerCase();
	const displayName = googleUser.name || googleUser.given_name || normalizedEmail.split('@')[0];

	// 3. Database operations: link or create user
	let userId: string;

	try {
		// Look up existing user by Google ID or email
		const [existingUsers] = await dbPool.execute<UserRow[]>(
			`SELECT id, email, name, is_admin, google_id, auth_provider
			 FROM users
			 WHERE google_id = ? OR email = ?
			 LIMIT 1`,
			[googleUser.id, normalizedEmail]
		);

		if (existingUsers.length > 0) {
			// Existing user found
			const existingUser = existingUsers[0];
			userId = existingUser.id;

			// Update Google ID and login timestamp if not yet set
			await dbPool.execute(
				`UPDATE users
				 SET google_id = COALESCE(google_id, ?),
				     last_login_at = NOW()
				 WHERE id = ?`,
				[googleUser.id, userId]
			);

			// Ensure entry in oauth_accounts table
			await dbPool.execute(
				`INSERT INTO oauth_accounts (provider_id, provider_user_id, user_id)
				 VALUES ('google', ?, ?)
				 ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`,
				[googleUser.id, userId]
			);
		} else {
			// New user registration via Google OAuth
			userId = crypto.randomUUID();
			const isAdmin = isUserAdmin(normalizedEmail) ? 1 : 0;

			const conn = await dbPool.getConnection();
			try {
				await conn.beginTransaction();

				// Insert core user record
				await conn.execute(
					`INSERT INTO users (
						id, name, email, auth_provider, google_id,
						data_consent, is_admin, last_login_at
					) VALUES (?, ?, ?, 'google', ?, 1, ?, NOW())`,
					[userId, displayName, normalizedEmail, googleUser.id, isAdmin]
				);

				// Insert oauth account mapping
				await conn.execute(
					`INSERT INTO oauth_accounts (provider_id, provider_user_id, user_id)
					 VALUES ('google', ?, ?)`,
					[googleUser.id, userId]
				);

				// Insert default profile row for compatibility with hooks / profile
				await conn.execute(
					`INSERT INTO user_profiles (user_id, user_type)
					 VALUES (?, 'other')`,
					[userId]
				);

				await conn.commit();
			} catch (dbErr) {
				await conn.rollback();
				throw dbErr;
			} finally {
				conn.release();
			}
		}

		// 4. Create new user session
		const sessionToken = crypto.randomBytes(32).toString('hex');
		const sessionId = crypto.randomUUID();
		const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
		const expiresAt = new Date(Date.now() + sessionMaxAge * 1000);

		await dbPool.execute(
			`INSERT INTO sessions (id, user_id, session_token, expires_at)
			 VALUES (?, ?, ?, ?)`,
			[sessionId, userId, sessionToken, expiresAt]
		);

		// 5. Set session cookie matching project standard
		cookies.set('session', sessionToken, {
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			maxAge: sessionMaxAge,
			sameSite: 'lax'
		});
	} catch (err) {
		console.error('[Google OAuth] Database or session creation error:', err);
		throw redirect(302, '/login?error=google_failed');
	}

	// 6. Redirect back into the app
	throw redirect(302, '/');
};
