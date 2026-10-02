<!-- src/lib/components/ui/Navbar.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { resolveRoute } from '$app/paths';

	const main = [
		{ href: '/', label: 'Home' },
		{ href: '/sandbox', label: 'Sandboxes' },
		{ href: '/map', label: 'Theory Map' },
		{ href: '/compare', label: 'Compare' }
	] as const;
	const quiz = { href: '/quiz', label: 'Quiz' } as const;
	const explore = { href: '/explore', label: 'Explore' } as const;
	const all = [...main, quiz, explore];

	let open = $state(false);
	let headerEl = $state<HTMLElement | undefined>(undefined);
	let btnEl = $state<HTMLButtonElement | undefined>(undefined);

	function current(href: string) {
		const p = page.url.pathname;
		const on = href === '/' ? p === '/' : p === href || p.startsWith(href + '/');
		return on ? 'page' : undefined;
	}

	// Close the menu whenever the route changes.
	$effect(() => {
		void page.url.pathname;
		open = false;
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && open) {
			open = false;
			btnEl?.focus();
		}
	}}
	onpointerdown={(e) => {
		if (open && headerEl && !headerEl.contains(e.target as Node)) open = false;
	}}
/>

<header bind:this={headerEl}>
	<div class="bar">
		<a class="brand" href={resolveRoute('/')} aria-label="Manobodha home">Manobodha<i>.</i></a>

		<nav class="main" aria-label="Main">
			{#each main as l (l.href)}
				<a href={resolveRoute(l.href)} aria-current={current(l.href)}>{l.label}</a>
			{/each}
		</nav>

		<div class="end">
			<a class="quiet" href={resolveRoute(quiz.href)} aria-current={current(quiz.href)}>{quiz.label}</a>
			<a class="pill" href={resolveRoute(explore.href)} aria-current={current(explore.href)}>{explore.label}</a>
		</div>

		<button
			bind:this={btnEl}
			type="button"
			class="burger"
			aria-expanded={open}
			aria-controls="mnav"
			aria-label={open ? 'Close menu' : 'Open menu'}
			onclick={() => (open = !open)}
		>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
				{#if open}
					<path d="M4 4l12 12M16 4L4 16" />
				{:else}
					<path d="M3 6h14M3 10h14M3 14h14" />
				{/if}
			</svg>
		</button>
	</div>

	{#if open}
		<nav id="mnav" class="sheet" aria-label="Mobile">
			{#each all as l (l.href)}
				<a href={resolveRoute(l.href)} aria-current={current(l.href)} onclick={() => (open = false)}>{l.label}</a>
			{/each}
		</nav>
	{/if}
</header>

<style>
	header {
		position: sticky;
		top: env(safe-area-inset-top, 0px);
		z-index: 50;
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--line);
	}
	.bar {
		max-width: var(--page-max);
		margin: 0 auto;
		padding: 0 var(--page-pad);
		height: var(--nav-h);
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.brand {
		font: 400 24px/1 Fraunces, Georgia, serif;
		letter-spacing: -0.025em;
		color: var(--ink);
		text-decoration: none;
		margin-right: 28px;
		padding: 6px 0;
	}
	.brand i {
		color: var(--rust);
		font-style: normal;
	}
	.main,
	.end {
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.end {
		margin-left: auto;
		gap: 8px;
	}

	.main a,
	.quiet {
		position: relative;
		padding: 8px 12px;
		border-radius: 6px;
		font: 500 14.5px/20px 'DM Sans', system-ui, sans-serif;
		color: var(--mut);
		text-decoration: none;
		transition: color 0.15s, background-color 0.15s;
	}
	.main a:hover,
	.quiet:hover {
		color: var(--ink);
		background: color-mix(in srgb, var(--ink) 7%, transparent);
	}
	.main a[aria-current='page'],
	.quiet[aria-current='page'] {
		color: var(--ink);
	}
	/* active indicator sits on the bar's bottom border */
	.main a[aria-current='page']::after,
	.quiet[aria-current='page']::after {
		content: '';
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: -14px;
		height: 2px;
		background: var(--rust);
	}

	.pill {
		padding: 8px 16px;
		border-radius: 6px;
		background: var(--ink);
		color: var(--bg);
		font: 600 14px/20px 'DM Sans', system-ui, sans-serif;
		text-decoration: none;
		transition: background-color 0.15s, color 0.15s;
	}
	.pill:hover,
	.pill[aria-current='page'] {
		background: var(--rust);
		color: #fff;
	}

	.burger {
		display: none;
		margin-left: auto;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		background: none;
		border: 1px solid var(--line);
		border-radius: 6px;
		color: var(--ink);
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.burger:hover {
		background: color-mix(in srgb, var(--ink) 7%, transparent);
	}

	.sheet {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		max-height: calc(100dvh - var(--nav-h) - env(safe-area-inset-top, 0px));
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		padding: 8px var(--page-pad) 20px;
		background: var(--bg);
		border-bottom: 1px solid var(--line);
	}
	.sheet a {
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
		font: 500 18px/1.3 'DM Sans', system-ui, sans-serif;
		color: var(--mut);
		text-decoration: none;
	}
	.sheet a:hover {
		color: var(--ink);
	}
	.sheet a[aria-current='page'] {
		color: var(--ink);
		box-shadow: inset 3px 0 0 var(--rust);
		padding-left: 14px;
	}

	a:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--rust);
		outline-offset: 2px;
	}

	@media (max-width: 860px) {
		.main,
		.end {
			display: none;
		}
		.burger {
			display: flex;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none !important;
		}
	}
</style>