import { fail, redirect } from '@sveltejs/kit';
import { dbPool } from '$lib/server/db';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';
import type { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
	name: string;
	email: string;
	created_at: string;
	password_hash: string | null;
	auth_provider: string;
	academic_background: string | null;
	psychology_familiarity: string | null;
	primary_goal: string | null;
	referral_source: string | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const [userRows] = await dbPool.execute<UserRow[]>(
		`SELECT name, email, created_at, password_hash, auth_provider,
		        academic_background, psychology_familiarity, primary_goal, referral_source
		 FROM users WHERE id = ? LIMIT 1`,
		[locals.user.id]
	);

	if (userRows.length === 0) {
		throw redirect(302, '/login');
	}

	const u = userRows[0];
	const hasProfile = Boolean(u.academic_background && u.psychology_familiarity && u.primary_goal);

	return {
		user: {
			name: u.name,
			email: u.email,
			createdAt: u.created_at,
			authProvider: u.auth_provider,
			hasPassword: Boolean(u.password_hash)
		},
		profile: hasProfile
			? {
					academicBackground: u.academic_background,
					psychologyFamiliarity: u.psychology_familiarity,
					primaryGoal: u.primary_goal,
					referralSource: u.referral_source
				}
			: null
	};
};

function mapBackgroundToUserType(
	bg: string
): 'school_student' | 'college_student' | 'working_professional' | 'enthusiast' | 'other' {
	if (bg === 'psych_year1' || bg === 'psych_year2' || bg === 'psych_year3plus' || bg === 'other_student') {
		return 'college_student';
	}
	if (bg === 'enthusiast') return 'enthusiast';
	if (bg === 'educator') return 'working_professional';
	return 'other';
}

export const actions: Actions = {
	// Save / update audience background
	saveProfile: async ({ request, locals, url }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const academicBackground = data.get('academic_background') as string | null;
		const psychologyFamiliarity = data.get('psychology_familiarity') as string | null;
		const primaryGoal = data.get('primary_goal') as string | null;
		const referralSource = (data.get('referral_source') as string | null) || null;
		const termsAgreed = data.get('terms_agreed') === 'on' || data.get('data_consent') === 'on' ? 1 : 0;
		const isInitialOnboarding = data.get('is_onboarding') === 'true';

		if (!academicBackground) {
			return fail(400, {
				action: 'saveProfile',
				field: 'academic_background',
				message: 'Please select your academic background.'
			});
		}
		if (!psychologyFamiliarity) {
			return fail(400, {
				action: 'saveProfile',
				field: 'psychology_familiarity',
				message: 'Please select your familiarity with psychology.'
			});
		}
		if (!primaryGoal) {
			return fail(400, {
				action: 'saveProfile',
				field: 'primary_goal',
				message: 'Please select your primary reason for using Manobodha.'
			});
		}

		if (isInitialOnboarding && !dataConsent) {
			return fail(400, {
				action: 'saveProfile',
				field: 'data_consent',
				message: 'Please acknowledge the data-use statement to continue.'
			});
		}

		try {
			await dbPool.execute(
				`UPDATE users SET 
				   academic_background = ?,
				   psychology_familiarity = ?,
				   primary_goal = ?,
				   referral_source = ?,
				   data_consent = GREATEST(data_consent, ?)
				 WHERE id = ?`,
				[
					academicBackground,
					psychologyFamiliarity,
					primaryGoal,
					referralSource,
					termsAgreed,
					locals.user.id
				]
			);

			// Also update user_profiles for backwards compatibility
			const userType = mapBackgroundToUserType(academicBackground);
			await dbPool.execute(
				`INSERT INTO user_profiles (user_id, user_type, referral_source)
				 VALUES (?, ?, ?)
				 ON DUPLICATE KEY UPDATE user_type = VALUES(user_type), referral_source = VALUES(referral_source)`,
				[locals.user.id, userType, referralSource]
			);
		} catch (err) {
			console.error('[profile/saveProfile]', err);
			return fail(500, {
				action: 'saveProfile',
				field: 'general',
				message: 'Failed to save profile. Please try again.'
			});
		}

		if (isInitialOnboarding) {
			throw redirect(302, '/');
		}

		return { action: 'saveProfile', success: true, message: 'Profile updated successfully.' };
	},

	// Update display name
	updateName: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const name = (data.get('name') as string | null)?.trim();

		if (!name || name.length < 2) {
			return fail(400, {
				action: 'updateName',
				field: 'name',
				message: 'Display name must be at least 2 characters.'
			});
		}
		if (name.length > 255) {
			return fail(400, { action: 'updateName', field: 'name', message: 'Name is too long.' });
		}

		await dbPool.execute(`UPDATE users SET name = ? WHERE id = ?`, [name, locals.user.id]);

		return { action: 'updateName', success: true, message: 'Name updated successfully.' };
	},

	// Change password
	changePassword: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const currentPassword = data.get('current_password') as string | null;
		const newPassword = data.get('new_password') as string | null;
		const confirmNewPassword = data.get('confirm_new_password') as string | null;

		if (!currentPassword || !newPassword || !confirmNewPassword) {
			return fail(400, {
				action: 'changePassword',
				field: 'general',
				message: 'All password fields are required.'
			});
		}

		if (newPassword.length < 8) {
			return fail(400, {
				action: 'changePassword',
				field: 'new_password',
				message: 'New password must be at least 8 characters.'
			});
		}

		if (newPassword !== confirmNewPassword) {
			return fail(400, {
				action: 'changePassword',
				field: 'confirm_new_password',
				message: 'New passwords do not match.'
			});
		}

		const [rows] = await dbPool.execute<RowDataPacket[]>(
			`SELECT password_hash FROM users WHERE id = ? LIMIT 1`,
			[locals.user.id]
		);

		if (!rows[0]?.password_hash) {
			return fail(400, {
				action: 'changePassword',
				field: 'general',
				message: 'This account uses Google login — no password is set.'
			});
		}

		const valid = await bcrypt.compare(currentPassword, rows[0].password_hash as string);
		if (!valid) {
			return fail(401, {
				action: 'changePassword',
				field: 'current_password',
				message: 'Current password is incorrect.'
			});
		}

		const newHash = await bcrypt.hash(newPassword, 12);
		await dbPool.execute(`UPDATE users SET password_hash = ? WHERE id = ?`, [
			newHash,
			locals.user.id
		]);

		return { action: 'changePassword', success: true, message: 'Password changed successfully.' };
	}
};
