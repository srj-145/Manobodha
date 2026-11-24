
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Read .env
const env = {};
const envContent = fs.readFileSync('.env', 'utf8');
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [k, ...v] = trimmed.split('=');
    env[k.trim()] = v.join('=').trim();
  }
}

const pool = mysql.createPool({
  host: env.MYSQL_HOST || 'localhost',
  port: Number(env.MYSQL_PORT) || 3306,
  user: env.MYSQL_USER || 'root',
  password: env.MYSQL_PASSWORD || '',
  database: env.MYSQL_DATABASE || 'manobodha_db'
});

async function run() {
  console.log('\n=== TESTING ADMIN & T&C SYSTEM ===');
  let passed = 0;

  // 1. Check existing creator admin status
  const [creators] = await pool.execute(
    'SELECT email, is_admin FROM users WHERE email = ?',
    ['suriti.23bet10005@vitbhopal.ac.in']
  );
  if (creators.length > 0 && creators[0].is_admin === 1) {
    console.log('  ✓ Suriti Joshi is verified as admin (is_admin = 1)');
    passed++;
  } else {
    console.error('  ✗ Creator admin flag check failed');
  }

  // 2. Check admin emails configuration
  const adminEmails = (env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  if (adminEmails.includes('suriti.23bet10005@vitbhopal.ac.in') && adminEmails.length >= 2) {
    console.log(`  ✓ ADMIN_EMAILS configured with ${adminEmails.length} creators (${adminEmails.join(', ')})`);
    passed++;
  } else {
    console.error('  ✗ ADMIN_EMAILS check failed');
  }

  // 3. Test creating a mock learner and promoting to admin
  const testLearnerId = crypto.randomUUID();
  const testEmail = `test_partner_${Date.now()}@vitbhopal.ac.in`;
  await pool.execute(
    `INSERT INTO users (id, name, email, auth_provider, academic_background, psychology_familiarity, primary_goal, data_consent, is_admin)
     VALUES (?, ?, ?, 'local', 'psych_year1', 'beginner', 'studying_psych', 1, 0)`,
    [testLearnerId, 'Co-Creator Test', testEmail]
  );
  console.log('  ✓ Created test account with is_admin = 0');
  passed++;

  // 4. Promote to admin
  await pool.execute('UPDATE users SET is_admin = 1 WHERE id = ?', [testLearnerId]);
  const [promoted] = await pool.execute('SELECT is_admin FROM users WHERE id = ?', [testLearnerId]);
  if (promoted[0].is_admin === 1) {
    console.log('  ✓ Successfully promoted partner account to admin');
    passed++;
  } else {
    console.error('  ✗ Promotion failed');
  }

  // 5. Test metrics calculation
  const [[metrics]] = await pool.execute(`
    SELECT 
      COUNT(*) AS totalUsers,
      SUM(CASE WHEN is_admin = 1 THEN 1 ELSE 0 END) AS adminCount
    FROM users;
  `);
  if (metrics.totalUsers > 0 && metrics.adminCount >= 2) {
    console.log(`  ✓ Admin metrics verified: ${metrics.totalUsers} users, ${metrics.adminCount} admins`);
    passed++;
  } else {
    console.error('  ✗ Metrics query failed');
  }

  // Clean up test account
  await pool.execute('DELETE FROM users WHERE id = ?', [testLearnerId]);
  console.log('  ✓ Cleaned up test partner account');
  passed++;

  console.log(`\n==========================================`);
  console.log(`ADMIN TESTS: ${passed}/6 passed.`);
  console.log(`==========================================\n`);
  await pool.end();
}

run().catch(err => {
  console.error('Admin test error:', err);
  process.exit(1);
});
