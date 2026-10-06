/** Single place for site-wide info used by the footer, SEO tags, sitemap and legal pages. */
export const site = {
	name: 'Manobodha',
	tagline: 'Understand theories. Don’t just memorize them.',
	description:
		'Manobodha turns psychology theories into interactive sandboxes. Change the parameters, watch what happens, then test what you learned.',
	/** Set this to show a "Contact" link in the footer and on the About page, e.g. 'hello@yourdomain.com'. */
	contactEmail: ''
};

/** Every public page. Used by the sitemap. */
export const publicPaths = [
	'/',
	'/explore',
	'/sandbox/operant-conditioning',
	'/sandbox/ebbinghaus-curve',
	'/map',
	'/compare',
	'/quiz',
	'/about',
	'/privacy'
];
