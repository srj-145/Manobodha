import { fail } from '@sveltejs/kit';
import { dbPool } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import type { RowDataPacket } from 'mysql2';

interface CountRow extends RowDataPacket {
	count: number;
}

interface AvgRow extends RowDataPacket {
	avgVal: number | null;
	count: number;
}

interface UserAdminRow extends RowDataPacket {
	id: string;
	name: string;
	email: string;
	auth_provider: string;
	academic_background: string | null;
	psychology_familiarity: string | null;
	primary_goal: string | null;
	referral_source: string | null;
	is_admin: number;
	created_at: string;
	last_login_at: string | null;
}

interface BreakdownRow extends RowDataPacket {
	label: string | null;
	total: number;
}

interface EventRow extends RowDataPacket {
	id: string;
	user_id: string | null;
	user_name: string | null;
	user_email: string | null;
	theory: string;
	event_type: string;
	metadata: string | null;
	created_at: string;
}

interface SessionRow extends RowDataPacket {
	id: string;
	user_id: string | null;
	user_name: string | null;
	user_email: string | null;
	theory: string;
	started_at: string;
	completed_at: string | null;
	duration_seconds: number | null;
}

interface QuizResultRow extends RowDataPacket {
	id: string;
	user_id: string | null;
	user_name: string | null;
	user_email: string | null;
	theory: string;
	question_id: string;
	answer: string;
	correct: number;
	created_at: string;
}

interface ConfidenceRow extends RowDataPacket {
	id: string;
	user_id: string | null;
	user_name: string | null;
	user_email: string | null;
	theory: string;
	rating: number;
	created_at: string;
}

export const load: PageServerLoad = async () => {
	try {
		// 1. Overall counts
		const [[userStats]] = await dbPool.execute<RowDataPacket[]>(`
			SELECT 
				COUNT(*) AS totalUsers,
				SUM(CASE WHEN auth_provider = 'google' THEN 1 ELSE 0 END) AS googleUsers,
				SUM(CASE WHEN auth_provider = 'local' THEN 1 ELSE 0 END) AS localUsers,
				SUM(CASE WHEN is_admin = 1 THEN 1 ELSE 0 END) AS adminCount
			FROM users;
		`);

		const [[sessionStats]] = await dbPool.execute<RowDataPacket[]>(`
			SELECT 
				COUNT(*) AS totalSessions,
				SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completedSessions
			FROM theory_sessions;
		`);

		const [[quizStats]] = await dbPool.execute<RowDataPacket[]>(`
			SELECT 
				COUNT(*) AS totalQuizzes,
				SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correctQuizzes
			FROM concept_check_results;
		`);

		const [[confidenceStats]] = await dbPool.execute<RowDataPacket[]>(`
			SELECT 
				AVG(rating) AS avgConfidence,
				COUNT(*) AS totalRatings
			FROM confidence_ratings;
		`);

		const [[eventStats]] = await dbPool.execute<RowDataPacket[]>(`
			SELECT COUNT(*) AS totalEvents FROM interaction_events;
		`);

		// 2. Demographic breakdowns
		const [backgroundBreakdown] = await dbPool.execute<BreakdownRow[]>(`
			SELECT 
				COALESCE(academic_background, 'unspecified') AS label,
				COUNT(*) AS total
			FROM users
			GROUP BY academic_background
			ORDER BY total DESC;
		`);

		const [familiarityBreakdown] = await dbPool.execute<BreakdownRow[]>(`
			SELECT 
				COALESCE(psychology_familiarity, 'unspecified') AS label,
				COUNT(*) AS total
			FROM users
			GROUP BY psychology_familiarity
			ORDER BY total DESC;
		`);

		const [goalBreakdown] = await dbPool.execute<BreakdownRow[]>(`
			SELECT 
				COALESCE(primary_goal, 'unspecified') AS label,
				COUNT(*) AS total
			FROM users
			GROUP BY primary_goal
			ORDER BY total DESC;
		`);

		const [eventsByType] = await dbPool.execute<BreakdownRow[]>(`
			SELECT 
				event_type AS label,
				COUNT(*) AS total
			FROM interaction_events
			GROUP BY event_type
			ORDER BY total DESC;
		`);

		// 3. User directory
		const [users] = await dbPool.execute<UserAdminRow[]>(`
			SELECT 
				id, name, email, auth_provider,
				academic_background, psychology_familiarity, primary_goal, referral_source,
				is_admin,
				DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at,
				DATE_FORMAT(last_login_at, '%Y-%m-%d %H:%i') AS last_login_at
			FROM users
			ORDER BY created_at DESC;
		`);

		// 4. Interaction Events (last 100)
		const [recentEvents] = await dbPool.execute<EventRow[]>(`
			SELECT 
				e.id, e.user_id, e.theory, e.event_type, e.metadata,
				DATE_FORMAT(e.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
				u.name AS user_name,
				u.email AS user_email
			FROM interaction_events e
			LEFT JOIN users u ON e.user_id = u.id
			ORDER BY e.created_at DESC
			LIMIT 100;
		`);

		// 5. Theory Sessions (last 50)
		const [recentSessions] = await dbPool.execute<SessionRow[]>(`
			SELECT 
				s.id, s.user_id, s.theory,
				DATE_FORMAT(s.started_at, '%Y-%m-%d %H:%i:%s') AS started_at,
				DATE_FORMAT(s.completed_at, '%Y-%m-%d %H:%i:%s') AS completed_at,
				TIMESTAMPDIFF(SECOND, s.started_at, s.completed_at) AS duration_seconds,
				u.name AS user_name,
				u.email AS user_email
			FROM theory_sessions s
			LEFT JOIN users u ON s.user_id = u.id
			ORDER BY s.started_at DESC
			LIMIT 50;
		`);

		// 6. Concept Checks (last 50)
		const [recentQuizzes] = await dbPool.execute<QuizResultRow[]>(`
			SELECT 
				q.id, q.user_id, q.theory, q.question_id, q.answer, q.correct,
				DATE_FORMAT(q.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
				u.name AS user_name,
				u.email AS user_email
			FROM concept_check_results q
			LEFT JOIN users u ON q.user_id = u.id
			ORDER BY q.created_at DESC
			LIMIT 50;
		`);

		// 7. Confidence ratings (last 50)
		const [recentRatings] = await dbPool.execute<ConfidenceRow[]>(`
			SELECT 
				c.id, c.user_id, c.theory, c.rating,
				DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
				u.name AS user_name,
				u.email AS user_email
			FROM confidence_ratings c
			LEFT JOIN users u ON c.user_id = u.id
			ORDER BY c.created_at DESC
			LIMIT 50;
		`);

		return {
			summary: {
				totalUsers: Number(userStats?.totalUsers || 0),
				googleUsers: Number(userStats?.googleUsers || 0),
				localUsers: Number(userStats?.localUsers || 0),
				adminCount: Number(userStats?.adminCount || 0),
				totalSessions: Number(sessionStats?.totalSessions || 0),
				completedSessions: Number(sessionStats?.completedSessions || 0),
				completionRate: sessionStats?.totalSessions
					? Math.round((Number(sessionStats.completedSessions) / Number(sessionStats.totalSessions)) * 100)
					: 0,
				totalQuizzes: Number(quizStats?.totalQuizzes || 0),
				correctQuizzes: Number(quizStats?.correctQuizzes || 0),
				quizAccuracy: quizStats?.totalQuizzes
					? Math.round((Number(quizStats.correctQuizzes) / Number(quizStats.totalQuizzes)) * 100)
					: 0,
				avgConfidence: confidenceStats?.avgConfidence
					? Number(Number(confidenceStats.avgConfidence).toFixed(1))
					: null,
				totalRatings: Number(confidenceStats?.totalRatings || 0),
				totalEvents: Number(eventStats?.totalEvents || 0)
			},
			breakdowns: {
				background: backgroundBreakdown,
				familiarity: familiarityBreakdown,
				goal: goalBreakdown,
				events: eventsByType
			},
			users,
			recentEvents,
			recentSessions,
			recentQuizzes,
			recentRatings
		};
	} catch (err) {
		console.error('[admin/page.server] DB query failed:', err);
		return {
			summary: {
				totalUsers: 0,
				googleUsers: 0,
				localUsers: 0,
				adminCount: 0,
				totalSessions: 0,
				completedSessions: 0,
				completionRate: 0,
				totalQuizzes: 0,
				correctQuizzes: 0,
				quizAccuracy: 0,
				avgConfidence: null,
				totalRatings: 0,
				totalEvents: 0
			},
			breakdowns: { background: [], familiarity: [], goal: [], events: [] },
			users: [],
			recentEvents: [],
			recentSessions: [],
			recentQuizzes: [],
			recentRatings: []
		};
	}
};

