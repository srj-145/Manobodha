
<!-- src/lib/components/ui/Navbar.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { resolveRoute } from '$app/paths';
	let { user } = $props();
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


<header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
		<a href="/" class="font-bold text-lg text-white tracking-tight">
			Manobodha
		</a>

		<nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
			<a href="/explore" class="hover:text-indigo-400 transition-colors">Explore</a>
			<a href="/map" class="hover:text-indigo-400 transition-colors">Theory Map</a>
			<a href="/compare" class="hover:text-indigo-400 transition-colors">Compare</a>
			<a href="/quiz" class="hover:text-indigo-400 transition-colors">Quiz</a>
		</nav>

		<div class="flex items-center gap-4">
			{#if user}
				<span class="text-xs font-medium text-slate-300 hidden sm:inline">
					Hi, {user.name}
				</span>
				<a
					href="/profile"
					class="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors"
				>
					Profile
				</a>
				<a
					href="/logout"
					class="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
				>
					Logout
				</a>
			{:else}
				<a
					href="/login"
					class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-sm"
				>
					Sign In / Register
				</a>
			{/if}
		</div>
	</div>

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


	/* Auth elements */
	.auth-group {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-left: 4px;
	}

	.auth-admin {
		padding: 5px 10px;
		border-radius: 6px;
		font: 600 12.5px/1.4 'DM Sans', system-ui, sans-serif;
		color: var(--rust);
		background: color-mix(in srgb, var(--rust) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--rust) 25%, transparent);
		text-decoration: none;
		transition: background-color 0.15s, color 0.15s;
		letter-spacing: 0.02em;
	}
	.auth-admin:hover,
	.auth-admin[aria-current='page'] {
		background: var(--rust);
		color: #fff;
	}

	.auth-name {
		padding: 7px 12px;
		border-radius: 6px;
		font: 500 14px/20px 'DM Sans', system-ui, sans-serif;
		color: var(--ink);
		text-decoration: none;
		border: 1px solid var(--line);
		transition: background-color 0.15s, border-color 0.15s;
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.auth-name:hover,
	.auth-name[aria-current='page'] {
		background: color-mix(in srgb, var(--ink) 7%, transparent);
		border-color: color-mix(in srgb, var(--ink) 20%, transparent);
	}

	.auth-logout {
		padding: 7px 12px;
		border-radius: 6px;
		font: 500 14px/20px 'DM Sans', system-ui, sans-serif;
		color: var(--mut);
		text-decoration: none;
		transition: color 0.15s;
	}
	.auth-logout:hover {
		color: var(--rust);
	}

	.auth-signin {
		padding: 8px 14px;
		border-radius: 6px;
		font: 600 14px/20px 'DM Sans', system-ui, sans-serif;
		color: var(--bg);
		background: var(--ink);
		text-decoration: none;
		transition: background-color 0.15s;
		margin-left: 4px;
	}
	.auth-signin:hover {
		background: var(--rust);
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

		background: color-mix(in srgb, var(--ink) 5%, transparent);
	}
	.sheet-divider {
		height: 1px;
		background: var(--line);
		margin: 8px var(--page-pad);
	}
	.sheet-admin {
		color: var(--rust) !important;
		font-weight: 600 !important;
	}
	.sheet-logout {
		color: var(--mut) !important;
	}
	.sheet-logout:hover {
		color: var(--rust) !important;
	}
	.sheet-register {
		font-weight: 600 !important;
		color: var(--ink) !important;
	}
			/*display: none;
		
		.burger {
			display: flex;
		}
	
/* <-- closes @media (max-width: 860px) from line 261 */
@media (max-width: 840px) {
	.main {
		display: none;
	}
	.end .quiet,
	.end .pill,
	.end .auth-group,
	.end .auth-signin {
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

