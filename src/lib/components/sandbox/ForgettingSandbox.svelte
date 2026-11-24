<script lang="ts">
	import { onDestroy, onMount, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { resolveRoute } from '$app/paths';
	import { companion } from '$lib/utils/companion.svelte';
	import { Autopilot, type AutoScene } from '$lib/utils/autopilot.svelte';
		import ControlWindow from './ControlWindow.svelte';

	// ── parameters (left panel; ranges match the reference) ──
	let s0 = $state(3); // memory strength S (days)
	let nrev = $state(3); // number of reviews
	let intv = $state(2); // days between reviews
	let gain = $state(20); // boost per review, ×(gain / 10)
	let hor = $state(30); // time horizon (days)
	// FROZEN: while the parameter panel is in use, the simulation, graph, timers and animations all hold still
	let frozen = $state(false);
	let ctlOpen = $state(false); // floating control window

	// ── model: R = e^(−Δt / S); each review resets R to 100% and multiplies S by g ──
	const g = $derived(gain / 10);
	const model = $derived.by(() => {
		const base: [number, number][] = [];
		const rev: [number, number][] = [];
		const days: number[] = [];
		let cs = s0;
		let last = 0;
		for (let d = 0; d <= hor + 1e-9; d += 0.25) {
			base.push([d, Math.exp(-d / s0)]);
			for (let k = 1; k <= nrev; k++) {
				if (Math.abs(d - k * intv) < 1e-9) {
					rev.push([d, Math.exp(-(d - last) / cs)]); // drop just before the review
					last = d;
					cs *= g;
					days.push(d);
				}
			}
			rev.push([d, Math.exp(-(d - last) / cs)]);
		}
		return { base, rev, days, ret3: Math.exp(-(hor - last) / cs) };
	});

	// ── chart geometry (identical to the reference) ──
	const W = 740, HT = 330, ML = 44, MB = 34, MT = 12, MR = 12;
	const sx = (d: number) => ML + (d / hor) * (W - ML - MR);
	const sy = (r: number) => MT + (1 - r) * (HT - MT - MB);
	const pts = (a: [number, number][]) => a.map((q) => `${sx(q[0])},${sy(q[1])}`).join(' ');
	const xticks = $derived.by(() => {
		const step = hor > 30 ? 10 : hor > 14 ? 5 : 1;
		const out: number[] = [];
		for (let d = 0; d <= hor; d += step) out.push(d);
		return out;
	});
	const ret = $derived(model.ret3);

	// ── live curves: R(t) sampled on a fixed grid with the SAME equation as the model (no faked data) ──
	const N = 300;
	const target = $derived.by(() => {
		const base: number[] = [];
		const rev: number[] = [];
		let kk = 0;
		let last = 0;
		for (let i = 0; i <= N; i++) {
			const x = (i / N) * hor;
			while (kk < model.days.length && model.days[kk] <= x + 1e-9) last = model.days[kk++];
			base.push(Math.exp(-x / s0));
			rev.push(Math.exp(-(x - last) / (s0 * g ** kk)));
		}
		return { base, rev };
	});
	// When a parameter changes the plotted curve glides to its new shape (skipped while frozen / reduced motion)
	let dBase = $state<number[] | null>(null);
	let dRev = $state<number[] | null>(null);
	let raf = 0;
	$effect(() => {
		const t = target;
		untrack(() => {
			cancelAnimationFrame(raf);
			const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (!dBase || !dRev || frozen || reduced) {
				dBase = t.base;
				dRev = t.rev;
				return;
			}
			const fb = dBase;
			const fr = dRev;
			const t0 = performance.now();
			const stepFn = (now: number) => {
				const p = Math.min(1, (now - t0) / 420);
				const e = 1 - Math.pow(1 - p, 3);
				dBase = t.base.map((v, i) => fb[i] + (v - fb[i]) * e);
				dRev = t.rev.map((v, i) => fr[i] + (v - fr[i]) * e);
				if (p < 1) raf = requestAnimationFrame(stepFn);
			};
			raf = requestAnimationFrame(stepFn);
		});
		return () => cancelAnimationFrame(raf); // client only (also runs when the page is left)
	});
	const shownBase = $derived(dBase ?? target.base);
	const shownRev = $derived(dRev ?? target.rev);
	// retention of the reviewed memory at any day (used for the progressive data points)
	const retAt = (d: number) => {
		const kk = model.days.filter((x) => x <= d + 1e-9).length;
		return Math.exp(-(d - (kk ? model.days[kk - 1] : 0)) / (s0 * g ** kk));
	};
	const dotStep = $derived(hor > 30 ? 5 : hor > 14 ? 2 : 1);
	const dotDays = $derived(Array.from({ length: Math.floor(hor / dotStep) }, (_, i) => (i + 1) * dotStep));
	const halfDay = $derived(s0 * Math.LN2); // no-review half-life
	const pct = (r: number) => `${Math.round(r * 100)}%`;
	// ── timeline cursor: frac sweeps 0→1 across the horizon; 1 = the full static graph ──
	let frac = $state(1);
	let sweeping = $state(false);
	const cur = $derived(frac * hor);
	const k = $derived(model.days.filter((d) => d <= cur + 1e-9).length); // reviews so far
	const lastRev = $derived(k ? model.days[k - 1] : 0);
	const curBase = $derived(Math.exp(-cur / s0));
	const curRev = $derived(Math.exp(-(cur - lastRev) / (s0 * g ** k)));
	const justReviewed = $derived(sweeping && k > 0 && cur - lastRev < Math.max(0.8, hor * 0.05));
	// the curve is drawn only up to the cursor, so it grows progressively as simulated time passes
	const curve = (ys: number[], yNow: number): [number, number][] => {
		const out: [number, number][] = [];
		for (let i = 0; i <= N && (i / N) * hor <= cur; i++) out.push([(i / N) * hor, ys[i]]);
		out.push([cur, yNow]);
		return out;
	};
	const areaPts = (a: [number, number][]) => `${pts(a)} ${sx(cur)},${sy(0)} ${sx(0)},${sy(0)}`;
	// clock hand: a full turn = 60 days
	const handDeg = $derived(Math.min(360, (cur / 60) * 360));

	// ── AUTO-DEMO: glide sliders to a new setup, then sweep the timeline so the curves draw themselves ──
	const ap = new Autopilot(); // main looping demo
	const rp = new Autopilot(); // one-shot manual "replay timeline"
	const scene = (label: string, v: [number, number, number, number, number], tip: string, mood: 'right' | 'sad' | 'excited' | 'nervous'): AutoScene => ({
		label,
		run: async (c) => {
			sweeping = false;
			c.mark(['s0', 'nrev', 'intv', 'gain', 'hor']);
			await Promise.all([
				c.glide(s0, v[0], 1000, (x) => (s0 = Math.round(x))),
				c.glide(nrev, v[1], 1000, (x) => (nrev = Math.round(x))),
				c.glide(intv, v[2], 1000, (x) => (intv = Math.round(x))),
				c.glide(gain, v[3], 1000, (x) => (gain = Math.round(x))),
				c.glide(hor, v[4], 1000, (x) => (hor = Math.round(x)))
			]);
			c.mark([]);
			await c.sleep(250);
			companion.say(tip, mood, 7000);
			frac = 0;
			sweeping = true;
			await c.glide(0, 1, 11000, (x) => (frac = x));
			sweeping = false;
			await c.sleep(2600);
		}
	});
	const scenes: AutoScene[] = [
		scene('No reviews: memory just fades', [3, 0, 2, 20, 30], 'No reviews: retention keeps sliding toward zero.', 'sad'),
		scene('Three spaced reviews flatten the curve', [3, 3, 4, 20, 30], 'Each review snaps recall back to 100% and the next drop is gentler.', 'right'),
		scene('Bigger boosts, wider gaps', [3, 4, 6, 25, 45], 'Stronger memories can wait longer between reviews. That is the spacing effect.', 'excited'),
		scene('A weak memory needs frequent reviews', [1, 6, 2, 20, 20], 'Low strength means fast forgetting, so review early and often.', 'nervous')
	];
	const curS = $derived(s0 * g ** k); // current memory strength S
	const nextDay = $derived(model.days.find((d) => d > cur + 1e-9));
	const running = $derived(ap.on || rp.on);
	function freeze() {
		if (frozen) return;
		frozen = true;
		companion.frozen = true; // Bodhi's idle motion holds still too
		ap.stop(); // no automatic progression
		rp.stop(); // no timeline sweep (the graph stays exactly where it is)
	}
	// opening the control window freezes everything (it stays frozen until Start / Step / Reset)
	$effect(() => {
		if (ctlOpen) untrack(freeze);
	});
	function thaw() {
		frozen = false;
		companion.frozen = false;
	}
	function stopAll() {
		ap.stop();
		rp.stop();
	}
	// Start / Pause: CONTINUES a paused sweep; if the timeline is finished it plays it again with the current parameters
	function toggleRun() {
		thaw();
		if (running) return stopAll();
		replay(frac < 1 ? frac : 0);
	}
	function step() {
		stopAll();
		thaw();
		sweeping = true;
		frac = frac >= 1 ? 1 / hor : Math.min(1, (Math.floor(cur + 1e-9) + 1) / hor);
		if (frac >= 1) sweeping = false;
	}
	function resetAll() {
		stopAll();
		thaw();
		sweeping = false;
		frac = 1;
		s0 = 3;
		nrev = 3;
		intv = 2;
		gain = 20;
		hor = 30;
	}
	function replay(from = 0) {
		ap.stop();
		rp.play(
			[
				{
					label: 'replay',
					run: async (c) => {
						frac = from;
						sweeping = true;
						await c.glide(from, 1, 9000 * (1 - from) + 300, (x) => (frac = x));
						sweeping = false;
					}
				}
			],
			0,
			true
		);
	}
	onMount(() => {
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) ap.play(scenes);
	});
	onDestroy(() => {
		ap.stop();
		rp.stop();
		companion.frozen = false;
	});

	// COMPANION HOOK: the guide comments when a slider is released (change, not input, so it isn't noisy)
	function tipReviews() {
		companion.say(
			nrev === 0
				? 'No reviews: the red and green lines are identical. Memory just fades.'
				: `${nrev} review${nrev === 1 ? '' : 's'} every ${intv} day${intv === 1 ? '' : 's'}: each one snaps recall back to 100% and flattens the slope.`,
			nrev === 0 ? 'sad' : 'right'
		);
	}
	function tipStrength() {
		companion.say(s0 >= 6 ? 'Strong memory (high S): the curve falls slowly.' : 'Low S means fast forgetting. Try adding a review!', s0 >= 6 ? 'excited' : 'nervous');
	}
