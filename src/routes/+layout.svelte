<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import Companion from '$lib/components/Companion.svelte';
	import { site } from '$lib/config';
	import BackButton from '$lib/components/ui/BackButton.svelte';
	import { nav } from '$lib/utils/nav.svelte';
	import { afterNavigate } from '$app/navigation';
	import { page, navigating } from '$app/stores';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	// The Theory Map is a full-viewport tool, so it skips the footer.
	const showFooter = $derived(!$page.url.pathname.startsWith('/map'));

	// "← Back" bar on secondary pages. Not on home or the quiz (kept clean); sandbox pages and the
	// map render their own Back button inside their header / toolbar.
	const showBack = $derived.by(() => {
		const p = $page.url.pathname;
		return p !== '/' && !p.startsWith('/quiz') && !p.startsWith('/map') && !p.startsWith('/sandbox/');
	});
	const backTo = $derived($page.url.pathname.startsWith('/sandbox') ? '/' : '/');

	// remember how deep the in-app history is, so Back uses real browser history when it can
	afterNavigate((n) => {
		if (!n.from) return;
		if (n.type === 'popstate') nav.depth = Math.max(0, nav.depth + n.delta);
		else if (n.type !== 'enter') nav.depth += 1;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap"
		rel="stylesheet"
	/>

	<!-- default SEO / social tags (a page can add its own <title> and description) -->
	<meta name="description" content={site.description} />
	<meta name="theme-color" content="#f7f4ee" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#111826" media="(prefers-color-scheme: dark)" />
	<link rel="canonical" href="{$page.url.origin}{$page.url.pathname}" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{site.name}: {site.tagline}" />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content="{$page.url.origin}{$page.url.pathname}" />
	<meta property="og:image" content="{$page.url.origin}/mascot/excited.webp" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<a class="skip" href="#content">Skip to content</a>

<!-- thin progress bar while navigating between pages -->
{#if $navigating}
	<div class="loadbar" aria-hidden="true" out:fade={{ duration: 220 }}></div>
{/if}

<Navbar />

<!-- soft fade-in when moving between top-level sections (keyed on the first path segment, so switching sandbox models does not remount the sticky sub-nav) -->
{#if showBack}
	<div class="backbar"><BackButton fallback={backTo} /></div>
{/if}

{#key $page.url.pathname.split('/')[1]}
	<div id="content" tabindex="-1" in:fade={{ duration: 260 }}>
		{@render children()}
	</div>
{/key}

{#if showFooter}<Footer />{/if}

<!-- Bodhi: persistent companion. Lives in the layout, so it follows you across every page. -->
<Companion />

<style>
	.backbar {
		max-width: var(--page-max, 1240px);
		margin: 0 auto;
		padding: 18px var(--page-pad, 24px) 0;
	}
	#content:focus {
		outline: none;
	}
	.skip {
		position: fixed;
		left: 12px;
		top: -60px;
		z-index: 300;
		padding: 10px 16px;
		border-radius: 10px;
		background: var(--ink);
		color: var(--bg);
		font: 600 14px 'DM Sans', system-ui, sans-serif;
		text-decoration: none;
		transition: top 0.2s;
	}
	.skip:focus {
		top: 12px;
	}
	.loadbar {
		position: fixed;
		inset: 0 auto auto 0;
		z-index: 250;
		height: 3px;
		width: 0;
		background: var(--rust);
		box-shadow: 0 0 8px color-mix(in srgb, var(--rust) 60%, transparent);
		animation: load 6s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
	}
	@keyframes load {
		to {
			width: 88%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.loadbar {
			animation-duration: 0.01ms;
			width: 88%;
		}
	}
</style>
