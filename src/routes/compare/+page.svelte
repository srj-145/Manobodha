<!-- src/routes/compare/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolveRoute } from '$app/paths';
	import { theories, scenarios, type Theory } from '$lib/data/compareData';

	const MIN = 2;
	const MAX = 3;
	const rows = [
		{ label: 'Focus', hint: 'What does this theory focus on?', key: 'question' },
		{ label: 'Key thinkers', hint: 'Who developed it?', key: 'thinkers' },
		{ label: 'View of the learner', hint: 'What kind of learner does it assume?', key: 'learner' },
		{ label: 'Possible intervention', hint: 'What could change from this perspective?', key: 'intervention' },
		{ label: 'Limits', hint: 'What does it explain less well?', key: 'limits' }
	] as const;

	let mode = $state<'theories' | 'scenario'>('theories');
	let picked = $state<string[]>(['op', 'sdt']);
	let query = $state('');
	let warn = $state(false);
	let applyId = $state('');
	let scenarioId = $state(scenarios[0].id);
	let isMobileOpen = $state(false);
	let y = $state(0);

	let isScrolled = $derived(y > 20);
	let visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return theories.filter(
			(t) => !q || [t.name, t.short, t.thinkers, ...t.constructs].join(' ').toLowerCase().includes(q)
		);
	});
	let chosen = $derived(theories.filter((t) => picked.includes(t.id)));
	let hint = $derived(
		warn
			? `Keep at least ${MIN} perspectives to compare.`
			: `Choose ${MIN} to ${MAX} perspectives. ${picked.length} selected.`
	);
	let applied = $derived(scenarios.find((s) => s.id === applyId));
	let scenario = $derived(scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]);
	let lensList = $derived(
		theories.flatMap((t) => {
			const lens = scenario.lenses[t.id];
			return lens ? [{ t, lens }] : [];
		})
	);
	let others = $derived(theories.filter((t) => !scenario.lenses[t.id]));

	function toggleTheory(id: string) {
		if (picked.includes(id)) {
			if (picked.length > MIN) {
				picked = picked.filter((p) => p !== id);
				warn = false;
			} else warn = true;
		} else if (picked.length < MAX) {
			picked = [...picked, id];
			warn = false;
		}
	}

	function compareThese() {
		picked = lensList.slice(0, MAX).map((l) => l.t.id);
		applyId = scenario.id;
		warn = false;
		mode = 'theories';
	}

	function hrefFor(t: Theory): string {
		return t.sandboxId
			? resolveRoute('/sandbox/[theoryId]', { theoryId: t.sandboxId })
			: resolveRoute('/map');
	}

	onMount(() => {
		const els = document.querySelectorAll('.rv');
		if (!('IntersectionObserver' in window)) {
			els.forEach((r) => r.classList.add('in'));
			return;
		}
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((x) => {
					if (x.isIntersecting) {
						x.target.classList.add('in');
						io.unobserve(x.target);
					}
				}),
			{ threshold: 0.1 }
		);
		els.forEach((r) => io.observe(r));
		return () => io.disconnect();
	});
</script>

<svelte:window bind:scrollY={y} />

