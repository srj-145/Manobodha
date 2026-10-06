<script lang="ts">
	import { page } from '$app/stores';
	import { asset, resolveRoute } from '$app/paths';

	const notFound = $derived($page.status === 404);
</script>

<svelte:head><title>{notFound ? 'Page not found' : 'Something went wrong'} – Manobodha</title></svelte:head>

<main class="err">
	<img src={asset(notFound ? '/mascot/confused.webp' : '/mascot/sad.webp')} alt="" width="740" height="440" />
	<p class="code">{$page.status}</p>
	<h1>{notFound ? 'This page wandered off.' : 'Something went wrong.'}</h1>
	<p class="msg">
		{notFound
			? 'Bodhi looked everywhere, but the page you wanted isn’t here. It may have moved, or the link might be mistyped.'
			: 'An unexpected error occurred. Please try again in a moment.'}
	</p>
	<div class="btns">
		<a class="primary" href={resolveRoute('/')}>← Back home</a>
		<a href={resolveRoute('/explore')}>Explore sandboxes</a>
	</div>
</main>

<style>
	.err {
		min-height: calc(100vh - var(--nav-h, 64px) - 120px);
		display: grid;
		place-content: center;
		justify-items: center;
		text-align: center;
		gap: 10px;
		padding: 48px var(--page-pad, 24px);
		font-family: 'DM Sans', system-ui, sans-serif;
	}
	img {
		width: min(300px, 70vw);
		height: auto;
		animation: sway 3.2s ease-in-out infinite;
	}
	.code {
		margin: 6px 0 0;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: var(--rust, #b44f3b);
	}
	h1 {
		margin: 0;
		font-family: 'Fraunces', Georgia, serif;
		font-style: italic;
		font-weight: 400;
		font-size: clamp(32px, 5vw, 52px);
		line-height: 1.1;
	}
	.msg {
		margin: 0;
		max-width: 460px;
		color: var(--mut, #596177);
	}
	.btns {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 14px;
	}
	.btns a {
		padding: 12px 22px;
		border: 1.5px solid var(--ink, #172238);
		border-radius: 999px;
		color: var(--ink, #172238);
		text-decoration: none;
		font-weight: 600;
		font-size: 15px;
		transition: transform 0.15s;
	}
	.btns a:hover {
		transform: translateY(-2px);
	}
	.btns .primary {
		background: var(--ink, #172238);
		color: var(--bg, #f7f4ee);
	}
	@keyframes sway {
		50% {
			transform: rotate(-3deg) translateY(-6px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		img {
			animation: none;
		}
	}
</style>
