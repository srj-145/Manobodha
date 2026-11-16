import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env
const envPath = path.join(__dirname, '.env');
const env = {};
if (fs.existsSync(envPath)) {
	const content = fs.readFileSync(envPath, 'utf8');
	for (const line of content.split('\n')) {
		const trimmed = line.trim();
		if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
			const [k, ...v] = trimmed.split('=');
			env[k.trim()] = v.join('=').trim();
		}
	}
}

const pool = mysql.createPool({
	host: env.MYSQL_HOST || 'localhost',
	port: Number(env.MYSQL_PORT) || 3306,
	user: env.MYSQL_USER || 'root',
	password: env.MYSQL_PASSWORD || '',
	database: env.MYSQL_DATABASE || 'manobodha_db'
});

try {
	console.log('\n======================================================');
	console.log('       MANOBODHA REGISTERED USERS & AUDIENCE DATA      ');
	console.log('======================================================\n');

	const [users] = await pool.execute(`
		SELECT 
			name,
			email,
			auth_provider AS provider,
			COALESCE(academic_background, '—') AS background,
			COALESCE(psychology_familiarity, '—') AS familiarity,
			COALESCE(primary_goal, '—') AS goal,
			DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS registered,
			DATE_FORMAT(last_login_at, '%Y-%m-%d %H:%i') AS last_login
		FROM users
		ORDER BY created_at DESC;
	`);

	if (users.length === 0) {
		console.log('No registered users found yet.');
	} else {
		console.log(`Total users registered: ${users.length}\n`);
		console.table(users);
	}

	// Also display evaluation stats summary
	const [[sessionsCount]] = await pool.execute('SELECT COUNT(*) AS total FROM theory_sessions;');
	const [[quizzesCount]] = await pool.execute('SELECT COUNT(*) AS total FROM concept_check_results;');
	const [[ratingsCount]] = await pool.execute('SELECT COUNT(*) AS total FROM confidence_ratings;');

	console.log('\n--- EVALUATION SUMMARY ---');
	console.log(`• Theory Sessions Started: ${sessionsCount.total}`);
	console.log(`• Concept Check Answers Logged: ${quizzesCount.total}`);
	console.log(`• Confidence Ratings Submitted: ${ratingsCount.total}`);
	console.log('======================================================\n');
} catch (err) {
	console.error('Error fetching registered users from MySQL:', err.message);
} finally {
	await pool.end();
}

