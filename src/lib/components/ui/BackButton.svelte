<script lang="ts">
	import { resolveRoute } from '$app/paths';
	import { nav } from '$lib/utils/nav.svelte';

	// fallback = the logical parent page, used when there is no in-app history (e.g. the page was opened directly)
	let { fallback = '/', variant = 'site' }: { fallback?: string; variant?: 'site' | 'sbx' } = $props();

	function onclick(e: MouseEvent) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // keep open-in-new-tab working
		if (nav.canBack) {
			e.preventDefault();
			history.back();
		}
	}
</script>

<a class="back {variant}" href={resolveRoute(fallback)} {onclick} aria-label="Go back to the previous page">
	<span aria-hidden="true">←</span> Back
</a>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 0 16px;
		border: 1px solid var(--edge-strong, var(--line, rgba(0, 0, 0, 0.2)));
		border-radius: 999px;
		color: var(--ink);
		background: transparent;
		font: 600 14px/1 'DM Sans', 'Nunito', system-ui, sans-serif;
		text-decoration: none;
		transition:
			background 0.15s,
			transform 0.15s;
	}
	.back span {
		transition: transform 0.15s;
	}
	.back:hover {
		background: color-mix(in srgb, var(--ink) 9%, transparent);
	}
	.back:hover span {
		transform: translateX(-3px);
	}
	.back:focus-visible {
		outline: 2px solid var(--rust, var(--blue));
		outline-offset: 3px;
	}
	.back.sbx {
		font-family: var(--font, 'Nunito', system-ui, sans-serif);
		font-weight: 700;
		font-size: 13px;
		min-height: 36px;
	}
</style>
