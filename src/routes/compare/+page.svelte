<!-- src/routes/compare/+page.svelte -->
<script lang="ts">
	import { resolveRoute } from '$app/paths';
	import { theories, scenarios, type Theory } from '$lib/data/compareData';

	const MIN = 2;
	const MAX = 3;
	const rows = [
		{ label: 'Core question', key: 'question' },
		{ label: 'Key thinkers', key: 'thinkers' },
		{ label: 'View of the learner', key: 'learner' },
		{ label: 'Typical intervention', key: 'intervention' },
		{ label: 'Limits', key: 'limits' }
	] as const;

	const byId = new Map(theories.map((t) => [t.id, t]));

	let mode = $state<'theories' | 'scenario'>('theories');
	let picked = $state<string[]>(['op', 'sdt']);
	let query = $state('');
	let open = $state(false);
	let active = $state(0);
	let applyId = $state('');
	let scenarioId = $state(scenarios[0].id);
	let isMobileOpen = $state(false);
	let y = $state(0);

	let isScrolled = $derived(y > 20);
	let chosen = $derived(picked.map((id) => byId.get(id)).filter((t): t is Theory => !!t));
	let results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return theories.filter(
			(t) =>
				!picked.includes(t.id) &&
				(!q || [t.name, t.short, t.thinkers, ...t.constructs].join(' ').toLowerCase().includes(q))
		);
	});
	let activeIdx = $derived(Math.max(0, Math.min(active, results.length - 1)));
	let applied = $derived(scenarios.find((s) => s.id === applyId));
	let scenario = $derived(scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]);
	let lensList = $derived(
		theories.flatMap((t) => {
			const lens = scenario.lenses[t.id];
			return lens ? [{ t, lens }] : [];
		})
	);
	let others = $derived(theories.filter((t) => !scenario.lenses[t.id]));

	function add(id: string) {
		if (picked.length < MAX && !picked.includes(id)) picked = [...picked, id];
		query = '';
		active = 0;
		open = false;
	}

	function remove(id: string) {
		picked = picked.filter((p) => p !== id);
	}

	function onKey(e: KeyboardEvent) {
		const n = results.length;
		if (e.key === 'ArrowDown' && n) {
			e.preventDefault();
			open = true;
			active = (activeIdx + 1) % n;
		} else if (e.key === 'ArrowUp' && n) {
			e.preventDefault();
			open = true;
			active = (activeIdx - 1 + n) % n;
		} else if (e.key === 'Enter' && open && n) {
			e.preventDefault();
			add(results[activeIdx].id);
		} else if (e.key === 'Escape') {
			open = false;
		}
	}

	function compareThese() {
		picked = lensList.slice(0, MAX).map((l) => l.t.id);
		applyId = scenario.id;
		mode = 'theories';
	}

	function hrefFor(t: Theory): string {
		return t.sandboxId
			? resolveRoute('/sandbox/[theoryId]', { theoryId: t.sandboxId })
			: resolveRoute('/map');
	}
</script>

<svelte:window bind:scrollY={y} />

<svelte:head>
	<title>Compare perspectives – Manobodha</title>
</svelte:head>

