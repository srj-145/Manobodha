<script lang="ts">
	let {
		leverDown = false,
		light = 0,
		pelletKey = 0,
		grid = false
	}: {
		leverDown?: boolean;
		/** 0 off · 1 cue glow · 2 reinforcement flash */
		light?: 0 | 1 | 2;
		/** Increment to drop a new pellet. */
		pelletKey?: number;
		/** Show the electrified floor (aversive condition). */
		grid?: boolean;
	} = $props();
</script>

<svg viewBox="0 0 440 300" role="img" aria-label="Skinner box: a rat presses a lever; a signal light flashes and a food pellet drops into the tray.">
	<defs>
		<radialGradient id="glow">
			<stop offset="0" stop-color="var(--yel)" stop-opacity="0.85" />
			<stop offset="1" stop-color="var(--yel)" stop-opacity="0" />
		</radialGradient>
	</defs>

	<!-- chamber -->
	<rect x="14" y="20" width="412" height="238" rx="8" fill="var(--pap)" stroke="var(--ink)" stroke-width="2" />
	<rect x="318" y="20" width="108" height="238" rx="0" fill="color-mix(in srgb, var(--blue) 14%, var(--pap))" stroke="var(--ink)" stroke-width="2" />

	<!-- signal light -->
	<g>
		{#if light}<circle cx="372" cy="70" r={light === 2 ? 44 : 28} fill="url(#glow)" class:flash={light === 2} />{/if}
		<circle cx="372" cy="70" r="13" fill={light === 2 ? 'var(--yel)' : light === 1 ? 'color-mix(in srgb, var(--yel) 45%, var(--pap))' : 'var(--line)'} stroke="var(--ink)" stroke-width="2" style="transition: fill 0.2s" />
		<text x="372" y="104" text-anchor="middle" class="lbl">Signal light</text>
	</g>

	<!-- lever -->
	<g transform="rotate({leverDown ? 22 : 0} 318 150)" style="transition: transform 70ms ease-out">
		<rect x="270" y="145" width="48" height="10" rx="5" fill="var(--rust)" stroke="var(--ink)" stroke-width="1.6" />
	</g>
	<circle cx="318" cy="150" r="5" fill="var(--ink)" />
	<text x="372" y="154" text-anchor="middle" class="lbl">Lever</text>

	<!-- food chute, tray, pellet -->
	<path d="M356 176h32l-4 22h-24z" fill="var(--line)" stroke="var(--ink)" stroke-width="1.6" />
	<path d="M350 226q22 12 44 0v-12h-44z" fill="var(--bg)" stroke="var(--ink)" stroke-width="2" />
	{#if pelletKey > 0}
		{#key pelletKey}
			<circle class="pellet" cx="372" cy="196" r="6" fill="var(--sage)" stroke="var(--ink)" stroke-width="1.5" />
		{/key}
	{/if}
	<text x="372" y="248" text-anchor="middle" class="lbl">Food tray</text>

	<!-- electric grid floor -->
	<g stroke={grid ? 'var(--rust)' : 'var(--mut)'} stroke-width="2" stroke-linecap="round">
		{#each Array.from({ length: 21 }, (_, i) => 24 + i * 14) as x (x)}
			<path d="M{x} 244v10" />
		{/each}
		<path d="M20 244h296" />
	</g>
	{#if grid}<path class="spark" d="M70 236l8-10 6 8 8-12" fill="none" stroke="var(--yel)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />{/if}
	<text x="60" y="276" class="lbl">Electric grid {grid ? '(on)' : '(off)'}</text>

	<!-- rat -->
	<g class="rat" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
		<path d="M118 214c-26 4-34 20-58 14" fill="none" />
		<ellipse cx="170" cy="212" rx="60" ry="30" fill="var(--bg)" />
		<ellipse cx="130" cy="240" rx="16" ry="6" fill="var(--bg)" />
		<ellipse cx="206" cy="240" rx="14" ry="6" fill="var(--bg)" />
		<circle cx="232" cy="188" r="21" fill="var(--bg)" />
		<path d="M247 186l20 6-20 8z" fill="var(--bg)" />
		<circle cx="266" cy="192" r="3" fill="var(--rust)" stroke="none" />
		<circle cx="222" cy="168" r="9" fill="color-mix(in srgb, var(--rust) 30%, var(--bg))" />
		<circle cx="240" cy="184" r="2.6" fill="var(--ink)" stroke="none" />
		<path d="M222 200 {leverDown ? 'L276 160' : 'L266 168'}" fill="none" stroke-width="7" />
		<path d="M222 200 {leverDown ? 'L276 160' : 'L266 168'}" fill="none" stroke="var(--bg)" stroke-width="3.5" />
	</g>
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.lbl {
		font: 600 10.5px 'DM Sans', sans-serif;
		fill: var(--mut);
	}
	.flash {
		animation: flash 0.28s ease-in-out infinite alternate;
	}
	.pellet {
		animation: drop 0.7s cubic-bezier(0.5, 0, 0.9, 0.6) forwards;
	}
	.spark {
		animation: flash 0.15s steps(2) infinite;
	}
	@keyframes flash {
		to {
			opacity: 0.45;
		}
	}
	@keyframes drop {
		to {
			transform: translateY(24px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.flash,
		.spark {
			animation: none;
		}
	}
</style>
