<script lang="ts">
	import { asset } from '$app/paths';
	import type { MascotState } from '$lib/types/quiz';

	let {
		mood = 'idle',
		speech = ''
	}: {
		mood?: MascotState;
		speech?: string;
	} = $props();

	// Each quiz state maps to one of the supplied expression images in /static/mascot.
	const imageFor: Record<MascotState, string> = {
		intro: 'excited',
		idle: 'neutral',
		thinking: 'nervous',
		correct: 'right',
		wrong: 'wrong',
		confused: 'confused',
		celebrate: 'surprise',
		sad: 'sad'
	};

	const faces = ['neutral', 'excited', 'nervous', 'right', 'wrong', 'confused', 'surprise', 'sad'];
	const activeFace = $derived(imageFor[mood]);

	const confetti = Array.from({ length: 26 }, (_, i) => ({
		left: (i * 37) % 100,
		delay: (i % 9) * 0.12,
		dur: 2.2 + (i % 5) * 0.35,
		drift: ((i % 7) - 3) * 18,
		color: ['var(--rust)', 'var(--yel)', 'var(--sage)', 'var(--blue)'][i % 4],
		round: i % 3 === 0
	}));
</script>

<div class="stage" data-state={mood}>
	<!-- Speech bubble: a polite live region so screen readers hear the guidance too -->
	<div class="bubble-wrap" aria-live="polite">
		{#key speech}
			{#if speech}
				<p class="bubble">{speech}</p>
			{/if}
		{/key}
	</div>

	<div class="mascot-box">
		{#if mood === 'celebrate'}
			<div class="confetti" aria-hidden="true">
				{#each confetti as c, i (i)}
					<span
						style="left:{c.left}%; animation-delay:{c.delay}s; animation-duration:{c.dur}s; --drift:{c.drift}px; background:{c.color}; border-radius:{c.round
							? '50%'
							: '2px'}"
					></span>
				{/each}
			</div>
		{/if}

		<!-- .float handles the idle bob; .react handles the one-off state animation -->
		<div class="float">
			<div class="react">
				{#each faces as f (f)}
					<img
						src={asset(`/mascot/${f}.webp`)}
						alt={f === activeFace ? `Mascot looking ${mood}` : ''}
						aria-hidden={f === activeFace ? undefined : 'true'}
						class:on={f === activeFace}
						width="740"
						height="440"
						draggable="false"
					/>
				{/each}
			</div>
		</div>
		<div class="shadow" aria-hidden="true"></div>
	</div>
</div>

<style>
	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 100%;
	}

	/* ---------- Speech bubble ---------- */
	.bubble-wrap {
		min-height: 86px;
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	.bubble {
		position: relative;
		margin: 0 0 12px;
		max-width: 340px;
		padding: 13px 18px;
		background: var(--bg);
		color: var(--ink);
		border: 1.5px solid var(--ink);
		border-radius: 20px;
		font: 600 15px/1.45 'DM Sans', system-ui, sans-serif;
		text-align: center;
		box-shadow: 0 6px 18px -8px color-mix(in srgb, var(--ink) 35%, transparent);
		animation: pop-in 0.35s cubic-bezier(0.2, 1.2, 0.4, 1) both;
	}
	/* tail pointing down at the mascot */
	.bubble::after,
	.bubble::before {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%) rotate(45deg);
		width: 14px;
		height: 14px;
		background: var(--bg);
	}
	.bubble::before {
		bottom: -8px;
		border-right: 1.5px solid var(--ink);
		border-bottom: 1.5px solid var(--ink);
	}
	.bubble::after {
		bottom: -6px;
	}

	/* ---------- Mascot ---------- */
	.mascot-box {
		position: relative;
		width: min(100%, 380px);
		aspect-ratio: 740 / 440;
	}
	.float {
		position: absolute;
		inset: 0;
		animation: bob 3.6s ease-in-out infinite;
	}
	.react {
		position: absolute;
		inset: 0;
		transform-origin: 50% 85%;
	}
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0;
		transform: scale(0.96);
		transition:
			opacity 0.28s ease,
			transform 0.35s cubic-bezier(0.2, 1.2, 0.4, 1);
		user-select: none;
		-webkit-user-drag: none;
		filter: drop-shadow(0 10px 14px color-mix(in srgb, var(--ink) 18%, transparent));
	}
	img.on {
		opacity: 1;
		transform: scale(1);
	}
	.shadow {
		position: absolute;
		left: 25%;
		right: 25%;
		bottom: -2%;
		height: 14px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--ink) 16%, transparent);
		filter: blur(6px);
		animation: shadow-bob 3.6s ease-in-out infinite;
	}

	/* ---------- State animations ---------- */
	[data-state='intro'] .react {
		animation: hop 0.9s ease-out 1;
	}
	[data-state='thinking'] .react {
		animation: fidget 1.1s ease-in-out infinite;
	}
	[data-state='correct'] .react {
		animation: pulse 0.7s ease-out 2;
	}
	[data-state='wrong'] .react,
	[data-state='confused'] .react {
		animation: shake 0.55s ease-in-out 1;
	}
	[data-state='celebrate'] .react {
		animation: jump 0.8s ease-in-out infinite;
	}
	[data-state='sad'] .float {
		animation-duration: 6s;
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
	@keyframes shadow-bob {
		0%,
		100% {
			transform: scaleX(1);
			opacity: 1;
		}
		50% {
			transform: scaleX(0.82);
			opacity: 0.6;
		}
	}
	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.92);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes hop {
		0% {
			transform: translateY(0) scale(1, 1);
		}
		30% {
			transform: translateY(-26px) scale(0.96, 1.05);
		}
		55% {
			transform: translateY(0) scale(1.06, 0.94);
		}
		100% {
			transform: translateY(0) scale(1, 1);
		}
	}
	@keyframes fidget {
		0%,
		100% {
			transform: rotate(0deg) translateX(0);
		}
		25% {
			transform: rotate(-2deg) translateX(-3px);
		}
		75% {
			transform: rotate(2deg) translateX(3px);
		}
	}
	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		45% {
			transform: scale(1.08);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		15% {
			transform: translateX(-12px) rotate(-2deg);
		}
		35% {
			transform: translateX(10px) rotate(2deg);
		}
		55% {
			transform: translateX(-7px);
		}
		75% {
			transform: translateX(5px);
		}
	}
	@keyframes jump {
		0%,
		100% {
			transform: translateY(0) scale(1, 1);
		}
		40% {
			transform: translateY(-22px) scale(0.97, 1.04);
		}
		60% {
			transform: translateY(-22px) scale(0.97, 1.04);
		}
		85% {
			transform: translateY(0) scale(1.05, 0.95);
		}
	}

	/* ---------- Confetti ---------- */
	.confetti {
		position: absolute;
		inset: -40px -30px 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 2;
	}
	.confetti span {
		position: absolute;
		top: -12px;
		width: 9px;
		height: 13px;
		opacity: 0;
		animation-name: fall;
		animation-timing-function: ease-in;
		animation-iteration-count: infinite;
	}
	@keyframes fall {
		0% {
			opacity: 1;
			transform: translate(0, 0) rotate(0deg);
		}
		100% {
			opacity: 0;
			transform: translate(var(--drift), 300px) rotate(540deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.float,
		.react,
		.shadow,
		.bubble,
		.confetti span {
			animation: none !important;
		}
		.confetti {
			display: none;
		}
		img {
			transition: opacity 0.1s linear;
		}
	}
</style>
