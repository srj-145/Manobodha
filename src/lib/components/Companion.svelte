<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { asset, resolveRoute } from '$app/paths';
	import { companion, type CompanionMood } from '$lib/utils/companion.svelte';

	// ── context help per page ──
	type Help = { where: string; greet: string; tips: string[]; quiz?: string };
	function helpFor(path: string): Help {
		if (path === '/')
			return {
				where: 'Home',
				greet: 'Hi, I’m Bodhi! Tap me anytime you need a hand.',
				tips: [
					'Scroll down to see how Manobodha turns theories into things you can play with.',
					'Press “Explore Manobodha” to pick a theory sandbox.',
					'Not sure where to start? Operant Conditioning is a great first sandbox.'
				]
			};
		if (path.startsWith('/sandbox/operant-conditioning'))
			return {
				where: 'Operant Conditioning',
				greet: 'Operant lab! Press start and watch the response record.',
				quiz: 'operant-conditioning',
				tips: [
					'Press “start”, then watch the nose-poke probability and the cumulative record.',
					'Pick a card in the matrix (or the dropdown) to switch between reinforcement and punishment.',
					'Try “Extinction”: when rewards stop, behavior fades after a brief burst.',
					'Variable ratio gives the steadiest, most persistent responding. That’s why slot machines work.'
				]
			};
		if (path.startsWith('/sandbox/ebbinghaus-curve'))
			return {
				where: 'Forgetting Curve',
				greet: 'Memory lab! Drag the sliders and watch the curve bend.',
				quiz: 'ebbinghaus-curve',
				tips: [
					'Raise “Number of reviews” and watch the green line jump back to 100% each review day.',
					'Higher memory strength (S) means slower forgetting, so meaningful material sticks.',
					'The red line is what happens with no review at all. Compare the two!',
					'Spacing reviews out beats cramming: each review flattens the curve.'
				]
			};
		if (path.startsWith('/sandbox'))
			return { where: 'Sandboxes', greet: 'Pick a sandbox and start experimenting!', tips: ['Each sandbox lets you change a theory’s parameters and see what happens.'] };
		if (path.startsWith('/explore'))
			return {
				where: 'Explore',
				greet: 'Choose a theory to explore. I’ll tag along!',
				tips: ['Open a sandbox to experiment hands-on.', 'When you feel ready, test yourself with a quiz.']
			};
		if (path.startsWith('/compare'))
			return { where: 'Compare', greet: 'Comparing theories side by side. Nice!', tips: ['Switch scenarios to see how each theory explains the same situation differently.'] };
		if (path.startsWith('/map'))
			return { where: 'Theory Map', greet: 'This is the theory map. Everything connects!', tips: ['Click a node to see how theories relate to each other.', 'Drag to pan, scroll to zoom.'] };
		return { where: 'Manobodha', greet: 'I’m here if you need help!', tips: ['Use the top menu to jump between sections.'] };
	}

	const path = $derived($page.url.pathname);
	const help = $derived(helpFor(path));
	const hiddenOnPage = $derived(path.startsWith('/quiz')); // the quiz has its own big mascot

	// ── state ──
	let open = $state(false);
	let minimized = $state(false);
	let tipIdx = $state(0);
	let teaser = $state('');
	let teaserMood = $state<CompanionMood | null>(null);
	let hop = $state(false);
	let mounted = $state(false);
	const greeted = new Set<string>();
	let teaserTimer: ReturnType<typeof setTimeout> | undefined;
	let hopTimer: ReturnType<typeof setTimeout> | undefined;

	// Bodhi lives in the bottom-left corner of every page except the quiz
	const visible = $derived(mounted && !hiddenOnPage);

	const mood = $derived<CompanionMood>(companion.mood ?? (open ? 'excited' : (teaserMood ?? 'neutral')));
	const bubble = $derived(companion.msg || teaser);

	const FACES: Record<CompanionMood, string> = {
		neutral: 'neutral',
		excited: 'excited',
		nervous: 'nervous',
		right: 'right',
		wrong: 'wrong',
		confused: 'confused',
		surprise: 'surprise',
		sad: 'sad'
	};

	onMount(() => {
		minimized = localStorage.getItem('manobodha:companion-min') === '1';
		mounted = true;
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (open = false);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
		};
	});

	// FOLLOW: greet once per page per session, with a little hop, whenever the route changes
	$effect(() => {
		const p = path;
		if (!mounted) return;
		untrack(() => {
			open = false;
			tipIdx = 0;
			hop = true;
			clearTimeout(hopTimer);
			hopTimer = setTimeout(() => (hop = false), 800);
			if (!greeted.has(p) && !minimized && !hiddenOnPage) {
				greeted.add(p);
				teaser = help.greet;
				teaserMood = 'excited';
				clearTimeout(teaserTimer);
				teaserTimer = setTimeout(() => {
					teaser = '';
					teaserMood = null;
				}, 6500);
			}
		});
	});

	function toggle() {
		open = !open;
		if (open) {
			teaser = '';
			companion.clear();
		}
	}
	function nextTip() {
		tipIdx = (tipIdx + 1) % help.tips.length;
	}
	function setMin(v: boolean) {
		minimized = v;
		open = false;
		teaser = '';
		localStorage.setItem('manobodha:companion-min', v ? '1' : '0');
	}
	const quizHref = $derived(`${resolveRoute('/quiz')}${help.quiz ? `?theory=${help.quiz}` : ''}`);
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Nunito:wght@400;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if visible}
	<div class="bodhi" class:hop class:frozen={companion.frozen} class:labfont={$page.url.pathname.startsWith('/sandbox/')} transition:fly={{ y: 40, duration: 320 }}>
		{#if minimized}
			<button class="restore" type="button" aria-label="Show Bodhi, your guide" onclick={() => setMin(false)} transition:fade={{ duration: 150 }}>
				<img src={asset('/mascot/neutral.webp')} alt="" width="740" height="440" draggable="false" />
				<span aria-hidden="true">?</span>
			</button>
		{:else}
			{#if open}
				<div class="panel" role="dialog" aria-label="Bodhi, your guide" transition:fly={{ y: 16, duration: 220 }}>
					<div class="p-head">
						<div><small>BODHI · YOUR GUIDE</small><b>{help.where}</b></div>
						<button type="button" class="x" aria-label="Close help" onclick={() => (open = false)}>×</button>
					</div>
					{#key tipIdx}
						<p class="tip" in:fly={{ y: 8, duration: 220 }}>{help.tips[tipIdx]}</p>
					{/key}
					<div class="actions">
						{#if help.tips.length > 1}<button type="button" onclick={nextTip}>Another tip ↻</button>{/if}
						<a href={quizHref}>Take a quiz →</a>
						<a href={resolveRoute('/explore')}>All sandboxes</a>
						<button type="button" class="ghost" onclick={() => setMin(true)}>Hide Bodhi</button>
					</div>
				</div>
			{:else if bubble}
				{#key bubble}
					<p class="say" role="status" in:fly={{ y: 8, duration: 240 }} out:fade={{ duration: 160 }}>{bubble}</p>
				{/key}
			{/if}

			<button class="mascot" type="button" aria-expanded={open} aria-label={open ? 'Close Bodhi help' : 'Ask Bodhi for help'} onclick={toggle}>
				<span class="float">
					{#each Object.entries(FACES) as [m, f] (m)}
						<img
							src={asset(`/mascot/${f}.webp`)}
							alt=""
							class:on={m === mood}
							width="740"
							height="440"
							draggable="false"
						/>
					{/each}
				</span>
				{#if !open}<span class="badge" aria-hidden="true">?</span>{/if}
			</button>
		{/if}
	</div>
{/if}

<style>
	.bodhi {
		--c-bg: var(--pap, #eeeae0);
		--c-ink: var(--ink, #172238);
		--c-soft: var(--mut, #596177);
		--c-teal: color-mix(in srgb, var(--sage, #6b7c69) 24%, var(--bg, #f7f4ee));
		--c-blue: color-mix(in srgb, var(--blue, #566f8f) 20%, var(--bg, #f7f4ee));
		--c-accent: var(--rust, #b44f3b);
		position: fixed;
		left: 14px;
		bottom: calc(14px + env(safe-area-inset-bottom, 0px));
		z-index: 90;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		font-family: 'Nunito', system-ui, sans-serif;
		pointer-events: none;
	}
	.bodhi > * {
		pointer-events: auto;
	}

	.mascot {
		position: relative;
		width: clamp(84px, 9vw, 120px);
		aspect-ratio: 740 / 440;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.35));
		transition: transform 0.2s;
	}
	.mascot:hover {
		transform: scale(1.06) rotate(-2deg);
	}
	.mascot:active {
		transform: scale(0.96);
	}
	.mascot:focus-visible {
		outline: 3px solid var(--c-ink);
		outline-offset: 4px;
		border-radius: 20px;
	}
	.float {
		position: absolute;
		inset: 0;
		animation: bob 3.4s ease-in-out infinite;
	}
	.float img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0;
		transform: scale(0.92);
		transition:
			opacity 0.28s,
			transform 0.28s;
		pointer-events: none;
		user-select: none;
	}
	.float img.on {
		opacity: 1;
		transform: none;
	}
	.hop .mascot {
		animation: hop 0.75s ease-out;
	}
	.badge {
		position: absolute;
		top: 2px;
		right: 4px;
		width: 22px;
		height: 22px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--c-ink);
		color: var(--bg, #f7f4ee);
		font: 800 13px 'Nunito', sans-serif;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
	}

	.say,
	.panel {
		margin: 0;
		background: var(--c-bg);
		color: var(--c-ink);
		border: 2.5px solid var(--c-ink);
		border-radius: 20px;
		box-shadow:
			4px 4px 0 var(--c-ink),
			0 14px 30px -10px rgba(0, 0, 0, 0.5);
	}
	.say {
		position: relative;
		max-width: min(260px, calc(100vw - 40px));
		margin-left: 10px;
		padding: 11px 15px;
		font: 700 14px/1.4 'Kalam', cursive;
		animation: nudge 0.5s ease-out 0.25s;
	}
	.say::after {
		content: '';
		position: absolute;
		left: 34px;
		bottom: -9px;
		width: 14px;
		height: 14px;
		background: var(--c-bg);
		border-right: 2.5px solid var(--c-ink);
		border-bottom: 2.5px solid var(--c-ink);
		transform: rotate(45deg);
	}
	.panel {
		width: min(330px, calc(100vw - 28px));
		padding: 16px 18px 16px;
	}
	.p-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
		margin-bottom: 8px;
	}
	.p-head small {
		display: block;
		font-size: 9.5px;
		font-weight: 900;
		letter-spacing: 0.12em;
		color: var(--c-accent);
	}
	.p-head b {
		font: 700 18px 'Kalam', cursive;
		font-style: italic;
	}
	.x {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid var(--c-ink);
		background: transparent;
		color: var(--c-ink);
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
	}
	.x:hover {
		background: var(--c-blue);
	}
	.tip {
		margin: 0 0 14px;
		font-size: 14px;
		line-height: 1.55;
		color: var(--c-soft);
		min-height: 66px;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.actions a,
	.actions button {
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		padding: 5px 13px;
		border: 2px solid var(--c-ink);
		border-radius: 999px;
		background: var(--c-teal);
		color: var(--c-ink);
		font: 700 13px 'Kalam', cursive;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.12s;
	}
	.actions a:hover,
	.actions button:hover {
		transform: translateY(-2px);
	}
	.actions button:first-child:not(.ghost) {
		background: var(--c-blue);
	}
	.actions .ghost {
		background: transparent;
		border-style: dashed;
		color: var(--c-soft);
	}

	.restore {
		position: relative;
		width: 60px;
		height: 60px;
		padding: 0;
		border-radius: 50%;
		border: 2.5px solid var(--c-ink);
		background: var(--c-bg);
		box-shadow: 3px 3px 0 var(--c-ink);
		cursor: pointer;
		overflow: hidden;
	}
	.restore img {
		position: absolute;
		left: -22%;
		top: 4%;
		width: 150%;
		height: auto;
		pointer-events: none;
	}
	.restore span {
		position: absolute;
		right: 3px;
		bottom: 1px;
		font: 900 13px 'Nunito', sans-serif;
		color: var(--bg, #f7f4ee);
		background: var(--c-accent);
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: grid;
		place-items: center;
	}

	@keyframes bob {
		50% {
			transform: translateY(-6px);
		}
	}
	@keyframes hop {
		0% {
			transform: translateY(30px) scale(0.9);
			opacity: 0;
		}
		55% {
			transform: translateY(-14px);
			opacity: 1;
		}
		75% {
			transform: translateY(2px) scale(1.04, 0.95);
		}
		100% {
			transform: none;
		}
	}
	@keyframes nudge {
		30% {
			transform: rotate(-1.5deg) scale(1.03);
		}
		60% {
			transform: rotate(1deg);
		}
	}
	@media (max-width: 560px) {
		.bodhi {
			left: 8px;
			bottom: calc(8px + env(safe-area-inset-bottom, 0px));
		}
		.mascot {
			width: 78px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.float,
		.hop .mascot,
		.say {
			animation: none !important;
		}
	}
	/* sandbox is frozen (parameter panel in use): Bodhi's idle motion holds still too */
	.bodhi.frozen .float,
	.bodhi.frozen .mascot,
	.bodhi.frozen .say {
		animation-play-state: paused !important;
	}
	/* inside the sandboxes every popup uses the one sandbox typeface */
	.bodhi.labfont,
	.bodhi.labfont * {
		font-family: 'Nunito', system-ui, sans-serif !important;
	}
</style>