<svelte:head>
	<title>Compare perspectives – TheoryLab</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="app">
	<header class:s={isScrolled} class:o={isMobileOpen}>
		<div class="w nb">
			<a class="logo" href={resolveRoute('/')}>Theory<i>Lab</i>.</a>
			<button
				type="button"
				class="mb"
				aria-expanded={isMobileOpen}
				aria-controls="nv"
				onclick={() => (isMobileOpen = !isMobileOpen)}>Menu</button
			>
			<nav id="nv" aria-label="Main">
				<a href={resolveRoute('/')} onclick={() => (isMobileOpen = false)}>Home</a>
				<a href={resolveRoute('/sandbox')} onclick={() => (isMobileOpen = false)}>Explore</a>
				<a href={resolveRoute('/map')} onclick={() => (isMobileOpen = false)}>Theory Map</a>
				<a class="on" href={resolveRoute('/compare')} aria-current="page" onclick={() => (isMobileOpen = false)}>Compare</a>
				<a href={`${resolveRoute('/')}#about`} onclick={() => (isMobileOpen = false)}>About</a>
			</nav>
			<a class="go" href="#s1">Get Started <span class="arr">→</span></a>
		</div>
	</header>

	<main class="w">
		<div class="intro">
			<p class="lab">Compare perspectives</p>
			<h1>One situation. <em>Different ways</em> of understanding it.</h1>
			<p class="lede">
				Psychological theories often ask different questions about the same behaviour. Set theories
				side by side, or start from a situation and see which theories could be at work.
			</p>
		</div>

		<div class="modes" role="tablist" aria-label="How to compare">
			<button type="button" role="tab" id="tab-t" aria-selected={mode === 'theories'} aria-controls="panel" onclick={() => (mode = 'theories')}>
				<b>Compare theories</b><span>Pick 2 or 3 and set them side by side</span>
			</button>
			<button type="button" role="tab" id="tab-s" aria-selected={mode === 'scenario'} aria-controls="panel" onclick={() => (mode = 'scenario')}>
				<b>Explore a scenario</b><span>See every theory that could apply</span>
			</button>
		</div>

		<div id="panel" role="tabpanel" aria-labelledby={mode === 'theories' ? 'tab-t' : 'tab-s'}>
			{#if mode === 'theories'}
				<div class="step" id="s1">
					<p class="lab">01 — Choose perspectives</p>
					<div class="sel srch">
						<label for="tq">Search theories, thinkers or concepts</label>
						<input id="tq" type="search" autocomplete="off" placeholder="e.g. Skinner, working memory, motivation" bind:value={query} />
					</div>
					<p class="hint" aria-live="polite">{hint}</p>
					<div class="opts" role="group" aria-label="Perspectives to compare">
						{#each visible as theory (theory.id)}
							{@const isSelected = picked.includes(theory.id)}
							{@const isDisabled = !isSelected && picked.length >= MAX}
							<button
								type="button"
								class="opt th"
								role="checkbox"
								aria-checked={isSelected}
								style="--h:{theory.hue}"
								disabled={isDisabled}
								onclick={() => toggleTheory(theory.id)}
							>
								<i aria-hidden="true"></i>
								<div>
									<b>{theory.name}</b>
									<span class="d">{theory.short}</span>
								</div>
								<span class="st">{isSelected ? 'Selected' : 'Select'}</span>
							</button>
						{:else}
							<p class="none">No theory matches “{query}”. Try a thinker or a concept.</p>
						{/each}
					</div>
				</div>

				<div class="step" id="s2">
					<p class="lab">02 — Optional: apply a scenario</p>
					<div class="sel">
						<label for="apply">Read these theories through a situation</label>
						<select id="apply" bind:value={applyId}>
							<option value="">No scenario</option>
							{#each scenarios as s (s.id)}<option value={s.id}>{s.label}</option>{/each}
						</select>
					</div>
				</div>

				{#if chosen.length >= MIN}
					<div class="cmp">
						<p class="lab">The different lenses</p>
						{#if applied}
							<div class="scn">
								<p class="lab" style="margin-bottom:10px">The scenario</p>
								<p class="t">“{applied.text}”</p>
							</div>
						{/if}
						<div class="cols" style="--n: {chosen.length}" aria-live="polite">
							{#each chosen as t (t.id)}
								<article class="col th" style="--h:{t.hue}">
									<h3>{t.name}</h3>
									<dl>
										<dt>Key constructs</dt>
										<dd>
											<ul class="k">
												{#each t.constructs as c (c)}<li>{c}</li>{/each}
											</ul>
										</dd>
										{#each rows as r (r.key)}
											<dt>{r.label}<small>{r.hint}</small></dt>
											<dd>{t[r.key]}</dd>
										{/each}
										{#if applied}
											<dt>Interpretation<small>How might it explain the situation?</small></dt>
											<dd>{applied.lenses[t.id]?.sees ?? 'No reading written for this scenario yet.'}</dd>
										{/if}
									</dl>
									<div class="x">
										<small>Explore this theory</small>
										<a href={hrefFor(t)}>{t.sandboxId ? 'Explore the interactive experience' : 'See it on the Theory Map'} <span class="arr">→</span></a>
									</div>
								</article>
							{/each}
						</div>
						<p class="note">
							These summaries are descriptive and simplified. Each theory highlights some mechanisms
							and leaves others out, and none is ranked above another.
						</p>
					</div>
				{/if}
			{:else}
				<div class="step" id="s1">
					<p class="lab">01 — Choose a scenario</p>
					<div class="sel">
						<label for="scn">Select a situation</label>
						<select id="scn" bind:value={scenarioId}>
							{#each scenarios as s (s.id)}<option value={s.id}>{s.label}</option>{/each}
						</select>
					</div>
					<p class="q">What might be happening here?</p>
				</div>

				<div class="cmp">
					<p class="lab">The different lenses</p>
					<div class="scn">
						<p class="lab" style="margin-bottom:10px">The scenario</p>
						<p class="t">“{scenario.text}”</p>
					</div>
					<p class="sum">
						<strong>{lensList.length} of {theories.length} theories</strong> offer a lens on this situation.
						What they disagree about: {scenario.tension}
					</p>
					<div class="cols auto" aria-live="polite">
						{#each lensList as { t, lens } (t.id)}
							<article class="col th" style="--h:{t.hue}">
								<h3>{t.name}</h3>
								<dl>
									<dt>Focus<small>What does this theory focus on?</small></dt>
									<dd>{t.question}</dd>
									<dt>Interpretation<small>How might it explain the situation?</small></dt>
									<dd>{lens.sees}</dd>
									<dt>Possible intervention<small>What could change from this perspective?</small></dt>
									<dd>{lens.does}</dd>
								</dl>
								<div class="x">
									<small>Explore this theory</small>
									<a href={hrefFor(t)}>{t.sandboxId ? 'Explore the interactive experience' : 'See it on the Theory Map'} <span class="arr">→</span></a>
								</div>
							</article>
						{/each}
					</div>
					<div class="foot">
						<button type="button" class="btn" onclick={compareThese}>
							Compare {Math.min(lensList.length, MAX)} of these side by side <span class="arr">→</span>
						</button>
						{#if others.length}
							<p class="note">Less relevant here: {others.map((t) => t.name).join(', ')}.</p>
						{/if}
					</div>
					<p class="note">
						These summaries are descriptive and simplified. Each theory highlights some mechanisms
						and leaves others out, and none is ranked above another.
					</p>
				</div>
			{/if}
		</div>
	</main>

	<div class="close">
		<div class="w chain">
			<div>
				<p class="lab rv">Look closer</p>
				<h2 class="rv">What changes when you change the lens?</h2>
			</div>
			<ol class="rv">
				<li>Same scenario</li>
				<li>Different theoretical assumptions</li>
				<li>Different things become important</li>
				<li>Different possible explanations</li>
			</ol>
		</div>
	</div>

	<section class="w fin">
		<h2 class="rv">See a theory in action.</h2>
		<div class="b rv">
			<a class="btn" href={resolveRoute('/sandbox')}>Explore the Sandboxes <span class="arr">→</span></a>
			<a class="btn o" href={resolveRoute('/map')}>Explore the Theory Map <span class="arr">→</span></a>
		</div>
	</section>

	<footer>
		<div class="w">
			<a class="logo" href={resolveRoute('/')}>Theory<i>Lab</i>.</a>
			<nav aria-label="Footer">
				<a href={resolveRoute('/sandbox')}>Explore</a>
				<a href={resolveRoute('/map')}>Theory Map</a>
				<a href={resolveRoute('/compare')}>Compare</a>
				<a href={`${resolveRoute('/')}#about`}>About</a>
			</nav>
			<p>An interactive learning project exploring psychology and learning theories.</p>
		</div>
	</footer>
</div>

<style>
	.app {
		--bg: #f7f4ee;
		--ink: #172238;
		--mut: #596177;
		--line: #d8d4ca;
		--rust: #b44f3b;
		--pap: #eeeae0;
		--inv: #f7f4ee;
		--s: 42%;
		--l: 40%;
		box-sizing: border-box;
		background: var(--bg);
		color: var(--ink);
		font: 400 17px/1.65 'DM Sans', system-ui, sans-serif;
		min-height: 100vh;
		-webkit-font-smoothing: antialiased;
		padding-top: env(safe-area-inset-top, 0px);
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
	@media (prefers-color-scheme: dark) {
		.app {
			--bg: #111826;
			--ink: #ede8dc;
			--mut: #a3aabb;
			--line: #2b3446;
			--rust: #e27e67;
			--pap: #182034;
			--inv: #111826;
			--s: 45%;
			--l: 68%;
		}
	}
	.th {
		--c: hsl(var(--h) var(--s) var(--l));
	}
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: calc(72px + env(safe-area-inset-top, 0px));
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	a:focus-visible,
	button:focus-visible,
	select:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--rust);
		outline-offset: 3px;
	}
	h1,
	h2,
	h3 {
		font-family: Fraunces, Georgia, serif;
		font-weight: 300;
		letter-spacing: -0.025em;
	}
	.w {
		max-width: 1160px;
		margin: 0 auto;
		padding: 0 28px;
	}
	.lab {
		font: 700 12px/1 'DM Sans', sans-serif;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--mut);
		margin: 0 0 22px;
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.lab:before {
		content: '';
		width: 28px;
		border-top: 1px solid var(--rust);
	}
	em {
		font-style: italic;
		color: var(--rust);
	}
	.arr {
		display: inline-block;
		transition: transform 0.2s;
	}
	a:hover .arr,
	button:hover .arr {
		transform: translateX(5px);
	}

	header {
		position: sticky;
		top: env(safe-area-inset-top, 0px);
		z-index: 20;
		transition: 0.25s;
		border-bottom: 1px solid transparent;
	}
	header.s {
		background: color-mix(in srgb, var(--bg) 85%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-color: var(--line);
	}
	.nb {
		display: flex;
		align-items: center;
		height: 72px;
		transition: height 0.25s;
	}
	header.s .nb {
		height: 58px;
	}
	.logo {
		font: 400 23px Fraunces, serif;
	}
	.logo i {
		color: var(--rust);
	}
	nav {
		margin-left: auto;
		display: flex;
		gap: 30px;
		font-size: 15px;
		font-weight: 500;
	}
	nav a {
		color: var(--mut);
		border-bottom: 1.5px solid transparent;
		padding: 3px 0;
		transition: 0.2s;
	}
	nav a:hover,
	nav a.on {
		color: var(--ink);
		border-color: var(--rust);
	}
	.go {
		margin-left: 32px;
		font: 700 14px 'DM Sans', sans-serif;
		padding: 10px 18px;
		border: 1px solid var(--ink);
		border-radius: 4px;
		transition: 0.2s;
	}
	.go:hover {
		background: var(--ink);
		color: var(--inv);
	}
	.mb {
		display: none;
		margin-left: auto;
		min-height: 44px;
		padding: 10px 14px;
		background: none;
		border: 1px solid var(--line);
		border-radius: 4px;
		color: var(--ink);
		font: 600 14px 'DM Sans', sans-serif;
	}
	.btn {
		display: inline-block;
		min-height: 48px;
		padding: 17px 28px;
		background: var(--rust);
		color: var(--inv);
		border: 0;
		border-radius: 4px;
		font: 700 17px 'DM Sans', sans-serif;
		cursor: pointer;
		transition: 0.2s;
	}
	.btn:hover {
		background: var(--ink);
		color: var(--inv);
	}
	.btn.o {
		background: none;
		color: var(--ink);
		border: 1px solid var(--ink);
	}
	.btn.o:hover {
		background: var(--ink);
		color: var(--inv);
	}

	.intro {
		padding: 56px 0 56px;
		max-width: 900px;
	}
	h1 {
		font-size: clamp(44px, 6.4vw, 88px);
		line-height: 0.98;
		margin: 0 0 24px;
	}
	.lede {
		color: var(--mut);
		max-width: 30em;
		margin: 0;
		font-size: 18px;
	}

	.modes {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-top: 1px solid var(--ink);
	}
	.modes button {
		text-align: left;
		padding: 22px 24px 22px 0;
		background: none;
		border: 0;
		border-bottom: 3px solid var(--line);
		color: var(--mut);
		font: inherit;
		cursor: pointer;
		transition: 0.2s;
	}
	.modes button + button {
		padding-left: 24px;
		border-left: 1px solid var(--line);
	}
	.modes button[aria-selected='true'] {
		color: var(--ink);
		border-bottom-color: var(--rust);
	}
	.modes b {
		display: block;
		font: 300 clamp(22px, 2.6vw, 30px) Fraunces, serif;
		letter-spacing: -0.02em;
	}
	.modes span {
		font-size: 15px;
	}

	.step {
		padding: 48px 0;
		border-top: 1px solid var(--line);
	}
	.step:first-child,
	.modes + div > .step:first-child {
		border-top: 0;
	}
	.step > .lab {
		margin-bottom: 28px;
	}
	.sel {
		position: relative;
		max-width: 560px;
	}
	.sel label {
		display: block;
		font: 700 11px 'DM Sans', sans-serif;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mut);
		margin-bottom: 8px;
	}
	.sel select,
	.sel input {
		width: 100%;
		box-sizing: border-box;
		appearance: none;
		-webkit-appearance: none;
		background: transparent;
		color: var(--ink);
		border: 0;
		border-bottom: 1.5px solid var(--ink);
		border-radius: 0;
		padding: 10px 36px 10px 0;
		font: 300 clamp(24px, 3vw, 36px) Fraunces, serif;
		letter-spacing: -0.02em;
		cursor: pointer;
	}
	.sel input {
		cursor: text;
		padding-right: 0;
	}
	.sel input::placeholder {
		color: var(--mut);
		opacity: 0.7;
	}
	.sel:not(.srch):after {
		content: '↓';
		position: absolute;
		right: 4px;
		bottom: 16px;
		pointer-events: none;
		color: var(--rust);
	}
	.q {
		margin: 22px 0 0;
		font: italic 300 22px Fraunces, serif;
		color: var(--mut);
	}
	.hint {
		font-size: 14px;
		color: var(--mut);
		margin: 18px 0 18px;
		min-height: 1.5em;
	}
	.none {
		margin: 0;
		padding: 22px 0;
		color: var(--mut);
		border-top: 1px solid var(--line);
	}

	.opts {
		border-bottom: 1px solid var(--line);
	}
	.opt {
		display: grid;
		grid-template-columns: 6px 1fr auto;
		gap: 24px;
		align-items: center;
		width: 100%;
		text-align: left;
		background: none;
		border: 0;
		border-top: 1px solid var(--line);
		color: var(--ink);
		padding: 20px 0;
		cursor: pointer;
		font: inherit;
		transition: background 0.2s, padding 0.2s;
	}
	.opt:hover:not([disabled]) {
		background: var(--pap);
		padding-left: 14px;
		padding-right: 14px;
	}
	.opt i {
		align-self: stretch;
		background: var(--c);
		opacity: 0.25;
		transition: 0.2s;
	}
	.opt[aria-checked='true'] i {
		opacity: 1;
	}
	.opt b {
		display: block;
		font: 300 clamp(22px, 2.6vw, 30px) Fraunces, serif;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}
	.opt span.d {
		display: block;
		color: var(--mut);
		font-size: 15px;
		margin-top: 4px;
	}
	.opt .st {
		font: 700 11px 'DM Sans', sans-serif;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mut);
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.opt .st:before {
		content: '';
		width: 16px;
		height: 16px;
		border: 1.5px solid var(--mut);
		border-radius: 50%;
	}
	.opt[aria-checked='true'] .st {
		color: var(--c);
	}
	.opt[aria-checked='true'] .st:before {
		border-color: var(--c);
		background: radial-gradient(circle, var(--c) 0 4px, transparent 5px);
	}
	.opt[disabled] {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.cmp {
		padding: 72px 0 0;
		border-top: 1px solid var(--ink);
	}
	.scn {
		background: var(--bg);
		padding: 6px 0 28px;
		z-index: 5;
	}
	.scn .t {
		font: italic 300 clamp(28px, 4vw, 52px) / 1.1 Fraunces, serif;
		letter-spacing: -0.02em;
		margin: 0;
	}
	.sum {
		max-width: 46em;
		margin: 0 0 8px;
		color: var(--mut);
	}
	.sum strong {
		color: var(--ink);
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(var(--n, 2), 1fr);
		margin-top: 20px;
	}
	.col {
		padding: 20px 32px 0 0;
		border-top: 2px solid var(--c);
		animation: fi 0.5s both;
	}
	.col + .col {
		padding-left: 32px;
		border-left: 1px solid var(--line);
	}
	.cols.auto {
		grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
		gap: 40px;
	}
	.cols.auto .col,
	.cols.auto .col + .col {
		padding: 20px 0 0;
		border-left: 0;
	}
	@keyframes fi {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	.col h3 {
		font-size: clamp(26px, 2.6vw, 36px);
		color: var(--c);
		margin: 0 0 24px;
		line-height: 1.05;
	}
	.col dl {
		margin: 0;
	}
	.col dt {
		font: 700 11px 'DM Sans', sans-serif;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mut);
		margin-top: 24px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
	}
	.col dt:first-child {
		margin-top: 0;
		border: 0;
		padding: 0;
	}
	.col dt small {
		display: block;
		font: italic 400 15px Fraunces, serif;
		letter-spacing: 0;
		text-transform: none;
		color: var(--mut);
		margin-top: 2px;
	}
	.col dd {
		margin: 8px 0 0;
	}
	.col .k {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
		padding: 0;
		margin: 0;
		list-style: none;
		font-weight: 500;
	}
	.col .k li:before {
		content: '';
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--c);
		margin-right: 7px;
		vertical-align: middle;
	}
	.col .x {
		margin-top: 32px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
	}
	.col .x small {
		display: block;
		font: 700 11px 'DM Sans', sans-serif;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mut);
		margin-bottom: 6px;
	}
	.col .x a {
		font-weight: 700;
		border-bottom: 1.5px solid var(--c);
		padding: 4px 0 2px;
		display: inline-block;
	}
	.col .x a:hover {
		color: var(--c);
	}
	.foot {
		margin-top: 48px;
	}
	.note {
		margin: 32px 0 0;
		color: var(--mut);
		font-size: 14px;
		max-width: 44em;
	}

	.close {
		margin-top: 130px;
		background: var(--pap);
		border-block: 1px solid var(--line);
		padding: 110px 0;
	}
	.chain {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: 72px;
		align-items: start;
	}
	h2 {
		font-size: clamp(32px, 4.4vw, 58px);
		line-height: 1.05;
		margin: 0 0 20px;
	}
	.chain ol {
		list-style: none;
		margin: 0;
		padding: 0;
		border-left: 1px solid var(--ink);
	}
	.chain li {
		padding: 0 0 34px 34px;
		position: relative;
		font: 300 clamp(26px, 3.2vw, 40px) / 1.1 Fraunces, serif;
		letter-spacing: -0.02em;
		color: var(--mut);
	}
	.chain li:before {
		content: '';
		position: absolute;
		left: -5px;
		top: 0.45em;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--pap);
		border: 1px solid var(--ink);
	}
	.chain li:first-child {
		color: var(--ink);
	}
	.chain li:last-child {
		padding-bottom: 0;
		font-style: italic;
		color: var(--rust);
	}
	.chain li:last-child:before {
		background: var(--rust);
		border-color: var(--rust);
	}
	.fin {
		padding: 150px 0 130px;
		text-align: center;
	}
	.fin h2 {
		font-size: clamp(40px, 6vw, 80px);
		margin-bottom: 36px;
	}
	.fin .b {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}
	footer {
		border-top: 1px solid var(--line);
		padding: 40px 0 56px;
		color: var(--mut);
		font-size: 15px;
	}
	footer .w {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
	}
	footer nav {
		margin: 0;
		gap: 24px;
	}
	footer p {
		width: 100%;
		margin: 8px 0 0;
		font-size: 14px;
	}
	.rv {
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.9s, transform 0.9s;
	}
	:global(.rv.in) {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
		* {
			animation: none !important;
			transition: none !important;
		}
		.rv {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 900px) {
		.w {
			padding: 0 22px;
		}
		nav,
		.go {
			display: none;
		}
		.mb {
			display: block;
		}
		header.o nav {
			display: flex;
			flex-direction: column;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: var(--bg);
			padding: 8px 22px 20px;
			border-bottom: 1px solid var(--line);
			gap: 0;
		}
		header.o nav a {
			padding: 14px 0;
			border-bottom: 1px solid var(--line);
			font-size: 18px;
		}
		.intro {
			padding: 36px 0 40px;
		}
		.modes button {
			padding: 16px 10px 16px 0;
		}
		.modes button + button {
			padding-left: 14px;
		}
		.modes span {
			display: none;
		}
		.opt {
			grid-template-columns: 5px 1fr;
			gap: 16px;
		}
		.opt .st {
			grid-column: 2;
		}
		.scn {
			position: sticky;
			top: calc(58px + env(safe-area-inset-top, 0px));
			border-bottom: 1px solid var(--line);
			padding: 10px 0 14px;
		}
		.scn .t {
			font-size: 24px;
		}
		.scn .lab {
			margin-bottom: 8px;
		}
		.cols,
		.cols.auto {
			grid-template-columns: 1fr;
			margin-top: 8px;
			gap: 12px;
		}
		.col,
		.col + .col,
		.cols.auto .col {
			padding: 24px 0 36px;
			border-left: 0;
		}
		.chain {
			grid-template-columns: 1fr;
			gap: 36px;
		}
		.close {
			margin-top: 90px;
			padding: 80px 0;
		}
		.fin {
			padding: 100px 0 80px;
		}
	}
</style>