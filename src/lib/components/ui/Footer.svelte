<script lang="ts">
	import { resolveRoute } from '$app/paths';
	import { site } from '$lib/config';

	const year = new Date().getFullYear();
	const cols = [
		{
			title: 'Explore',
			links: [
				{ label: 'Sandboxes & theories', href: '/explore' },
				{ label: 'Theory map', href: '/map' },
				{ label: 'Comparison', href: '/compare' },
				{ label: 'Quiz', href: '/quiz' }
			]
		},
		{
			title: 'Sandboxes',
			links: [
				{ label: 'Operant conditioning', href: '/sandbox/operant-conditioning' },
				{ label: 'Forgetting curve', href: '/sandbox/ebbinghaus-curve' }
			]
		},
		{
			title: 'About',
			links: [
				{ label: 'About Manobodha', href: '/about' },
				{ label: 'Privacy', href: '/privacy' }
			]
		}
	];
</script>

<footer>
	<div class="in">
		<div class="top">
			<div class="brand">
				<a href={resolveRoute('/')} class="name">{site.name}</a>
				<p>{site.tagline}</p>
				{#if site.contactEmail}<a class="mail" href="mailto:{site.contactEmail}">{site.contactEmail}</a>{/if}
			</div>
			<nav class="cols" aria-label="Footer">
				{#each cols as c (c.title)}
					<div>
						<h2>{c.title}</h2>
						<ul>
							{#each c.links as l (l.href)}<li><a href={resolveRoute(l.href)}>{l.label}</a></li>{/each}
						</ul>
					</div>
				{/each}
			</nav>
		</div>
		<div class="bottom">
			<span>© {year} {site.name}. Built for curious minds.</span>
			<a href="#top-of-page" onclick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a>
		</div>
	</div>
</footer>

<style>
	footer {
		margin-top: 96px;
		border-top: 1px solid var(--line, #d8d4ca);
		background: var(--pap, #eeeae0);
		color: var(--ink, #172238);
		font-family: 'DM Sans', system-ui, sans-serif;
	}
	.in {
		max-width: var(--page-max, 1160px);
		margin: 0 auto;
		padding: 56px var(--page-pad, 28px) 28px;
	}
	.top {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 2fr);
		gap: 48px;
	}
	.name {
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.01em;
		color: inherit;
		text-decoration: none;
	}
	.brand p {
		margin: 10px 0 0;
		max-width: 300px;
		font-size: 15px;
		line-height: 1.55;
		color: var(--mut, #596177);
	}
	.mail {
		display: inline-block;
		margin-top: 12px;
		font-size: 14px;
		color: var(--rust, #b44f3b);
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 28px;
	}
	h2 {
		margin: 0 0 14px;
		font-size: 11.5px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--rust, #b44f3b);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 4px;
	}
	ul a {
		display: inline-block;
		padding: 5px 0;
		font-size: 15px;
		color: var(--mut, #596177);
		text-decoration: none;
		transition:
			color 0.2s,
			transform 0.2s;
	}
	ul a:hover {
		color: var(--ink, #172238);
		transform: translateX(3px);
	}
	.bottom {
		margin-top: 44px;
		padding-top: 20px;
		border-top: 1px solid var(--line, #d8d4ca);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		font-size: 13.5px;
		color: var(--mut, #596177);
	}
	.bottom a {
		color: inherit;
		text-decoration: none;
		padding: 8px 0;
	}
	.bottom a:hover {
		color: var(--ink, #172238);
	}
	@media (max-width: 760px) {
		.top {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		.cols {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		footer {
			margin-top: 64px;
		}
	}
</style>
