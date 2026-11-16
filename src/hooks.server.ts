import type { Handle } from '@sveltejs/kit';
import { dbPool } from '$lib/server/db';
import { isUserAdmin } from '$lib/server/auth';
import type { RowDataPacket } from 'mysql2';

interface UserSessionRow extends RowDataPacket {
	id: string;
	email: string;
	name: string;
	is_admin: number;
	user_type: string;
}

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');
	if (!sessionToken) {
		event.locals.user = null;
		return resolve(event);
	}

	try {
		const [rows] = await dbPool.execute<UserSessionRow[]>(
			`SELECT users.id, users.email, users.name, COALESCE(users.is_admin, 0) AS is_admin,
			        COALESCE(user_profiles.user_type, '') AS user_type
			 FROM sessions
			 JOIN users ON sessions.user_id = users.id
			 LEFT JOIN user_profiles ON users.id = user_profiles.user_id
			 WHERE sessions.session_token = ? AND sessions.expires_at > NOW()`,
			[sessionToken]
		);

		if (rows.length > 0) {
			const u = rows[0];
			event.locals.user = {
				id: u.id,
				email: u.email,
				name: u.name,
				user_type: u.user_type,
				isAdmin: isUserAdmin(u.email, u.is_admin)
			};
		} else {
			event.cookies.delete('session', { path: '/' });
			event.locals.user = null;
		}
	} catch (err) {
		console.error('[hooks] session lookup failed:', err);
		event.locals.user = null;
	}

	return resolve(event);
};