</script>

<svelte:head><title>Forgetting Curve sandbox – Manobodha</title></svelte:head>

<div class="wrap" class:frozen>
	<main>
		<div class="section-heading">
			<div><span class="eyebrow">MEMORY &amp; RETENTION</span><h2>Forgetting Curve</h2></div>
			<span class="section-tag">Learn → review → retain</span>
		</div>

		<!-- LEFT: ⚙ Controls (opens the parameter window and pauses everything).  RIGHT: Start / Step / Reset. -->
		<div class="toolbar" role="toolbar" aria-label="Simulation controls and actions">
			<button type="button" class="pill ctl" aria-expanded={ctlOpen} onclick={() => (ctlOpen = !ctlOpen)}>⚙ Controls</button>
			{#if frozen && !ctlOpen}<span class="pausechip" role="status">⏸ Paused · press Start to continue</span>{/if}
			<span class="sp"></span>
			<div class="grp">
						<button type="button" class="pill on" onclick={toggleRun}>{running ? 'Pause ❚❚' : 'Start ▶'}</button>
						<button type="button" class="pill" onclick={step}>Step ⏭</button>
				<button type="button" class="pill" onclick={() => { thaw(); replay(); }}>Replay ↻</button>
						<button type="button" class="pill" onclick={resetAll}>Reset ↺</button>
					</div>
		</div>

		<div class="main-top">
	<div class="doodle-card arena">
		<div class="card-head">
			<div class="arena-title">Memory chamber: study &amp; recall</div>
			<div class="hud" role="status" aria-label="Current state">
				<span class="big">{pct(curRev)}</span><span>retention</span>
				<span class="meter" aria-hidden="true"><i style="width:{curRev * 100}%"></i></span>
				<span>strength S <b>{curS.toFixed(1)}d</b></span>
				<span>reviews <b>{k}</b></span>
				<span>next <b>{nextDay === undefined ? '—' : 'day ' + nextDay}</b></span>
				<span class="state-pill">day {Math.round(cur)}</span>
			</div>
		</div>
		<svg viewBox="0 0 640 318" role="img" aria-label="A glowing brain whose lit-up memory network fades as time passes, next to a clock showing days elapsed and a stack of study flashcards">
			<defs>
				<linearGradient id="fc-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAF4E4" /><stop offset="1" stop-color="#E6DBC2" /></linearGradient>
				<linearGradient id="fc-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A606A" /><stop offset="1" stop-color="#363A42" /></linearGradient>
				<linearGradient id="fc-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".55" /><stop offset="1" stop-color="#FFF3C4" stop-opacity="0" /></linearGradient>
				<radialGradient id="brain-halo"><stop offset="0" stop-color="#86a8d6" stop-opacity=".8" /><stop offset=".55" stop-color="#86a8d6" stop-opacity=".28" /><stop offset="1" stop-color="#86a8d6" stop-opacity="0" /></radialGradient>
				<radialGradient id="fc-bulb"><stop offset="0" stop-color="#FFF6D0" /><stop offset="1" stop-color="#d9c07e" /></radialGradient>
			</defs>
			<rect x="8" y="8" width="624" height="302" rx="24" fill="url(#fc-steel)" />
			<rect x="26" y="26" width="588" height="262" rx="10" fill="url(#fc-wall)" />
			<polygon points="478,54 502,54 590,250 400,250" fill="url(#fc-beam)" />
			<rect x="26" y="26" width="588" height="262" rx="10" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2" />

			<!-- clock: days elapsed -->
			<circle cx="100" cy="86" r="38" fill="#EFE6D0" stroke="#6B7078" stroke-width="3" />
			<g stroke="#6B7078" stroke-width="2.5" stroke-linecap="round">
				<line x1="100" y1="52" x2="100" y2="58" /><line x1="100" y1="114" x2="100" y2="120" />
				<line x1="66" y1="86" x2="72" y2="86" /><line x1="128" y1="86" x2="134" y2="86" />
			</g>
			<line x1="100" y1="86" x2="100" y2="64" stroke="#4B5058" stroke-width="3" stroke-linecap="round" />
			<line class="clock-hand" x1="100" y1="86" x2="120" y2="86" stroke="#c4896a" stroke-width="3" stroke-linecap="round" style="transform-box:view-box; transform-origin:100px 86px; transform:rotate({handDeg}deg)" />
			<circle cx="100" cy="86" r="3.5" fill="#4B5058" />
			<text x="100" y="140" font-size="13" font-weight="800" fill="#4B5058" text-anchor="middle">day {Math.round(cur)}</text>
			<text x="100" y="156" font-size="10" font-weight="700" fill="#8A8F98" text-anchor="middle">days elapsed</text>

			<!-- flashcard stack -->
			<g transform="translate(46,196)"><g class="fc-stack" class:ping={justReviewed}>
				<rect x="10" y="10" width="92" height="58" rx="6" fill="#D9CEB5" stroke="#B9AD92" stroke-width="2" />
				<rect x="4" y="4" width="92" height="58" rx="6" fill="#E9DFC5" stroke="#B9AD92" stroke-width="2" />
				<rect x="-2" y="-2" width="92" height="58" rx="6" fill="#FAF4E4" stroke="#6B7078" stroke-width="2" />
				<line x1="13" y1="15" x2="75" y2="15" stroke="#8A9099" stroke-width="3" stroke-linecap="round" />
				<line x1="13" y1="28" x2="62" y2="28" stroke="#8A9099" stroke-width="3" stroke-linecap="round" />
				<line x1="13" y1="41" x2="68" y2="41" stroke="#B9AD92" stroke-width="3" stroke-linecap="round" />
			</g></g>
			<text x="90" y="272" font-size="10" font-weight="700" fill="#8A8F98" text-anchor="middle">study sessions</text>

			<!-- soft pulsing halo: brighter while memory is strong or just refreshed, fading as it is forgotten -->
			<g style="transform-box:view-box;transform-origin:443px 130px">
				<ellipse class="brain-halo" class:surge={justReviewed} cx="443" cy="132" rx="150" ry="112" fill="url(#brain-halo)" style="opacity:{0.14 + 0.62 * curRev}" />
			</g>
			<!-- brain icon: hero visual -->
			<g transform="translate(330,50) scale(1.55)">
				<g class="breathe">
					<path d="M40,88 C12,88 4,58 22,42 C10,24 32,6 54,14 C64,-2 92,-2 102,14 C124,6 146,24 134,42 C152,58 144,88 116,88 C118,106 100,120 80,114 C76,126 60,126 56,114 C36,120 18,106 40,88 Z" fill="url(#fc-bulb)" stroke="#C9A23A" stroke-width="2.5" stroke-linejoin="round" />
					<path d="M78,10 C74,40 74,80 78,116" fill="none" stroke="#B9800F" stroke-width="2" opacity=".45" />
					<g class="brain-glow" style="opacity:{Math.max(0.25, curRev)}">
						<line x1="50" y1="38" x2="78" y2="30" stroke="#B9800F" stroke-width="1.6" opacity=".55" />
						<line x1="78" y1="30" x2="105" y2="40" stroke="#B9800F" stroke-width="1.6" opacity=".55" />
						<line x1="50" y1="38" x2="60" y2="68" stroke="#B9800F" stroke-width="1.6" opacity=".55" />
						<line x1="105" y1="40" x2="98" y2="70" stroke="#B9800F" stroke-width="1.6" opacity=".55" />
						<line x1="60" y1="68" x2="98" y2="70" stroke="#B9800F" stroke-width="1.6" opacity=".55" />
						{#each [[78, 30, 6.5], [50, 38, 5.5], [105, 40, 5.5], [60, 68, 5.5], [98, 70, 5.5]] as n (n[0])}
							<circle class="memNode" cx={n[0]} cy={n[1]} r={n[2]} fill="#d9c07e" stroke="#B9800F" stroke-width="1.2" style="opacity:{Math.max(0.15, curRev)}" />
						{/each}
						<g class="brain-rays" stroke="#cdb072" stroke-width="3" stroke-linecap="round" style="opacity:{Math.max(0, (curRev - 0.5) * 2)}">
							<line x1="34" y1="10" x2="24" y2="-2" /><line x1="122" y1="10" x2="132" y2="-2" />
							<line x1="10" y1="46" x2="-4" y2="42" /><line x1="146" y1="46" x2="160" y2="42" />
						</g>
					</g>
				</g>
			</g>
			<text x="443" y="272" font-size="10" font-weight="700" fill="#8A8F98" text-anchor="middle">memory network</text>
			{#if justReviewed}<text transition:fade x="443" y="44" font-size="14" font-weight="800" fill="#7fa68c" text-anchor="middle">✓ review! recall → 100%</text>{/if}
		</svg>
	</div>

	<div class="doodle-card graph">
		<div class="card-head"><div class="graph-title">Forgetting curve — R = e<sup>−t/S</sup></div></div>
		<div class="graph-area" style="margin-top:12px">
			<svg viewBox="0 0 740 330" role="img" aria-label="Memory retention over {hor} days with and without spaced reviews">
				{#each [0, 1, 2, 3, 4] as i (i)}
					{@const r = i / 4}
					<line x1={ML} x2={W - MR} y1={sy(r)} y2={sy(r)} stroke="var(--grid)" />
					<text x="4" y={sy(r) + 4} >{r * 100}%</text>
				{/each}
				{#each xticks as d (d)}
					<text x={sx(d) - 8} y={HT - 16} >{d}d</text>
				{/each}
				<text x={W / 2 - 40} y={HT - 2} >days since learning</text>
				{#each model.days.filter((d) => d <= cur + 1e-9) as d (d)}
					<line x1={sx(d)} x2={sx(d)} y1={MT} y2={HT - MB} stroke="var(--amber)" stroke-dasharray="5 5" stroke-width="2" />
				{/each}
				<polygon points={areaPts(curve(shownRev, curRev))} fill="var(--teal)" opacity=".12" />
					<polyline fill="none" stroke="var(--coral)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" points={pts(curve(shownBase, curBase))} />
				<polyline fill="none" stroke="var(--teal)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" points={pts(curve(shownRev, curRev))} />
					{#each dotDays.filter((d) => d <= cur) as d (d)}
						<circle class="pip-pop" cx={sx(d)} cy={sy(retAt(d))} r="3.4" fill="var(--teal)" stroke="var(--paper)" stroke-width="1.5" />
					{/each}
					{#if halfDay <= hor && cur >= halfDay}
						<g class="pip-pop">
							<line x1={sx(halfDay)} x2={sx(halfDay)} y1={sy(0.5)} y2={HT - MB} stroke="var(--coral)" stroke-dasharray="2 4" />
							<circle cx={sx(halfDay)} cy={sy(0.5)} r="6" fill="none" stroke="var(--coral)" stroke-width="2.2" />
							<text x={sx(halfDay) + 10} y={sy(0.5) - 8}>half-life ≈ {halfDay.toFixed(1)}d</text>
						</g>
					{/if}
				{#if frac < 1}<line x1={sx(cur)} x2={sx(cur)} y1={MT} y2={HT - MB} stroke="var(--ink-soft)" stroke-dasharray="3 4" />{/if}
				<circle class="cursor-dot" cx={sx(cur)} cy={sy(curBase)} r="5.5" fill="var(--coral)" style="color:var(--coral)" />
				<circle class="cursor-dot" cx={sx(cur)} cy={sy(curRev)} r="5.5" fill="var(--teal)" style="color:var(--teal)" />
				{#if frac < 1}<text class="pen-label" x={Math.min(sx(cur) + 10, W - 46)} y={sy(curRev) - 10}>{pct(curRev)}</text>{/if}
				{#key k}{#if justReviewed}<circle class="review-burst" cx={sx(cur)} cy={sy(1)} r="14" fill="none" stroke="var(--amber)" stroke-width="3" />{/if}{/key}
			</svg>
		</div>
		<div class="legend">
			<span><span class="sw" style="background:var(--coral)"></span>no review</span>
			<span><span class="sw" style="background:var(--teal)"></span>with spaced reviews</span>
			<span><span class="sw" style="background:var(--amber)"></span>review day</span>
		</div>
		<div class="stats">
			<div class="stat"><b>{pct(Math.exp(-1 / s0))}</b><span>after 1 day, no review</span></div>
			<div class="stat"><b>{pct(Math.exp(-hor / s0))}</b><span>at horizon, no review</span></div>
			<div class="stat"><b>{pct(ret)}</b><span>at horizon, with reviews</span></div>
		</div>
	</div>
			</div>

		<details class="doodle-card fold">
			<summary>Theory · the science of forgetting</summary>
			<div class="fold-body">
				<div class="matrix">
					<div class="matrix-head">
						<div>
							<span class="eyebrow">KEY IDEAS</span>
							<h3 class="hand">Why memories fade, and how to keep them</h3>
						</div>
						<div class="matrix-sub">Hermann Ebbinghaus (1885) tested his own memory with nonsense syllables and measured how much he kept over time.</div>
					</div>
					<div class="mgrid">
						<div class="mcard static blue"><b>The forgetting curve</b>R = e<sup>−t/S</sup>. Retention drops steeply right after learning, then levels off. Most forgetting happens in the first day or two.</div>
						<div class="mcard static teal"><b>Memory strength (S)</b>The number of days it takes recall to fall to about 37%. Meaningful, well-connected material has a high S and fades slowly. Half-life = S × 0.69.</div>
						<div class="mcard static amber"><b>Spaced repetition</b>Review just before you would forget. Each successful review resets retention to 100% and multiplies S, so the next gap can be longer (1 → 3 → 7 → 16 days).</div>
						<div class="mcard static coral"><b>Active recall</b>Trying to retrieve the answer (flashcards, self-quizzing, explaining it aloud) strengthens memory far more than re-reading the same page.</div>
					</div>
				</div>

				<div class="review-path">
					<span>↗</span><b>Spaced review path</b>
					<span>Learn</span><i>→</i><span>Review</span><i>→</i><span>Recall</span><i>→</i><span>Stronger memory</span>
				</div>

				<div class="bubble">
					<b>Key idea —</b> forgetting is steepest right after learning. Reviewing just before recall drops too low makes each memory last longer; that is spaced repetition. Cramming once only shifts the same curve.
				</div>

				<div class="bubble" style="margin-top:14px">
					<b>Try this —</b>
					<ol class="tryit">
						<li>Set <i>Number of reviews</i> to 0 and see how little survives after a month.</li>
						<li>Add reviews, then raise <i>Strength boost per review</i> and watch the later curves flatten.</li>
						<li>Lower <i>Initial memory strength</i> to 1 and notice how much more often you must review.</li>
						<li>Compare reviewing at a short interval (2 days) with a long one (6 days) at the same strength.</li>
					</ol>
				</div>
			</div>
		</details>

		<div class="footer-note">
			<span>The timeline plays itself. Touch the parameters to pause it; press Start to continue.</span>
			<a class="pill" href="{resolveRoute('/quiz')}?theory=ebbinghaus-curve">take the quiz →</a>
		</div>
	</main>

	<ControlWindow bind:open={ctlOpen} title="Simulation Controls" tabs={[{ id: 'memory', label: 'Memory' }, { id: 'reviews', label: 'Reviews' }]} onreset={resetAll} oninteract={freeze}>
		{#snippet body(tab)}
				<span class="eyebrow">FORGETTING CURVE PARAMETERS</span>
				{#if tab === 'memory'}
					<div class="field" class:autoflash={ap.flash.includes('s0')}><label for="s0">Initial memory strength (S) <span>{s0}d</span></label><input id="s0" type="range" min="1" max="10" bind:value={s0} onchange={tipStrength} /><div class="hint">Higher = slower forgetting. Meaningful material has a higher S.</div></div>
					<div class="field" class:autoflash={ap.flash.includes('gain')}><label for="gain">Strength boost per review <span>×{g.toFixed(1)}</span></label><input id="gain" type="range" min="12" max="30" bind:value={gain} /><div class="hint">Each review resets recall to 100% and multiplies strength.</div></div>
				{:else}
					<div class="field" class:autoflash={ap.flash.includes('nrev')}><label for="nrev">Number of reviews <span>{nrev}</span></label><input id="nrev" type="range" min="0" max="8" bind:value={nrev} onchange={tipReviews} /></div>
					<div class="field" class:autoflash={ap.flash.includes('intv')}><label for="intv">Review interval <span>{intv}d</span></label><input id="intv" type="range" min="1" max="10" bind:value={intv} onchange={tipReviews} /></div>
					<div class="field" class:autoflash={ap.flash.includes('hor')}><label for="hor">Time horizon <span>{hor}d</span></label><input id="hor" type="range" min="7" max="60" bind:value={hor} /></div>
				{/if}
			{/snippet}
	</ControlWindow>
</div>
