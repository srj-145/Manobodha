import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	if (!locals.user.isAdmin) {
		throw error(403, {
			message: 'Access restricted. Administrator privileges are required to view this research console.'
		});
	}

	return {
		user: locals.user
	};
};