<div class="app">
	<main class="w">
		<div class="intro">
			<h1>Compare how psychology explains learning.</h1>
			<p class="lede">
				Set two or three theories side by side, or start from a real educational situation and see which
				theories could be at work and how each would respond.
			</p>
		</div>

		<div class="tabs" role="tablist" aria-label="Comparison mode">
			<button
				type="button"
				role="tab"
				id="tab-t"
				aria-selected={mode === 'theories'}
				aria-controls="panel-t"
				onclick={() => (mode = 'theories')}>Compare theories</button
			>
			<button
				type="button"
				role="tab"
				id="tab-s"
				aria-selected={mode === 'scenario'}
				aria-controls="panel-s"
				onclick={() => (mode = 'scenario')}>Explore a scenario</button
			>
		</div>

		{#if mode === 'theories'}
			<section id="panel-t" role="tabpanel" aria-labelledby="tab-t">
				<div class="pick">
					<label for="tsearch">Add {MIN} to {MAX} theories</label>
					<ul class="chips" aria-label="Selected theories">
						{#each chosen as t (t.id)}
							<li class="th chip" style="--h:{t.hue}">
								{t.name}
								<button type="button" aria-label="Remove {t.name}" onclick={() => remove(t.id)}
									>×</button
								>
							</li>
						{/each}
					</ul>
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<div
						class="combo"
						role="presentation"
						onfocusout={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget as Node | null)) open = false;
						}}
					>
						<input
							id="tsearch"
							type="text"
							role="combobox"
							autocomplete="off"
							aria-autocomplete="list"
							aria-expanded={open && picked.length < MAX}
							aria-controls="tlist"
							aria-activedescendant={open && results.length ? `opt-${results[activeIdx].id}` : undefined}
							placeholder={picked.length >= MAX
								? `Maximum of ${MAX} reached. Remove one to swap.`
								: 'Search by theory, thinker or concept'}
							disabled={picked.length >= MAX}
							bind:value={query}
							onfocus={() => (open = true)}
							oninput={() => {
								open = true;
								active = 0;
							}}
							onkeydown={onKey}
						/>
						{#if open && picked.length < MAX}
							<ul id="tlist" class="list" role="listbox" aria-label="Theories">
								{#each results as t, i (t.id)}
									<li
										id="opt-{t.id}"
										class="th"
										class:on={i === activeIdx}
										role="option"
										aria-selected={i === activeIdx}
										style="--h:{t.hue}"
										onmousedown={(e) => {
											e.preventDefault();
											add(t.id);
										}}
									>
										<b>{t.name}</b><span>{t.short}</span>
									</li>
								{:else}
									<li class="none" role="presentation">No match. Try a thinker or a concept.</li>
								{/each}
							</ul>
						{/if}
					</div>
					<p class="hint" aria-live="polite">
						{chosen.length < MIN
							? `Pick at least ${MIN} theories to compare.`
							: `${chosen.length} selected.`}
					</p>
					<div class="sel">
						<label for="apply">Optional: read them through a scenario</label>
						<select id="apply" bind:value={applyId}>
							<option value="">No scenario</option>
							{#each scenarios as s (s.id)}<option value={s.id}>{s.label}</option>{/each}
						</select>
					</div>
				</div>

				{#if chosen.length >= MIN}
					<div class="cols" style="--n:{chosen.length}">
						{#each chosen as t (t.id)}
							<article class="col th" style="--h:{t.hue}">
								<h3>{t.name}</h3>
								<p class="sh">{t.short}</p>
								<dl>
									<dt>Key constructs</dt>
									<dd>
										<ul class="k">
											{#each t.constructs as c (c)}<li>{c}</li>{/each}
										</ul>
									</dd>
									{#each rows as r (r.key)}
										<dt>{r.label}</dt>
										<dd>{t[r.key]}</dd>
									{/each}
									{#if applied}
										<dt>Through this lens<small>{applied.label}</small></dt>
										<dd>{applied.lenses[t.id]?.sees ?? 'No reading written for this scenario yet.'}</dd>
									{/if}
								</dl>
								<a class="more" href={hrefFor(t)}>
									{t.sandboxId ? 'Open simulation sandbox' : 'View on Theory Map'}
								</a>
							</article>
						{/each}
					</div>
				{/if}
			</section>
		{:else}
			<section id="panel-s" role="tabpanel" aria-labelledby="tab-s">
				<div class="sel">
					<label for="scn">Select a situation</label>
					<select id="scn" bind:value={scenarioId}>
						{#each scenarios as s (s.id)}<option value={s.id}>{s.label}</option>{/each}
					</select>
				</div>
				<blockquote class="scn">“{scenario.text}”</blockquote>
				<p class="sum">
					<strong>{lensList.length} of {theories.length} theories</strong> offer a lens on this situation.
					They disagree about one thing: {scenario.tension}
				</p>

				<div class="grid">
					{#each lensList as { t, lens } (t.id)}
						<article class="col th" style="--h:{t.hue}">
							<h3>{t.name}</h3>
							<dl>
								<dt>What it sees</dt>
								<dd>{lens.sees}</dd>
								<dt>What it would do</dt>
								<dd>{lens.does}</dd>
							</dl>
							<a class="more" href={hrefFor(t)}>
								{t.sandboxId ? 'Open simulation sandbox' : 'View on Theory Map'}
							</a>
						</article>
					{/each}
				</div>

				<div class="foot">
					<button type="button" class="btn" onclick={compareThese}>
						Compare {Math.min(lensList.length, MAX)} of these side by side
					</button>
					{#if others.length}
						<p class="note">
							Less relevant here: {others.map((t) => t.name).join(', ')}.
						</p>
					{/if}
				</div>
			</section>
		{/if}

		<p class="note">
			These summaries are simplified educational models. Each theory highlights specific mechanisms while leaving others out.
		</p>
	</main>
</div>

<style>
	.app {
		--bg: #111826;
		--ink: #ede8dc;
		--mut: #a3aabb;
		--line: #2b3446;
		--rust: #e27e67;
		--pap: #182034;
		--inv: #111826;
		--l: 68%;
		--s: 45%;
		box-sizing: border-box;
		background: var(--bg);
		color: var(--ink);
		font: 400 17px/1.65 'DM Sans', system-ui, sans-serif;
		min-height: 100%;
		padding-top: env(safe-area-inset-top, 0px);
		padding-bottom: env(safe-area-inset-bottom, 0px);
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

	.intro {
		padding: 48px 0 40px;
		max-width: 860px;
	}
	h1 {
		font-size: clamp(40px, 5.6vw, 76px);
		line-height: 1;
		margin: 0 0 22px;
	}
	.lede {
		color: var(--mut);
		max-width: 34em;
		margin: 0;
		font-size: 18px;
	}

	.tabs {
		display: flex;
		gap: 4px;
		border-bottom: 1px solid var(--ink);
	}
	.tabs button {
		padding: 14px 22px;
		min-height: 48px;
		background: none;
		border: 0;
		border-bottom: 3px solid transparent;
		color: var(--mut);
		font: 600 16px 'DM Sans', sans-serif;
		cursor: pointer;
	}
	.tabs button[aria-selected='true'] {
		color: var(--ink);
		border-bottom-color: var(--rust);
	}
	section {
		padding: 40px 0 8px;
	}

	label {
		display: block;
		font-weight: 600;
		font-size: 15px;
		margin-bottom: 8px;
	}
	.pick {
		max-width: 640px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		list-style: none;
		padding: 0;
		margin: 0 0 12px;
		min-height: 2px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 6px 4px 14px;
		border: 1.5px solid var(--c);
		border-radius: 999px;
		font-size: 15px;
		font-weight: 500;
	}
	.chip button {
		width: 28px;
		height: 28px;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--ink);
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
	}
	.chip button:hover {
		background: var(--pap);
	}
	.combo {
		position: relative;
	}
	input[type='text'] {
		width: 100%;
		box-sizing: border-box;
		padding: 14px 16px;
		background: var(--bg);
		color: var(--ink);
		border: 1.5px solid var(--ink);
		border-radius: 4px;
		font: inherit;
	}
	input:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	.list {
		position: absolute;
		z-index: 10;
		left: 0;
		right: 0;
		margin: 4px 0 0;
		padding: 0;
		list-style: none;
		max-height: 320px;
		overflow-y: auto;
		background: var(--bg);
		border: 1px solid var(--ink);
		border-radius: 4px;
	}
	.list li {
		padding: 12px 16px;
		border-left: 4px solid var(--c, transparent);
		cursor: pointer;
	}
	.list li.on {
		background: var(--pap);
	}
	.list li b {
		display: block;
		font-weight: 600;
	}
	.list li span {
		color: var(--mut);
		font-size: 14px;
	}
	.list li.none {
		color: var(--mut);
		cursor: default;
		border-left-color: transparent;
	}
	.hint {
		margin: 8px 0 24px;
		color: var(--mut);
		font-size: 14px;
	}
	.sel {
		max-width: 640px;
	}
	select {
		width: 100%;
		padding: 12px 10px;
		background: var(--bg);
		color: var(--ink);
		border: 1.5px solid var(--line);
		border-radius: 4px;
		font: inherit;
	}

	.cols,
	.grid {
		display: grid;
		gap: 40px;
		margin-top: 40px;
	}
	.cols {
		grid-template-columns: repeat(var(--n, 2), 1fr);
	}
	.grid {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		margin-top: 28px;
	}
	.col {
		border-top: 3px solid var(--c);
		padding-top: 20px;
		animation: fi 0.35s both;
	}
	@keyframes fi {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.col h3 {
		font-size: clamp(26px, 2.4vw, 34px);
		line-height: 1.1;
		color: var(--c);
		margin: 0 0 6px;
	}
	.sh {
		margin: 0 0 20px;
		color: var(--mut);
		font-size: 15px;
	}
	dl {
		margin: 0;
	}
	dt {
		margin-top: 20px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		font-weight: 700;
		font-size: 14px;
	}
	dt:first-child {
		margin-top: 0;
		padding-top: 0;
		border: 0;
	}
	dt small {
		display: block;
		color: var(--mut);
		font-weight: 400;
		font-size: 13px;
	}
	dd {
		margin: 4px 0 0;
	}
	.k {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-weight: 500;
	}
	.k li::before {
		content: '';
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-right: 7px;
		vertical-align: middle;
		border-radius: 50%;
		background: var(--c);
	}
	.more {
		display: inline-block;
		margin-top: 24px;
		padding: 4px 0 2px;
		font-weight: 700;
		border-bottom: 1.5px solid var(--c);
	}
	.more:hover {
		color: var(--c);
	}

	.scn {
		margin: 32px 0 12px;
		font: italic 300 clamp(26px, 3.6vw, 44px) / 1.15 Fraunces, serif;
		letter-spacing: -0.02em;
	}
	.sum {
		max-width: 46em;
		margin: 0;
		color: var(--mut);
	}
	.sum strong {
		color: var(--ink);
	}
	.foot {
		margin-top: 40px;
	}
	.btn {
		min-height: 48px;
		padding: 14px 24px;
		background: var(--rust);
		color: var(--inv);
		border: 0;
		border-radius: 4px;
		font: 700 16px 'DM Sans', sans-serif;
		cursor: pointer;
	}
	.btn:hover {
		background: var(--ink);
	}
	.note {
		margin: 24px 0 0;
		max-width: 44em;
		color: var(--mut);
		font-size: 14px;
	}
	main > .note {
		margin: 56px 0 72px;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
		* {
			animation: none !important;
			transition: none !important;
		}
	}

	@media (max-width: 900px) {
		.w {
			padding: 0 22px;
		}
		.cols,
		.grid {
			grid-template-columns: 1fr;
			gap: 36px;
		}
	}
</style>