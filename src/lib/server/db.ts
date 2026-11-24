import mysql from 'mysql2/promise';

export const dbPool = mysql.createPool({
	host: process.env.MYSQL_HOST || 'localhost',
	port: Number(process.env.MYSQL_PORT) || 3306,
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || '',
	database: process.env.MYSQL_DATABASE || 'manobodha_db',
	ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
	waitForConnections: true,
	connectionLimit: 10
});