<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	let {
		open = $bindable(false),
		title = 'Simulation Controls',
		tabs,
		body,
		onreset,
		oninteract
	}: {
		open?: boolean;
		title?: string;
		/** Folder tabs; the active tab id is passed to `body`. */
		tabs: { id: string; label: string }[];
		body: Snippet<[string]>;
		onreset?: () => void;
		/** Fired when the user touches a control, so auto-mode can hand over. */
		oninteract?: () => void;
	} = $props();

	let picked = $state('');
	const active = $derived(picked || tabs[0].id);

	// Draggable on desktop (header is the handle). On phones the CSS turns this into a bottom drawer.
	let dx = $state(0);
	let dy = $state(0);
	let drag: { x: number; y: number; ox: number; oy: number } | null = null;
	function down(e: PointerEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		drag = { x: e.clientX, y: e.clientY, ox: dx, oy: dy };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!drag) return;
		dx = drag.ox + e.clientX - drag.x;
		dy = drag.oy + e.clientY - drag.y;
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

{#if open}
	<button type="button" class="scrim" aria-label="Close controls" tabindex="-1" onclick={() => (open = false)}></button>
	<div class="win" role="dialog" aria-label={title} style="--dx:{dx}px;--dy:{dy}px" transition:fly={{ y: 18, duration: 200 }}>
		<div class="head" onpointerdown={down} onpointermove={move} onpointerup={() => (drag = null)} onpointercancel={() => (drag = null)} role="presentation">
			<span class="ttl"><i aria-hidden="true">⚙</i> {title}</span>
			<button type="button" class="x" aria-label="Close controls" onclick={() => (open = false)}>×</button>
		</div>
		<div class="tabs" role="tablist">
			{#each tabs as t (t.id)}
				<button type="button" role="tab" aria-selected={active === t.id} class:on={active === t.id} onclick={() => (picked = t.id)}>{t.label}</button>
			{/each}
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="body" onpointerdown={oninteract} onkeydown={oninteract}>
			{@render body(active)}
		</div>
		<div class="foot">
			<span class="live">Paused while open. Press Start to continue.</span>
			{#if onreset}<button type="button" class="btn" onclick={onreset}>Reset</button>{/if}
			<button type="button" class="btn main" onclick={() => (open = false)}>Done</button>
		</div>
	</div>
{/if}

<style>
	.scrim {
		display: none;
	}
	.win {
		position: fixed;
		left: max(16px, calc((100vw - 1240px) / 2 + 24px));
		top: 150px;
		translate: var(--dx) var(--dy);
		z-index: 95; /* above Bodhi */
		width: 340px;
		max-height: min(calc(100vh - 300px), 580px);
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: 1px solid var(--edge-strong);
		border-radius: 14px;
		box-shadow: 0 24px 60px -16px rgba(0, 0, 0, 0.75);
		overflow: hidden;
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 11px 12px 11px 16px;
		background: color-mix(in srgb, var(--ink) 6%, var(--card));
		border-bottom: 1px solid var(--edge);
		cursor: grab;
		touch-action: none;
		user-select: none;
	}
	.head:active {
		cursor: grabbing;
	}
	.ttl {
		font-size: var(--fs-small);
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.ttl i {
		font-style: normal;
		margin-right: 4px;
	}
	.x {
		width: 30px;
		height: 30px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--ink-soft);
		font-size: 22px;
		line-height: 1;
		cursor: pointer;
	}
	.x:hover {
		background: color-mix(in srgb, var(--ink) 10%, transparent);
		color: var(--ink);
	}
	/* folder tabs */
	.tabs {
		display: flex;
		gap: 4px;
		padding: 10px 12px 0;
		border-bottom: 1px solid var(--edge);
	}
	.tabs button {
		padding: 7px 14px;
		border: 1px solid transparent;
		border-bottom: 0;
		border-radius: 8px 8px 0 0;
		background: transparent;
		color: var(--ink-soft);
		font-size: var(--fs-small);
		font-weight: 700;
		cursor: pointer;
		margin-bottom: -1px;
	}
	.tabs button.on {
		background: var(--card);
		border-color: var(--edge-strong);
		color: var(--ink);
		position: relative;
	}
	.tabs button.on::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 1px;
		background: var(--card);
	}
	.body {
		padding: 16px;
		overflow-y: auto;
	}
	.foot {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-top: 1px solid var(--edge);
		background: color-mix(in srgb, var(--ink) 4%, var(--card));
	}
	.live {
		flex: 1;
		font-size: var(--fs-label);
		color: var(--ink-soft);
	}
	.btn {
		min-height: 36px;
		padding: 0 16px;
		border-radius: 8px;
		border: 1px solid var(--edge-strong);
		background: transparent;
		color: var(--ink);
		font-size: var(--fs-small);
		font-weight: 700;
		cursor: pointer;
	}
	.btn:hover {
		background: color-mix(in srgb, var(--ink) 10%, transparent);
	}
	.btn.main {
		background: var(--blue);
		border-color: var(--blue);
		color: #101722;
	}
	@media (max-width: 640px) {
		.scrim {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 59;
			border: 0;
			background: rgba(5, 8, 14, 0.55);
		}
		.win {
			left: 0;
			right: 0;
			bottom: 0;
			top: auto;
			translate: none;
			width: 100%;
			max-height: 82vh;
			border-radius: 18px 18px 0 0;
		}
		.head {
			cursor: default;
		}
	}
</style>
