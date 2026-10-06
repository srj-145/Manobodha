import type { RequestHandler } from './$types';
import { publicPaths } from '$lib/config';

export const GET: RequestHandler = ({ url }) => {
	const urls = publicPaths.map((p) => `\t<url><loc>${url.origin}${p}</loc></url>`).join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' } });
};
