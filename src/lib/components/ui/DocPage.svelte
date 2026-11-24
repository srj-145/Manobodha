<script lang="ts">
	import type { Snippet } from 'svelte';
	let { eyebrow, title, lede, children }: { eyebrow: string; title: string; lede?: string; children: Snippet } = $props();
</script>

<main class="doc">
	<header>
		<span class="eyebrow">{eyebrow}</span>
		<h1>{title}</h1>
		{#if lede}<p class="lede">{lede}</p>{/if}
	</header>
	<div class="body">{@render children()}</div>
</main>

<style>
	.doc {
		max-width: 760px;
		margin: 0 auto;
		padding: 64px var(--page-pad, 24px) 0;
		font-family: 'DM Sans', system-ui, sans-serif;
		color: var(--ink, #172238);
	}
	header {
		margin-bottom: 40px;
		animation: rise 0.6s ease both;
	}
	.eyebrow {
		display: block;
		margin-bottom: 14px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--rust, #b44f3b);
	}
	h1 {
		margin: 0;
		font-family: 'Fraunces', Georgia, serif;
		font-style: italic;
		font-weight: 400;
		font-size: clamp(36px, 6vw, 60px);
		line-height: 1.05;
	}
	.lede {
		margin: 18px 0 0;
		font-size: 19px;
		line-height: 1.6;
		color: var(--mut, #596177);
	}
	.body :global(h2) {
		margin: 44px 0 12px;
		font-family: 'Fraunces', Georgia, serif;
		font-style: italic;
		font-weight: 400;
		font-size: 28px;
		line-height: 1.2;
	}
	.body :global(p),
	.body :global(li) {
		line-height: 1.7;
		color: var(--mut, #596177);
	}
	.body :global(p) {
		margin: 0 0 14px;
	}
	.body :global(strong) {
		color: var(--ink, #172238);
	}
	.body :global(a) {
		color: var(--rust, #b44f3b);
	}
	.body :global(ul) {
		padding-left: 20px;
		margin: 0 0 14px;
	}
	.body :global(.steps) {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 12px;
		counter-reset: s;
	}
	.body :global(.steps li) {
		counter-increment: s;
		display: grid;
		grid-template-columns: 44px 1fr;
		gap: 14px;
		align-items: start;
		padding: 16px 18px;
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 16px;
		background: var(--pap, #eeeae0);
		transition:
			transform 0.2s,
			border-color 0.2s;
	}
	.body :global(.steps li:hover) {
		transform: translateY(-3px);
		border-color: var(--ink, #172238);
	}
	.body :global(.steps li::before) {
		content: '0' counter(s);
		font-family: 'Fraunces', Georgia, serif;
		font-style: italic;
		font-size: 26px;
		color: var(--rust, #b44f3b);
	}
	.body :global(.steps b) {
		display: block;
		color: var(--ink, #172238);
		margin-bottom: 2px;
	}
	.body :global(details) {
		border-bottom: 1px solid var(--line, #d8d4ca);
		padding: 16px 0;
	}
	.body :global(summary) {
		cursor: pointer;
		font-weight: 600;
		color: var(--ink, #172238);
		list-style: none;
		display: flex;
		justify-content: space-between;
		gap: 16px;
	}
	.body :global(summary::-webkit-details-marker) {
		display: none;
	}
	.body :global(summary::after) {
		content: '+';
		font-size: 22px;
		line-height: 1;
		color: var(--rust, #b44f3b);
		transition: transform 0.25s;
	}
	.body :global(details[open] summary::after) {
		transform: rotate(45deg);
	}
	.body :global(details p) {
		margin: 12px 0 0;
		animation: rise 0.35s ease both;
	}
	.body :global(.cta) {
		display: inline-block;
		margin-top: 10px;
		padding: 13px 26px;
		border-radius: 999px;
		background: var(--ink, #172238);
		color: var(--bg, #f7f4ee);
		text-decoration: none;
		font-weight: 600;
		transition: transform 0.15s;
	}
	.body :global(.cta:hover) {
		transform: translateY(-2px);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		header,
		.body :global(details p) {
			animation: none;
		}
	}
</style>
