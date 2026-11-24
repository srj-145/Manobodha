<script lang="ts">
	import { onDestroy, onMount, untrack } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { resolveRoute } from '$app/paths';
	import { companion } from '$lib/utils/companion.svelte';
	import { Autopilot, type AutoScene } from '$lib/utils/autopilot.svelte';
		import ControlWindow from './ControlWindow.svelte';

	type Consequence = 'pr' | 'nr' | 'pp' | 'np';
	type Schedule = 'crf' | 'fr' | 'vr' | 'ext';

	// ── parameters (left panel) ──
	let type = $state<Consequence>('pr');
	let sched = $state<Schedule>('vr');
	let req = $state(5);
	let mag = $state(5);
	let del = $state(0);
	let base = $state(5);

	// ── simulation state ──
	let p = $state(0.5); // nose-poke probability
	let t = $state(0);
	let pokes = $state(0);
	let since = 0;
	let need = 5;
	let pend: { at: number; d: number }[] = [];
	let pts = $state<[number, number][]>([[0, 0]]);
	let pips = $state<[number, number][]>([]);
	let status = $state('idle');
	let running = $state(false);
	let timer: ReturnType<typeof setInterval> | null = null;
	let toldReward = false;
	let toldPunish = false;
	// FROZEN: while the parameter panel is in use, the simulation, graph, timers and animations all hold still
	let frozen = $state(false);
	let ctlOpen = $state(false); // floating control window

	// ── transient visual effects ──
	let poking = $state(false);
	let ringHit = $state(false);
	let pinKey = $state(0);
	let puffKey = $state(0);
	let flinchKey = $state(0);
	let trayGone = $state(false);
	let wavesOff = $state(false);
	let frameColor = $state('transparent');

	const SIGN: Record<Consequence, number> = { pr: 1, nr: 1, pp: -1, np: -1 };
	const HINT: Record<Schedule, string> = {
		crf: 'Cheese every poke — learns fast, extinguishes fast.',
		fr: 'Cheese after every N pokes — high rate with short pauses.',
		vr: 'Cheese delivered on average every N pokes — steady, high rate.',
		ext: 'No consequence — behavior gradually dies out.'
	};
	const matrix: { t: Consequence; tone: string; name: string; text: string }[] = [
		{ t: 'pr', tone: 'blue', name: '+ Positive reinforcement', text: 'Adds cheese after poke. Nose-pokes increase.' },
		{ t: 'nr', tone: 'teal', name: '− Negative reinforcement', text: 'Removes noise after poke. Nose-pokes increase.' },
		{ t: 'pp', tone: 'coral', name: '+ Positive punishment', text: 'Adds air puff after poke. Nose-pokes decrease.' },
		{ t: 'np', tone: 'amber', name: '− Negative punishment', text: 'Removes cheese tray after poke. Nose-pokes decrease.' }
	];

	function fx(set: (v: boolean) => void, ms: number) {
		set(false);
		requestAnimationFrame(() => set(true)); // restart the CSS animation
		setTimeout(() => set(false), ms);
	}
	function flash(c: string) {
		frameColor = c;
		setTimeout(() => (frameColor = 'transparent'), 450);
	}
	function newNeed() {
		need = sched === 'vr' ? 1 + Math.floor(Math.random() * (2 * req - 1)) : req;
	}
	function deliver() {
		if (type === 'pr') { pinKey++; flash('#5f7a5c'); }
		if (type === 'pp') { puffKey++; setTimeout(() => flinchKey++, 350); flash('#b44f3b'); }
		if (type === 'np') { trayGone = true; setTimeout(() => (trayGone = false), 1500); flash('#c9a04f'); }
		if (type === 'nr') { wavesOff = true; setTimeout(() => (wavesOff = false), 1500); flash('#5f7a5c'); }
	}

	function tick() {
		t++;
		let msg = 'idle';
		if (Math.random() < p) {
			pokes++;
			since++;
			msg = 'poking';
			poking = true;
			setTimeout(() => (poking = false), 380);
			fx((v) => (ringHit = v), 400);
			const earned = sched === 'crf' || (sched !== 'ext' && since >= need);
			if (earned) {
				since = 0;
				newNeed();
				pend.push({ at: t + del, d: (SIGN[type] * mag * 0.012) / (1 + del * 0.15) });
				pips.push([t, pokes]);
			}
		}
		pend = pend.filter((e) => {
			if (e.at <= t) {
				p = Math.min(0.98, Math.max(0.02, p + e.d));
				deliver();
				msg = e.d > 0 ? 'reinforced ✓' : 'punished ✗';
				// COMPANION HOOK: the guide reacts the first time each outcome happens
				if (e.d > 0 && !toldReward) { toldReward = true; companion.say('Reinforced! The poke probability just went up.', 'right'); }
				if (e.d < 0 && !toldPunish) { toldPunish = true; companion.say('Punished: the poking is becoming less likely.', 'wrong'); }
				return false;
			}
			return true;
		});
		if (sched === 'ext') p = Math.max(0.02, p - 0.006);
		status = msg;
		pts.push([t, pokes]);
	}

	function stop() {
		if (timer) clearInterval(timer);
		timer = null;
		running = false;
	}
	function go(ms = 400) {
		if (timer) clearInterval(timer);
		running = true;
		timer = setInterval(tick, ms);
	}
	function start() {
		if (timer) return stop();
		go();
		companion.say('Watch the cumulative record: a steeper line means faster pressing!', 'excited');
	}
	function step() {
		stop();
		tick();
	}
	function reset() {
		stop();
		p = base / 10;
		t = 0;
		pokes = 0;
		since = 0;
		pend = [];
		pts = [[0, 0]];
		pips = [];
		newNeed();
		status = 'idle';
		toldReward = toldPunish = false;
	}
	// ── AUTO-DEMO: the sandbox animates itself; touching any control hands over to the user ──
	const ap = new Autopilot();
	const scene = (
		label: string,
		ty: Consequence,
		sc: Schedule,
		[rq, mg, dl, bs]: [number, number, number, number],
		tip: string,
		mood: 'right' | 'wrong' | 'excited' | 'confused' | 'nervous'
	): AutoScene => ({
		label,
		run: async (c) => {
			stop();
			c.mark(['type', 'sched']);
			type = ty;
			sched = sc;
			await c.sleep(900);
			c.mark(['req', 'mag', 'del', 'base']);
			await Promise.all([
				c.glide(req, rq, 900, (v) => (req = Math.round(v))),
				c.glide(mag, mg, 900, (v) => (mag = Math.round(v))),
				c.glide(del, dl, 900, (v) => (del = Math.round(v))),
				c.glide(base, bs, 900, (v) => (base = Math.round(v)))
			]);
			c.mark([]);
			await c.sleep(80); // let the base→reset effect flush before we start
			reset();
			companion.say(tip, mood, 7000);
			go(300);
			await c.sleep(13000);
			stop();
			await c.sleep(1400);
		}
	});
	const scenes: AutoScene[] = [
		scene('Positive reinforcement · variable ratio', 'pr', 'vr', [5, 6, 0, 4], 'Cheese after an unpredictable number of pokes: the record climbs steeply.', 'excited'),
		scene('Fixed ratio · pause and run', 'pr', 'fr', [6, 6, 0, 4], 'Fixed ratio: pokes come in bursts, then a short pause after each reward.', 'right'),
		scene('Negative reinforcement · noise removed', 'nr', 'crf', [1, 6, 0, 3], 'Removing the noise reinforces poking too. “Negative” means taken away.', 'right'),
		scene('Positive punishment · air puff', 'pp', 'crf', [1, 7, 0, 8], 'An air puff after each poke: watch the probability fall.', 'wrong'),
		scene('Extinction · rewards stop', 'pr', 'ext', [5, 5, 0, 8], 'No rewards at all, so the behavior slowly dies out.', 'confused'),
		scene('Negative punishment · tray removed', 'np', 'crf', [1, 7, 0, 8], 'Losing the cheese tray after a poke also suppresses behavior.', 'nervous')
	];
	function freeze() {
		if (frozen) return;
		frozen = true;
		companion.frozen = true; // Bodhi's idle motion holds still too
		ap.stop(); // no automatic progression
		stop(); // no simulation timer
	}
	// opening the control window freezes everything (it stays frozen until Start / Step / Reset)
	$effect(() => {
		if (ctlOpen) untrack(freeze);
	});
	function thaw() {
		frozen = false;
		companion.frozen = false;
	}
	// action buttons: Start / Pause / Step / Reset. They end the freeze; Start CONTINUES (no restart), Reset restarts.
	const runBtn = () => {
		ap.stop();
		thaw();
		start();
	};
	const stepBtn = () => {
		ap.stop();
		thaw();
		step();
	};
	const resetBtn = () => {
		ap.stop();
		thaw();
		reset();
	};
	onMount(() => {
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) ap.play(scenes);
	});
	onDestroy(() => {
		ap.stop();
		stop();
		companion.frozen = false;
	});

	// smooth, animated readout of the poke probability
	const pShown = tweened(0.5, { duration: 450, easing: cubicOut });
	$effect(() => {
		pShown.set(p);
	});
	// effects (not onchange handlers) so they always see the already-bound value
	$effect(() => {
		void sched;
		void req;
		untrack(newNeed);
	});
	$effect(() => {
		void base;
		untrack(reset);
	});

	// ── cumulative record geometry (identical maths to the reference) ──
	const W = 640, H = 340, M = 46;
	const X = $derived(Math.max(60, t));
	const Y = $derived(Math.max(20, pokes * 1.1));
	const sx = (x: number) => M + (x / X) * (W - M - 16);
	const sy = (y: number) => H - M - (y / Y) * (H - M - 18);
	const gridY = $derived([0, 1, 2, 3, 4].map((i) => ({ y: H - M - (i * (H - M - 18)) / 4, label: Math.round((Y * i) / 4) })));
	const line = $derived(pts.map((q) => `${sx(q[0])},${sy(q[1])}`).join(' '));