export const actions: Actions = {
	toggleAdmin: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const targetUserId = data.get('userId') as string;
		const makeAdmin = data.get('makeAdmin') === '1';

		if (!targetUserId) {
			return fail(400, { message: 'User ID is required' });
		}

		// Don't allow an admin to demote themselves
		if (targetUserId === locals.user.id && !makeAdmin) {
			return fail(400, { message: 'You cannot remove your own administrator status.' });
		}

		try {
			await dbPool.execute(
				`UPDATE users SET is_admin = ? WHERE id = ?`,
				[makeAdmin ? 1 : 0, targetUserId]
			);
			return {
				success: true,
				message: makeAdmin ? 'User granted administrator access.' : 'Administrator access revoked.'
			};
		} catch (err) {
			console.error('[admin/toggleAdmin] error:', err);
			return fail(500, { message: 'Failed to update administrator status.' });
		}
	},

	grantAdminByEmail: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const email = (data.get('email') as string | null)?.trim().toLowerCase();

		if (!email) {
			return fail(400, { message: 'Email address is required.' });
		}

		try {
			const [result] = await dbPool.execute<RowDataPacket[]>(
				`SELECT id, name FROM users WHERE email = ? LIMIT 1`,
				[email]
			);

			if (result.length === 0) {
				return fail(404, {
					message: `No registered account found with email "${email}". Ask your co-creator to register first, or add their email to ADMIN_EMAILS in the .env file.`
				});
			}

			await dbPool.execute(`UPDATE users SET is_admin = 1 WHERE email = ?`, [email]);
			return {
				success: true,
				message: `Granted admin privileges to ${result[0].name} (${email}).`
			};
		} catch (err) {
			console.error('[admin/grantAdminByEmail] error:', err);
			return fail(500, { message: 'Failed to grant admin privileges.' });
		}
	}
};
