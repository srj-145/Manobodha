import { fail, redirect } from '@sveltejs/kit';
import { dbPool } from '$lib/server/db';
import bcrypt from 'bcryptjs';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { isUserAdmin } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import type { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
	id: string;
}

// Already logged in → go home
export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const data = await request.formData();

		// --- Basic account fields ---
		const name = (data.get('name') as string | null)?.trim();
		const email = (data.get('email') as string | null)?.trim().toLowerCase();
		const password = data.get('password') as string | null;
		const confirmPassword = data.get('confirm_password') as string | null;

		// --- Audience fields (stored in users table) ---
		const academicBackground = data.get('academic_background') as string | null;
		const psychologyFamiliarity = data.get('psychology_familiarity') as string | null;
		const primaryGoal = data.get('primary_goal') as string | null;
		const referralSource = (data.get('referral_source') as string | null) || null;
		const termsAgreed = data.get('terms_agreed') === 'on' || data.get('data_consent') === 'on';

		// --- Validation ---
		if (!name || name.length < 2) {
			return fail(400, {
				field: 'name',
				message: 'Please enter your name (at least 2 characters).'
			});
		}
		if (name.length > 255) {
			return fail(400, { field: 'name', message: 'Name is too long.' });
		}

		const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRe.test(email)) {
			return fail(400, { field: 'email', message: 'Please enter a valid email address.' });
		}

		if (!password || password.length < 8) {
			return fail(400, {
				field: 'password',
				message: 'Password must be at least 8 characters long.'
			});
		}
		if (password.length > 128) {
			return fail(400, {
				field: 'password',
				message: 'Password is too long (max 128 characters).'
			});
		}
		if (password !== confirmPassword) {
			return fail(400, { field: 'confirm_password', message: 'Passwords do not match.' });
		}

		if (!academicBackground) {
			return fail(400, {
				field: 'academic_background',
				message: 'Please select your background.'
			});
		}
		if (!psychologyFamiliarity) {
			return fail(400, {
				field: 'psychology_familiarity',
				message: 'Please select your familiarity level.'
			});
		}
		if (!primaryGoal) {
			return fail(400, { field: 'primary_goal', message: 'Please select your primary goal.' });
		}
		if (!termsAgreed) {
			return fail(400, {
				field: 'terms_agreed',
				message: 'Please agree to the Terms & Conditions to create an account.'
			});
		}

		// --- Check duplicate email ---
		const [existing] = await dbPool.execute<UserRow[]>(
			`SELECT id FROM users WHERE email = ? LIMIT 1`,
			[email]
		);
		if (existing.length > 0) {
			return fail(409, {
				field: 'email',
				message: 'An account with this email already exists. Try signing in instead.'
			});
		}

		// --- Hash password ---
		const passwordHash = await bcrypt.hash(password, 12);
		const isAdminUser = isUserAdmin(email) ? 1 : 0;

		// --- Insert user in a transaction ---
		const conn = await dbPool.getConnection();
		let userId = '';
		try {
			await conn.beginTransaction();

			userId = crypto.randomUUID();
			await conn.execute(
				`INSERT INTO users 
				  (id, name, email, password_hash, auth_provider,
				   academic_background, psychology_familiarity, primary_goal,
				   referral_source, data_consent, is_admin)
				 VALUES (?, ?, ?, ?, 'local', ?, ?, ?, ?, 1, ?)`,
				[
					userId,
					name,
					email,
					passwordHash,
					academicBackground,
					psychologyFamiliarity,
					primaryGoal,
					referralSource,
					isAdminUser
				]
			);

			// Also insert a user_profile row for compatibility
			const userType = mapBackgroundToUserType(academicBackground);
			await conn.execute(
				`INSERT INTO user_profiles 
				  (user_id, user_type, referral_source)
				 VALUES (?, ?, ?)`,
				[userId, userType, referralSource]
			);

			await conn.commit();
		} catch (err) {
			await conn.rollback();
			console.error('[register] DB error:', err);
			return fail(500, {
				field: 'general',
				message: 'Something went wrong. Please try again in a moment.'
			});
		} finally {
			conn.release();
		}

		// --- Create session ---
		const sessionToken = encodeHexLowerCase(
			sha256(new TextEncoder().encode(crypto.randomUUID()))
		);
		const sessionId = crypto.randomUUID();
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

		await dbPool.execute(
			`INSERT INTO sessions (id, user_id, session_token, expires_at) VALUES (?, ?, ?, ?)`,
			[sessionId, userId, sessionToken, expiresAt]
		);

		cookies.set('session', sessionToken, {
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax'
		});

		throw redirect(302, '/');
	}
};

function mapBackgroundToUserType(
	bg: string
): 'school_student' | 'college_student' | 'working_professional' | 'enthusiast' | 'other' {
	if (bg === 'psych_year1' || bg === 'psych_year2' || bg === 'psych_year3plus' || bg === 'other_student')
		return 'college_student';
	if (bg === 'enthusiast') return 'enthusiast';
	if (bg === 'educator') return 'working_professional';
	return 'other';
}
