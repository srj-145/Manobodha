import { env } from '$env/dynamic/private';

export function getAdminEmails(): string[] {
	return (env.ADMIN_EMAILS || process.env.ADMIN_EMAILS || '')
		.split(',')
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean);
}

export function isUserAdmin(email: string, dbAdmin?: number | boolean): boolean {
	if (Boolean(dbAdmin)) return true;
	return getAdminEmails().includes(email.trim().toLowerCase());
}