</script>

<svelte:head><title>Operant Conditioning sandbox – Manobodha</title></svelte:head>

<div class="wrap" class:frozen>
	<main>
		<div class="section-heading">
			<div><span class="eyebrow">INTERACTIVE CONCEPT</span><h2>Operant Conditioning</h2></div>
			<span class="section-tag">Practice → observe → learn</span>
		</div>

		<!-- LEFT: ⚙ Controls (opens the parameter window and pauses everything).  RIGHT: Start / Step / Reset. -->
		<div class="toolbar" role="toolbar" aria-label="Simulation controls and actions">
			<button type="button" class="pill ctl" aria-expanded={ctlOpen} onclick={() => (ctlOpen = !ctlOpen)}>⚙ Controls</button>
			{#if frozen && !ctlOpen}<span class="pausechip" role="status">⏸ Paused · press Start to continue</span>{/if}
			<span class="sp"></span>
			<div class="grp">
						<button type="button" class="pill on" onclick={runBtn}>{running ? 'Pause ❚❚' : 'Start ▶'}</button>
						<button type="button" class="pill" onclick={stepBtn}>Step ⏭</button>
						<button type="button" class="pill" onclick={resetBtn}>Reset ↺</button>
					</div>
		</div>

		<div class="main-top">
	<div class="doodle-card arena">
		<div class="card-head">
			<div class="arena-title">Skinner box: rat &amp; cheese chamber</div>
			<div class="hud" role="status" aria-label="Current state">
				<span class="big">{Math.round($pShown * 100)}%</span><span>poke probability</span>
				<span class="meter" aria-hidden="true"><i style="width:{$pShown * 100}%"></i></span>
				<span>pokes <b>{pokes}</b></span><span>rewards <b>{pips.length}</b></span>
				{#key status}<span class="state-pill pop">{status}</span>{/key}
			</div>
		</div>
		<svg viewBox="0 0 640 318" role="img" aria-label="Skinner box with rat, nose-poke port, feeder, speaker and air nozzle">
			<defs>
				<linearGradient id="op-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAF4E4" /><stop offset="1" stop-color="#E6DBC2" /></linearGradient>
				<linearGradient id="op-fur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4C2BD" /><stop offset="1" stop-color="#8E8C87" /></linearGradient>
				<linearGradient id="op-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A606A" /><stop offset="1" stop-color="#363A42" /></linearGradient>
				<linearGradient id="op-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".55" /><stop offset="1" stop-color="#FFF3C4" stop-opacity="0" /></linearGradient>
				<radialGradient id="op-bulb"><stop offset="0" stop-color="#FFF6D0" /><stop offset="1" stop-color="#F5C94B" /></radialGradient>
				<pattern id="op-rods" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#CFC5AD" /><rect x="6" width="4" height="16" fill="#7D838C" /><rect x="6" width="1.5" height="16" fill="#B5BBC3" /></pattern>
			</defs>
			<rect class="frame-rect" x="8" y="8" width="624" height="302" rx="24" fill="url(#op-steel)" stroke={frameColor} stroke-width="5" />
			<rect x="26" y="26" width="588" height="262" rx="10" fill="url(#op-wall)" />
			<polygon points="478,54 502,54 590,250 400,250" fill="url(#op-beam)" />
			<rect x="26" y="250" width="588" height="38" fill="url(#op-rods)" />
			<rect x="26" y="250" width="588" height="4" fill="#6B7078" /><rect x="26" y="270" width="588" height="3" fill="#6B7078" />
			<rect x="26" y="26" width="588" height="262" rx="10" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2" />
			<!-- speaker + noise waves (shown for negative reinforcement) -->
			<rect x="76" y="26" width="52" height="26" rx="6" fill="#4B5058" />
			<g fill="#8A9099"><circle cx="90" cy="35" r="2" /><circle cx="102" cy="35" r="2" /><circle cx="114" cy="35" r="2" /><circle cx="90" cy="44" r="2" /><circle cx="102" cy="44" r="2" /><circle cx="114" cy="44" r="2" /></g>
			{#if type === 'nr'}
				<g class="waves" class:off={wavesOff} fill="none" stroke="#c4896a" stroke-width="3" stroke-linecap="round"><path d="M138,32 q10,10 0,20" /><path d="M150,26 q16,16 0,32" /><path d="M164,20 q22,22 0,44" /></g>
			{/if}
			<!-- air nozzle + puff -->
			<path d="M322,26 h16 l-4,16 h-8z" fill="#4B5058" /><rect x="326" y="42" width="8" height="5" fill="#8A9099" />
			{#key puffKey}
				{#if puffKey > 0}<g class="puff" transform="translate(330,52)"><circle r="7" fill="#9CC9F0" /><circle r="7" fill="#B9DBF7" /><circle r="7" fill="#D6EBFB" /></g>{/if}
			{/key}
			<!-- house light -->
			<circle class="glow" cx="490" cy="46" r="24" fill="#FFE9A0" opacity=".35" /><circle cx="490" cy="42" r="11" fill="url(#op-bulb)" stroke="#C9A23A" stroke-width="1.5" /><rect x="483" y="26" width="14" height="8" rx="2" fill="#4B5058" />
			<!-- right panel -->
			<rect x="516" y="76" width="98" height="174" fill="#D9CEB5" /><rect x="516" y="76" width="4" height="174" fill="#B9AD92" />
			<rect x="530" y="86" width="60" height="30" rx="6" fill="#4B5058" /><rect x="540" y="96" width="40" height="5" rx="2" fill="#8A9099" />
			<rect x="587" y="96" width="8" height="128" rx="4" fill="#B9AD92" /><rect x="589" y="96" width="4" height="128" rx="2" fill="#A0947A" />
			<circle cx="548" cy="188" r="25" fill="#EFE6D0" stroke="#6B7078" stroke-width="3" /><circle class="ring" class:hit={ringHit} cx="548" cy="188" r="14" fill="#F3DCC0" stroke="#c4896a" stroke-width="3" /><circle cx="548" cy="188" r="6" fill="#c4896a" />
			<g class="tray" class:gone={trayGone}><rect x="574" y="232" width="38" height="13" rx="4" fill="#8A8F98" /><rect x="577" y="232" width="32" height="5" rx="2" fill="#5B6068" /></g>
			<text class="trayx" class:show={trayGone} x="593" y="226" font-size="14" font-weight="800" fill="#c4896a" text-anchor="middle">✕</text>
			{#key pinKey}
				{#if pinKey > 0}
					<g transform="translate(591,96)"><g class="pin"><path d="M-8,5 L8,5 L8,-2 Q0,-6 -8,-1Z" fill="#F2B632" stroke="#B9800F" stroke-width="1.2" /><circle cx="-2" cy="2" r="1.3" fill="#B9800F" /><circle cx="3" cy="1" r="1" fill="#B9800F" /></g></g>
				{/if}
			{/key}
			<!-- rat (tail, ears and nose use warm tan) -->
			<ellipse cx="380" cy="252" rx="110" ry="5" fill="rgba(0,0,0,.14)" />
			<g class="rp" class:poke={poking} style="transform: translate({poking ? 440 : 290}px, 252px) scale(.85)">
				<g class="rr">
					{#key flinchKey}
						<g class="rf" class:flinch={flinchKey > 0}>
							<path d="M6,-22 C-26,-20 -36,-52 -66,-40 C-72,-38 -74,-44 -68,-46" fill="none" stroke="#C9A98A" stroke-width="4.5" stroke-linecap="round" />
							<ellipse cx="44" cy="-30" rx="46" ry="27" fill="url(#op-fur)" />
							<ellipse cx="22" cy="-27" rx="26" ry="23" fill="#8E8C87" opacity=".55" />
							<ellipse cx="18" cy="-4" rx="15" ry="6" fill="#7C7A75" />
							<ellipse cx="88" cy="-33" rx="25" ry="20" fill="url(#op-fur)" />
							<ellipse cx="108" cy="-29" rx="17" ry="11" fill="#CFCDC8" />
							<circle cx="79" cy="-50" r="11" fill="#C9A98A" stroke="#8E8C87" stroke-width="2" /><circle cx="79" cy="-50" r="6" fill="#DCC3A6" />
							<circle cx="122" cy="-30" r="4.5" fill="#8A5A3C" />
							<circle cx="98" cy="-38" r="3.4" fill="#1E1E1B" /><circle cx="99.2" cy="-39.2" r="1.1" fill="#fff" />
							<g stroke="#6B6A66" stroke-width="1.1" stroke-linecap="round"><line x1="114" y1="-28" x2="142" y2="-38" /><line x1="114" y1="-26" x2="144" y2="-27" /><line x1="113" y1="-24" x2="140" y2="-16" /></g>
							<ellipse cx="94" cy="-4" rx="10" ry="5" fill="#C9A98A" />
						</g>
					{/key}
				</g>
			</g>
		</svg>
	</div>

	<div class="doodle-card graph">
		<div class="card-head"><div class="graph-title">Cumulative response record</div></div>
		<div class="graph-area" style="margin-top:12px">
			<svg viewBox="0 0 640 340" role="img" aria-label="Cumulative nose-pokes over time with reward markers">
				{#each gridY as k (k.y)}
					<line x1={M} x2={W - 16} y1={k.y} y2={k.y} stroke="var(--grid)" />
					<text x="6" y={k.y + 4}>{k.label}</text>
				{/each}
				<text x={W / 2 - 40} y={H - 12}>time / trials ▸</text>
				<polyline fill="none" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" points={line} />
				{#each pips as q (q[0])}
					<circle class="pip-pop" cx={sx(q[0])} cy={sy(q[1])} r="5" fill="var(--teal)" stroke="var(--card)" stroke-width="1.5" />
				{/each}
			</svg>
		</div>
		<div class="legend">
			<span><span class="sw" style="background:var(--ink)"></span>nose-pokes</span>
			<span><span class="sw" style="background:var(--teal)"></span>cheese reward</span>
			<span>time / trials ▸ {t}</span>
		</div>
	</div>
			</div>

		<details class="doodle-card fold">
			<summary>Theory · the operant conditioning matrix</summary>
			<div class="fold-body">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="matrix" onpointerdown={freeze}>
			<div class="matrix-head">
				<div>
					<span class="eyebrow">DECISION MAP</span>
					<h3 class="hand">Operant conditioning matrix</h3>
				</div>
				<div class="matrix-sub">Read across for what happens to the stimulus, then down for what happens to the behavior.</div>
			</div>
			<div class="matrix-board">
				<div></div>
				<div class="axis-top"><span>Stimulus added +</span><span>Stimulus removed −</span></div>
				<div class="axis-side"><span>Behavior increases</span><span>Behavior decreases</span></div>
				<div class="mgrid">
					{#each matrix as m (m.t)}
						<button type="button" class="mcard {m.tone}" class:sel={type === m.t} aria-pressed={type === m.t} onclick={() => (type = m.t)}>
							<b>{m.name}</b>{m.text}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="bubble">
			<b>Watch out —</b> "negative" just means <i>removing</i> a stimulus, not that the outcome is bad. Reinforcement always increases behavior. And more cheese isn't always better: continuous reward learns fast but extinguishes fast too — variable ratio is the one that's hardest to break.
		</div>
			</div>
		</details>

		<div class="footer-note">
			<span>The experiment runs itself. Use the toolbar or ⚙ Controls any time.</span>
			<a class="pill" href="{resolveRoute('/quiz')}?theory=operant-conditioning">take the quiz →</a>
		</div>
	</main>

	<ControlWindow bind:open={ctlOpen} title="Simulation Controls" tabs={[{ id: 'cons', label: 'Consequence' }, { id: 'dyn', label: 'Dynamics' }]} onreset={resetBtn} oninteract={freeze}>
		{#snippet body(tab)}
				<span class="eyebrow">OPERANT PARAMETERS</span>
				{#if tab === 'cons'}
					<div class="field" class:autoflash={ap.flash.includes('type')}>
			<label for="type">Consequence type</label>
			<select id="type" bind:value={type}>
				<option value="pr">Positive reinforcement (give cheese)</option>
				<option value="nr">Negative reinforcement (remove noise)</option>
				<option value="pp">Positive punishment (add air puff)</option>
				<option value="np">Negative punishment (remove tray)</option>
			</select>
			<div class="hint">Determines whether nose-poke rate goes up or down.</div>
					</div>
					<div class="field" class:autoflash={ap.flash.includes('sched')}>
			<label for="sched">Reinforcement schedule</label>
			<select id="sched" bind:value={sched}>
				<option value="crf">Continuous (every poke)</option>
				<option value="fr">Fixed ratio (FR)</option>
				<option value="vr">Variable ratio (VR)</option>
				<option value="ext">Extinction (none)</option>
			</select>
			<div class="hint">{HINT[sched]}</div>
					</div>
					<div class="field" class:autoflash={ap.flash.includes('req')}><label for="req">Schedule requirement <span>{req}</span></label><input id="req" type="range" min="1" max="10" bind:value={req} /></div>
				{:else}
					<div class="field" class:autoflash={ap.flash.includes('mag')}><label for="mag">Consequence magnitude <span>{mag}</span></label><input id="mag" type="range" min="1" max="10" bind:value={mag} /></div>
					<div class="field" class:autoflash={ap.flash.includes('del')}><label for="del">Consequence delay <span>{del}s</span></label><input id="del" type="range" min="0" max="10" bind:value={del} /></div>
					<div class="field" class:autoflash={ap.flash.includes('base')}><label for="base">Baseline tendency <span>{base * 10}%</span></label><input id="base" type="range" min="1" max="9" bind:value={base} /></div>
				{/if}
			{/snippet}
	</ControlWindow>
</div>
