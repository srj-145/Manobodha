<script lang="ts">
	import type { DemoPlayer } from '$lib/utils/demoLoop.svelte';

	let {
		player,
		scenes,
		scrubLabel,
		scrubText
	}: {
		player: DemoPlayer;
		scenes: { title: string; note: string }[];
		scrubLabel: string;
		/** Human-readable value of the scrubber, e.g. "Day 12.4". */
		scrubText: string;
	} = $props();
</script>

<section class="bar" aria-label="Automated demo">
	<div class="head">
		<button class="play" class:live={player.playing} type="button" onclick={() => player.toggle()}>
			{#if player.playing}
				<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
				Pause &amp; Experiment
			{:else}
				<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 4l13 8-13 8z" /></svg>
				Play demo
			{/if}
		</button>

		<div class="speed" role="group" aria-label="Playback speed">
			<span class="led mint" class:on={player.playing} class:blink={player.playing} aria-hidden="true"></span>
			{#each [0.5, 1, 2] as sp (sp)}
				<button type="button" class:on={player.speed === sp} aria-pressed={player.speed === sp} onclick={() => (player.speed = sp)}>{sp}×</button>
			{/each}
		</div>

		<ol class="steps" aria-label="Demo scenes">
			{#each scenes as s, i (s.title)}
				<li>
					<button
						type="button"
						class:on={player.scene === i}
						aria-current={player.scene === i}
						aria-label="Scene {i + 1}: {s.title}"
						onclick={() => player.jump(i)}
					>
						<span class="fill" style="--f:{player.scene === i && player.playing ? player.progress : player.scene === i ? player.progress : 0}"></span>
					</button>
				</li>
			{/each}
		</ol>
	</div>

	<div class="cap" aria-live="off">
		<p class="lab">
			Scene {player.scene + 1} of {scenes.length}
			<span class="st">{player.phase === 'glide' ? '· Setting controls' : player.playing ? '· Running' : '· Paused'}</span>
		</p>
		<h3>{scenes[player.scene].title}</h3>
		<p class="note">{scenes[player.scene].note}</p>
	</div>

	<div class="scrub">
		<label for="scrub">{scrubLabel}</label>
		<input
			id="scrub"
			type="range"
			min="0"
			max="1000"
			value={Math.round(player.progress * 1000)}
			oninput={(e) => player.seek(Number(e.currentTarget.value) / 1000)}
			style="--p:{player.progress * 100}%"
		/>
		<output for="scrub">{scrubText}</output>
	</div>
</section>

<style>
	.bar {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 20px 32px;
		padding: 20px 24px;
		background: var(--pap);
		border: 1px solid var(--line);
		border-radius: 6px;
	}
	.head {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.play {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: 48px;
		padding: 0 22px;
		font: 700 15px/1 'DM Sans', sans-serif;
		color: #fff;
		background: var(--rust);
		border: 0;
		border-radius: 4px;
		cursor: pointer;
		transition: 0.2s;
	}
	.play:hover {
		background: var(--ink);
		color: var(--inv);
	}
	.play.live {
		background: transparent;
		color: var(--ink);
		box-shadow: inset 0 0 0 1.5px var(--ink);
	}
	.play.live:hover {
		background: var(--ink);
		color: var(--inv);
	}
	.speed {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.speed button {
		min-width: 44px;
		min-height: 36px;
		border-radius: 8px;
		border: 1px solid var(--line);
		background: transparent;
		color: var(--mut);
		font: 600 12px/1 ui-monospace, Menlo, monospace;
		cursor: pointer;
		transition: 0.15s;
	}
	.speed button:hover {
		color: var(--ink);
		border-color: var(--blue);
	}
	.speed button.on {
		color: var(--ink);
		border-color: var(--rust);
		box-shadow: 0 0 12px -3px var(--rust);
	}
	.steps {
		display: flex;
		gap: 6px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.steps li {
		flex: 1;
	}
	.steps button {
		display: block;
		width: 100%;
		height: 24px;
		padding: 9px 0;
		background: transparent;
		border: 0;
		cursor: pointer;
	}
	.fill {
		display: block;
		height: 6px;
		border-radius: 3px;
		background: var(--line);
		position: relative;
		overflow: hidden;
	}
	.fill::after {
		content: '';
		position: absolute;
		inset: 0;
		transform: scaleX(var(--f));
		transform-origin: left;
		background: var(--rust);
	}
	.on .fill {
		background: color-mix(in srgb, var(--rust) 28%, var(--line));
	}
	.cap {
		min-width: 0;
	}
	.lab {
		margin: 0 0 6px;
		font: 700 11.5px/1 'DM Sans', sans-serif;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--mut);
	}
	.st {
		color: var(--rust);
	}
	h3 {
		margin: 0 0 4px;
		font: 400 24px/1.2 Fraunces, Georgia, serif;
		letter-spacing: -0.02em;
	}
	.note {
		margin: 0;
		font-size: 15px;
		line-height: 1.55;
		color: var(--mut);
	}
	.scrub {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 16px;
		padding-top: 16px;
		border-top: 1px solid var(--line);
		font-size: 13px;
	}
	.scrub label {
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 11.5px;
		color: var(--mut);
	}
	output {
		font: 600 14px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
		min-width: 7ch;
		text-align: right;
		color: var(--ink);
	}
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 28px;
		background: transparent;
		cursor: pointer;
		margin: 0;
	}
	input[type='range']::-webkit-slider-runnable-track {
		height: 4px;
		border-radius: 2px;
		background: linear-gradient(to right, var(--ink) var(--p), var(--line) var(--p));
	}
	input[type='range']::-moz-range-track {
		height: 4px;
		border-radius: 2px;
		background: var(--line);
	}
	input[type='range']::-moz-range-progress {
		height: 4px;
		background: var(--ink);
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 18px;
		height: 18px;
		margin-top: -7px;
		border-radius: 50%;
		background: var(--rust);
		border: 3px solid var(--bg);
		box-shadow: 0 0 0 1px var(--rust);
	}
	input[type='range']::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--rust);
		border: 3px solid var(--bg);
	}
	@media (max-width: 760px) {
		.bar {
			grid-template-columns: 1fr;
			padding: 18px;
		}
		.scrub {
			grid-template-columns: 1fr auto;
		}
		.scrub label {
			grid-column: 1 / -1;
		}
	}
</style>
