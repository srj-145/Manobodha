import { error } from '@sveltejs/kit';
import { dbPool } from '$lib/server/db';
import type { RequestHandler } from './$types';
import type { RowDataPacket } from 'mysql2';

function toCsv(rows: Record<string, unknown>[]): string {
	if (rows.length === 0) return '';
	const headers = Object.keys(rows[0]);
	const escape = (val: unknown) => {
		if (val === null || val === undefined) return '';
		const str = String(val).replace(/"/g, '""');
		return `"${str}"`;
	};
	const csvLines = [headers.join(',')];
	for (const row of rows) {
		csvLines.push(headers.map((h) => escape(row[h])).join(','));
	}
	return csvLines.join('\r\n');
}

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user?.isAdmin) {
		throw error(403, 'Unauthorized. Admin access required.');
	}

	const type = url.searchParams.get('type') || 'users';

	let query = '';
	let filename = `manobodha_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

	switch (type) {
		case 'users':
			query = `
				SELECT 
					id, name, email, auth_provider, academic_background,
					psychology_familiarity, primary_goal, referral_source, is_admin,
					created_at, last_login_at
				FROM users
				ORDER BY created_at DESC;
			`;
			break;
		case 'events':
			query = `
				SELECT 
					e.id, e.user_id, u.name AS user_name, u.email AS user_email,
					e.theory, e.event_type, e.metadata, e.created_at
				FROM interaction_events e
				LEFT JOIN users u ON e.user_id = u.id
				ORDER BY e.created_at DESC;
			`;
			break;
		case 'sessions':
			query = `
				SELECT 
					s.id, s.user_id, u.name AS user_name, u.email AS user_email,
					s.theory, s.started_at, s.completed_at,
					TIMESTAMPDIFF(SECOND, s.started_at, s.completed_at) AS duration_seconds
				FROM theory_sessions s
				LEFT JOIN users u ON s.user_id = u.id
				ORDER BY s.started_at DESC;
			`;
			break;
		case 'quizzes':
			query = `
				SELECT 
					q.id, q.user_id, u.name AS user_name, u.email AS user_email,
					q.theory, q.session_id, q.question_id, q.answer, q.correct, q.created_at
				FROM concept_check_results q
				LEFT JOIN users u ON q.user_id = u.id
				ORDER BY q.created_at DESC;
			`;
			break;
		case 'ratings':
			query = `
				SELECT 
					c.id, c.user_id, u.name AS user_name, u.email AS user_email,
					c.theory, c.session_id, c.rating, c.created_at
				FROM confidence_ratings c
				LEFT JOIN users u ON c.user_id = u.id
				ORDER BY c.created_at DESC;
			`;
			break;
		default:
			throw error(400, 'Invalid export type.');
	}

	const [rows] = await dbPool.execute<RowDataPacket[]>(query);
	const csv = toCsv(rows as Record<string, unknown>[]);

	return new Response(csv, {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
