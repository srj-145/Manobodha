import { Google } from 'arctic';
import { env } from '$env/dynamic/private';
import fs from 'node:fs';
import path from 'node:path';

function readEnvFallback(key: string): string {
	try {
		const envPath = path.resolve(process.cwd(), '.env');
		if (fs.existsSync(envPath)) {
			const text = fs.readFileSync(envPath, 'utf8');
			for (const line of text.split('\n')) {
				const trimmed = line.trim();
				if (trimmed && !trimmed.startsWith('#') && trimmed.startsWith(key + '=')) {
					return trimmed.slice(key.length + 1).trim();
				}
			}
		}
	} catch {
		// ignore
	}
	return '';
}

export function getGoogleConfig(requestOrigin?: string) {
	const clientId =
		env.GOOGLE_CLIENT_ID ||
		process.env.GOOGLE_CLIENT_ID ||
		readEnvFallback('GOOGLE_CLIENT_ID') ||
		'';

	const clientSecret =
		env.GOOGLE_CLIENT_SECRET ||
		process.env.GOOGLE_CLIENT_SECRET ||
		readEnvFallback('GOOGLE_CLIENT_SECRET') ||
		'';

	const origin =
		requestOrigin ||
		env.ORIGIN ||
		process.env.ORIGIN ||
		readEnvFallback('ORIGIN') ||
		'http://localhost:5173';

	const redirectUri = `${origin.replace(/\/$/, '')}/auth/google/callback`;

	const isConfigured = Boolean(
		clientId &&
			clientSecret &&
			!clientId.startsWith('your_') &&
			!clientSecret.startsWith('your_')
	);

	return {
		clientId,
		clientSecret,
		redirectUri,
		isConfigured
	};
}

export function getGoogleAuth(requestOrigin?: string) {
	const { clientId, clientSecret, redirectUri } = getGoogleConfig(requestOrigin);
	return new Google(clientId, clientSecret, redirectUri);
}

export const googleAuth = getGoogleAuth();

export function getAdminEmails(): string[] {
	const raw =
		env.ADMIN_EMAILS ||
		process.env.ADMIN_EMAILS ||
		readEnvFallback('ADMIN_EMAILS') ||
		'suriti.23bet10005@vitbhopal.ac.in';

	return raw
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
}

export function isUserAdmin(email: string, dbAdmin?: number | boolean): boolean {
	if (Boolean(dbAdmin)) return true;
	const admins = getAdminEmails();
	return admins.includes(email.trim().toLowerCase());
}
