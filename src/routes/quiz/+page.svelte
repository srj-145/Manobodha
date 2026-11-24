<script lang="ts">
	import { page } from '$app/state';
	import { resolveRoute } from '$app/paths';
	import { quizQuestions } from '$lib/data/quizQuestions';
	import Mascot from '$lib/components/Mascot.svelte';
	import type { AnswerRecord, MascotState, Question } from '$lib/types/quiz';

	const THEORY_ORDER = ['operant-conditioning', 'ebbinghaus-curve'] as const;

	// /quiz?theory=operant-conditioning narrows the pool; no param = every theory.
	const theoryId = $derived(page.url.searchParams.get('theory'));
	const pool = $derived(theoryId ? quizQuestions.filter((q) => q.theoryId === theoryId) : quizQuestions);
	const poolTitle = $derived(
		theoryId ? (pool[0]?.theoryTitle ?? 'Psychology') : 'Psychology'
	);

	// A session holds 5 to 10 questions. Offer the sizes the pool can actually fill.
	const MAX_LEN = 10;
	const MIN_LEN = 5;
	const lengthOptions = $derived.by(() => {
		const cap = Math.min(MAX_LEN, pool.length);
		if (cap < 1) return [] as number[];
		const sizes = [5, 8, 10].filter((n) => n < cap);
		sizes.push(cap);
		return [...new Set(sizes)].filter((n) => n >= Math.min(MIN_LEN, cap));
	});

	type Phase = 'intro' | 'quiz' | 'done';
	let phase = $state<Phase>('intro');
	let sessionLength = $state(0);
	let deck = $state<Question[]>([]);
	let index = $state(0);
	let selectedId = $state<string | null>(null);
	let answers = $state<AnswerRecord[]>([]);
	let hovering = $state(false);
	let wrongStreak = $state(0);
	let startedAt = $state(0);
	let elapsedMs = $state(0);

	// Keep the chosen length valid when the pool changes (e.g. navigating between ?theory= links).
	$effect(() => {
		if (!lengthOptions.includes(sessionLength)) {
			sessionLength = lengthOptions[lengthOptions.length - 1] ?? 0;
		}
	});

	const question = $derived(deck[index]);
	const answered = $derived(selectedId !== null);
	const isCorrect = $derived(answered && selectedId === question?.correctOptionId);
	const score = $derived(answers.filter((a) => a.correct).length);
	const percent = $derived(deck.length ? Math.round((score / deck.length) * 100) : 0);
	const isLast = $derived(index === deck.length - 1);

	function shuffle<T>(arr: T[]): T[] {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function start() {
		if (!sessionLength) return;
		deck = shuffle(pool).slice(0, sessionLength);
		index = 0;
		selectedId = null;
		answers = [];
		wrongStreak = 0;
		hovering = false;
		startedAt = Date.now();
		elapsedMs = 0;
		phase = 'quiz';
	}

	function choose(optionId: string) {
		if (answered || !question) return;
		selectedId = optionId;
		const correct = optionId === question.correctOptionId;
		answers = [...answers, { questionId: question.id, selectedOptionId: optionId, correct }];
		wrongStreak = correct ? 0 : wrongStreak + 1;
	}

	function next() {
		if (!answered) return;
		if (isLast) {
			elapsedMs = Date.now() - startedAt;
			phase = 'done';
			return;
		}
		index += 1;
		selectedId = null;
		hovering = false;
	}

	// Live timer while a quiz is running
	$effect(() => {
		if (phase !== 'quiz') return;
		const id = setInterval(() => (elapsedMs = Date.now() - startedAt), 500);
		return () => clearInterval(id);
	});

	function fmt(ms: number) {
		const s = Math.max(0, Math.round(ms / 1000));
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
	}

	// Keyboard: 1-4 picks an option, Enter / Space moves on
	function onKey(e: KeyboardEvent) {
		if (phase !== 'quiz' || !question) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		const n = Number(e.key);
		if (n >= 1 && n <= question.options.length && !answered) {
			choose(question.options[n - 1].id);
		} else if (e.key === 'Enter' && answered && !(e.target instanceof HTMLButtonElement)) {
			next();
		}
	}

	// ---------- Mascot state + speech ----------
	const CORRECT_LINES = [
		'Spot on! You nailed it!',
		'Yes! That is exactly right!',
		'Brilliant! Keep that momentum!',
		'Correct! Your brain is on fire!'
	];
	const STREAK_LINE = 'Another one! You are on a roll!';

	const mascotState = $derived<MascotState>(
		phase === 'intro'
			? 'intro'
			: phase === 'done'
				? percent >= 50
					? 'celebrate'
					: 'sad'
				: answered
					? isCorrect
						? 'correct'
						: wrongStreak >= 2
							? 'confused'
							: 'wrong'
					: hovering
						? 'thinking'
						: 'idle'
	);

	const correctStreak = $derived.by(() => {
		let n = 0;
		for (let i = answers.length - 1; i >= 0 && answers[i].correct; i--) n++;
		return n;
	});

	const progressNote = $derived.by(() => {
		if (!deck.length) return '';
		const remaining = deck.length - index - 1;
		if (remaining === 0) return 'Last one! Finish strong!';
		if (index + 1 === Math.ceil(deck.length / 2) && deck.length >= 5) {
			return 'You are halfway there! Keep it up!';
		}
		return '';
	});

	const speech = $derived.by(() => {
		if (phase === 'intro') {
			return pool.length
				? 'Hi, I am your lab buddy! Ready to test what you learned?'
				: 'Hmm, nothing to quiz on here yet.';
		}
		if (phase === 'done') {
			if (percent === 100) return 'Perfect score! I am amazed!';
			if (percent >= 70) return `Fantastic! ${score} out of ${deck.length}!`;
			if (percent >= 50) return `Nice work, ${score} of ${deck.length}! One more go for a perfect run?`;
			return 'Good effort! Peek at the sandbox again, then retake. You will get it!';
		}
		if (answered) {
			if (isCorrect) {
				return correctStreak >= 3 ? STREAK_LINE : CORRECT_LINES[index % CORRECT_LINES.length];
			}
			return wrongStreak >= 2
				? 'Hmm, tricky ones! Read the explanation. It will click!'
				: 'Nice try! Give it another go on the next one!';
		}
		if (hovering) return 'Take your time... trust your instincts!';
		return progressNote || question?.mascotHint || 'Let us test your knowledge!';
	});

	// ---------- Links ----------
	const backHref = $derived(
		theoryId ? resolveRoute('/sandbox/[theoryId]', { theoryId }) : resolveRoute('/explore')
	);
	const nextTheory = $derived.by(() => {
		const i = THEORY_ORDER.findIndex((t) => t === theoryId);
		return THEORY_ORDER[(i + 1) % THEORY_ORDER.length];
	});
	const nextQuizHref = $derived(`${resolveRoute('/quiz')}?theory=${nextTheory}`);

	const progressPct = $derived(
		deck.length ? ((index + (answered ? 1 : 0)) / deck.length) * 100 : 0
	);
	const optionLetter = (i: number) => String.fromCharCode(65 + i);
	const questionFor = (id: string) => deck.find((q) => q.id === id);
</script>

<svelte:window onkeydown={onKey} />
<svelte:head><title>{poolTitle} Quiz · Manobodha</title></svelte:head>

<main class="qz">
	<header class="qz-head">
		<div>
			<p class="eyebrow">04 · Recall</p>
			<h1>{poolTitle} quiz</h1>
		</div>
		<a class="ghost" href={backHref}>← Back</a>
	</header>

	<div class="split">
		<!-- LEFT: sticky mascot stage -->
		<aside class="stage-col" aria-label="Quiz companion">
			<div class="stage-card">
				<Mascot mood={mascotState} {speech} />
				{#if phase === 'quiz'}
					<div class="chips" aria-hidden="true">
						<span class="chip">Score <b>{score}</b></span>
						<span class="chip">Time <b>{fmt(elapsedMs)}</b></span>
					</div>
				{/if}
			</div>
		</aside>

		<!-- RIGHT: dynamic quiz container -->
		<section class="quiz-col">
			{#if phase === 'intro'}
				<div class="card intro">
					{#if pool.length === 0}
						<h2>No questions for this topic yet</h2>
						<p class="lead">Try another topic while we write more.</p>
						<a class="btn primary" href={resolveRoute('/explore')}>Explore topics</a>
					{:else}
						<h2>Ready to recall?</h2>
						<p class="lead">
							One question at a time, instant feedback, and a short explanation after every answer.
							{#if theoryId}Questions come from <b>{poolTitle}</b>.{:else}Questions are mixed from
								every sandbox.{/if}
						</p>

						{#if lengthOptions.length > 1}
							<fieldset class="lengths">
								<legend>Number of questions</legend>
								{#each lengthOptions as n (n)}
									<label class:on={sessionLength === n}>
										<input type="radio" name="len" value={n} bind:group={sessionLength} />
										{n}
									</label>
								{/each}
							</fieldset>
						{/if}

						<button class="btn primary" type="button" onclick={start}>
							Start quiz · {sessionLength} questions →
						</button>
						<p class="hint">Tip: press 1 to 4 to answer, Enter to continue.</p>
					{/if}
				</div>
			{:else if phase === 'quiz' && question}
				<div class="progress-block">
					<div class="progress-meta">
						<span>Question {index + 1} of {deck.length}</span>
						<span>{question.theoryTitle}</span>
					</div>
					<div
						class="bar"
						role="progressbar"
						aria-valuemin="0"
						aria-valuemax={deck.length}
						aria-valuenow={index + (answered ? 1 : 0)}
						aria-label="Quiz progress"
					>
						<i style="width:{progressPct}%"></i>
					</div>
				</div>

				{#key question.id}
					<div class="card q-card">
						<h2 class="q">{question.question}</h2>

						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<div
							class="options"
							role="group"
							aria-label="Answer options"
							onpointerenter={() => !answered && (hovering = true)}
							onpointerleave={() => (hovering = false)}
							onfocusin={() => !answered && (hovering = true)}
							onfocusout={() => (hovering = false)}
						>
							{#each question.options as option, i (option.id)}
								{@const isPicked = selectedId === option.id}
								{@const isRight = option.id === question.correctOptionId}
								<button
									type="button"
									class="opt"
									class:right={answered && isRight}
									class:wrong={answered && isPicked && !isRight}
									class:dim={answered && !isRight && !isPicked}
									disabled={answered}
									aria-pressed={isPicked}
									onclick={() => choose(option.id)}
								>
									<span class="key">{optionLetter(i)}</span>
									<span class="txt">{option.text}</span>
									{#if answered && isRight}
										<span class="tag good">✓ Correct</span>
									{:else if answered && isPicked}
										<span class="tag bad">✕ Your answer</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/key}

				{#if answered}
					<div class="explain" class:good={isCorrect} class:bad={!isCorrect} aria-live="polite">
						<h3>{isCorrect ? 'Why that works' : 'Here is the idea'}</h3>
						<p>{question.explanation}</p>
					</div>
					<div class="actions">
						<button class="btn primary" type="button" onclick={next}>
							{isLast ? 'See my results' : 'Next question →'}
						</button>
					</div>
				{/if}
			{:else if phase === 'done'}
				<div class="card results">
					<h2>Quiz complete</h2>
					<div class="stats">
						<div class="stat big">
							<b>{score}<small>/{deck.length}</small></b>
							<span>Score</span>
						</div>
						<div class="stat"><b>{percent}%</b><span>Accuracy</span></div>
						<div class="stat"><b>{fmt(elapsedMs)}</b><span>Time taken</span></div>
					</div>

					<h3 class="sum-title">Your answers</h3>
					<ol class="summary">
						{#each answers as a, i (a.questionId)}
							{@const q = questionFor(a.questionId)}
							{#if q}
								<li class:ok={a.correct}>
									<span class="mark" aria-label={a.correct ? 'Correct' : 'Incorrect'}>
										{a.correct ? '✓' : '✕'}
									</span>
									<div>
										<p class="sq">{i + 1}. {q.question}</p>
										{#if !a.correct}
											<p class="sa">
												You chose: {q.options.find((o) => o.id === a.selectedOptionId)?.text}
											</p>
										{/if}
										<p class="sa good">
											Answer: {q.options.find((o) => o.id === q.correctOptionId)?.text}
										</p>
									</div>
								</li>
							{/if}
						{/each}
					</ol>

					<div class="actions end">
						<button class="btn" type="button" onclick={start}>↻ Retake quiz</button>
						<a class="btn primary" href={nextQuizHref} data-sveltekit-reload>Next quiz →</a>
					</div>
				</div>
			{/if}
		</section>
	</div>
</main>

<style>
	.qz {
		max-width: var(--page-max, 1160px);
		margin: 0 auto;
		padding: 36px var(--page-pad, 28px) 96px;
		font-family: 'DM Sans', system-ui, sans-serif;
		color: var(--ink);
	}
	.qz-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 22px;
		margin-bottom: 30px;
		border-bottom: 1px solid var(--line);
	}
	.eyebrow {
		margin: 0 0 4px;
		font: 600 12px/1 'DM Sans', sans-serif;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--sage);
	}
	h1 {
		margin: 0;
		font: 400 clamp(30px, 4vw, 42px) / 1.1 Fraunces, Georgia, serif;
		letter-spacing: -0.01em;
	}
	.ghost {
		font-size: 14px;
		font-weight: 600;
		color: var(--ink);
		text-decoration: none;
		padding: 9px 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		white-space: nowrap;
		transition: background 0.2s;
	}
	.ghost:hover {
		background: var(--pap);
	}

	/* ---------- Split screen: ~38% / 62% ---------- */
	.split {
		display: grid;
		grid-template-columns: minmax(0, 38fr) minmax(0, 62fr);
		gap: 36px;
		align-items: start;
	}
	.stage-col {
		position: sticky;
		top: calc(var(--nav-h, 64px) + 24px);
	}
	.stage-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		padding: 26px 22px 24px;
		border: 1px solid var(--line);
		border-radius: 28px;
		background:
			radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, var(--blue) 16%, transparent), transparent 70%),
			var(--pap);
		box-shadow: 0 24px 50px -30px color-mix(in srgb, var(--ink) 45%, transparent);
	}
	.chips {
		display: flex;
		gap: 10px;
	}
	.chip {
		padding: 6px 14px;
		border-radius: 999px;
		background: var(--bg);
		border: 1px solid var(--line);
		font-size: 13px;
		color: var(--mut);
	}
	.chip b {
		color: var(--ink);
		margin-left: 4px;
		font-variant-numeric: tabular-nums;
	}

	/* ---------- Cards ---------- */
	.quiz-col {
		display: flex;
		flex-direction: column;
		gap: 18px;
		min-width: 0;
	}
	.card {
		background: var(--pap);
		border: 1px solid var(--line);
		border-radius: 24px;
		padding: clamp(22px, 3vw, 34px);
		box-shadow: 0 18px 40px -30px color-mix(in srgb, var(--ink) 45%, transparent);
		animation: slide-in 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) both;
	}
	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	h2 {
		margin: 0 0 12px;
		font: 400 28px/1.2 Fraunces, Georgia, serif;
	}
	.lead {
		margin: 0 0 22px;
		color: var(--mut);
		font-size: 16px;
	}
	.hint {
		margin: 14px 0 0;
		font-size: 13px;
		color: var(--mut);
	}

	/* ---------- Buttons ---------- */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 13px 24px;
		border-radius: 999px;
		border: 1.5px solid var(--ink);
		background: transparent;
		color: var(--ink);
		font: 600 15px/1 'DM Sans', sans-serif;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.15s,
			background 0.2s,
			box-shadow 0.2s;
	}
	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 18px -10px color-mix(in srgb, var(--ink) 60%, transparent);
	}
	.btn.primary {
		background: var(--ink);
		color: var(--inv);
	}

	/* ---------- Length picker ---------- */
	.lengths {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0 0 22px;
		padding: 0;
		border: 0;
	}
	.lengths legend {
		float: left;
		margin-right: 12px;
		padding: 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--mut);
	}
	.lengths label {
		position: relative;
		min-width: 48px;
		padding: 9px 16px;
		text-align: center;
		border: 1.5px solid var(--line);
		border-radius: 999px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	.lengths label:hover {
		border-color: var(--ink);
	}
	.lengths label.on {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--inv);
	}
	.lengths input {
		position: absolute;
		opacity: 0;
		inset: 0;
		cursor: pointer;
	}
	.lengths label:has(input:focus-visible) {
		outline: 2px solid var(--rust);
		outline-offset: 3px;
	}

	/* ---------- Progress ---------- */
	.progress-meta {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 13px;
		font-weight: 600;
		color: var(--mut);
	}
	.bar {
		height: 10px;
		border-radius: 999px;
		background: var(--line);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--sage), var(--blue));
		transition: width 0.5s cubic-bezier(0.3, 0.9, 0.3, 1);
	}

	/* ---------- Question + options ---------- */
	.q {
		margin: 0 0 24px;
		font: 400 clamp(21px, 2.4vw, 26px) / 1.3 Fraunces, Georgia, serif;
	}
	.options {
		display: grid;
		gap: 12px;
	}
	.opt {
		display: flex;
		align-items: center;
		gap: 14px;
		width: 100%;
		padding: 15px 18px;
		text-align: left;
		background: var(--bg);
		color: var(--ink);
		border: 1.5px solid var(--line);
		border-radius: 16px;
		font: 500 16px/1.4 'DM Sans', sans-serif;
		cursor: pointer;
		transition:
			transform 0.18s,
			border-color 0.2s,
			background 0.25s,
			box-shadow 0.2s,
			opacity 0.25s;
	}
	.opt:not(:disabled):hover {
		transform: translateX(5px);
		border-color: var(--blue);
		box-shadow: 0 10px 22px -14px color-mix(in srgb, var(--blue) 80%, transparent);
	}
	.opt:not(:disabled):active {
		transform: scale(0.99);
	}
	.opt:disabled {
		cursor: default;
	}
	.key {
		flex: none;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 10px;
		background: var(--pap);
		border: 1px solid var(--line);
		font-size: 13px;
		font-weight: 700;
		color: var(--mut);
	}
	.txt {
		flex: 1;
	}
	.tag {
		flex: none;
		font-size: 12px;
		font-weight: 700;
		white-space: nowrap;
	}
	.opt.right {
		background: color-mix(in srgb, var(--sage) 22%, var(--bg));
		border-color: var(--sage);
		animation: gentle-pulse 0.6s ease-out;
	}
	.opt.right .key {
		background: var(--sage);
		border-color: var(--sage);
		color: #fff;
	}
	.opt.wrong {
		background: color-mix(in srgb, var(--rust) 18%, var(--bg));
		border-color: var(--rust);
		animation: nudge 0.5s ease-in-out;
	}
	.opt.wrong .key {
		background: var(--rust);
		border-color: var(--rust);
		color: #fff;
	}
	.opt.dim {
		opacity: 0.55;
	}
	.tag.good {
		color: var(--sage);
	}
	.tag.bad {
		color: var(--rust);
	}
	@keyframes gentle-pulse {
		0% {
			transform: scale(1);
		}
		45% {
			transform: scale(1.02);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes nudge {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-6px);
		}
		75% {
			transform: translateX(6px);
		}
	}

	/* ---------- Explanation ---------- */
	.explain {
		padding: 18px 22px;
		border-radius: 20px;
		border: 1px solid var(--line);
		border-left-width: 5px;
		background: var(--pap);
		animation: slide-in 0.35s ease-out both;
	}
	.explain.good {
		border-left-color: var(--sage);
	}
	.explain.bad {
		border-left-color: var(--rust);
	}
	.explain h3 {
		margin: 0 0 6px;
		font-size: 13px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mut);
	}
	.explain p {
		margin: 0;
		font-size: 16px;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
	}
	.actions.end {
		justify-content: flex-start;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 26px;
	}

	/* ---------- Results ---------- */
	.stats {
		display: grid;
		grid-template-columns: 1.2fr 1fr 1fr;
		gap: 12px;
		margin: 6px 0 26px;
	}
	.stat {
		padding: 16px 18px;
		border-radius: 18px;
		background: var(--bg);
		border: 1px solid var(--line);
	}
	.stat b {
		display: block;
		font: 400 32px/1.1 Fraunces, Georgia, serif;
		font-variant-numeric: tabular-nums;
	}
	.stat.big b {
		color: var(--rust);
		font-size: 42px;
	}
	.stat small {
		font-size: 0.55em;
		color: var(--mut);
	}
	.stat span {
		font-size: 13px;
		color: var(--mut);
	}
	.sum-title {
		margin: 0 0 12px;
		font-size: 13px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mut);
	}
	.summary {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	.summary li {
		display: flex;
		gap: 14px;
		padding: 12px 14px;
		border-radius: 14px;
		background: color-mix(in srgb, var(--rust) 10%, var(--bg));
		border: 1px solid color-mix(in srgb, var(--rust) 35%, var(--line));
	}
	.summary li.ok {
		background: color-mix(in srgb, var(--sage) 14%, var(--bg));
		border-color: color-mix(in srgb, var(--sage) 40%, var(--line));
	}
	.mark {
		flex: none;
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--rust);
		color: #fff;
		font-size: 13px;
		font-weight: 700;
	}
	.ok .mark {
		background: var(--sage);
	}
	.sq {
		margin: 0 0 2px;
		font-weight: 600;
		font-size: 15px;
	}
	.sa {
		margin: 0;
		font-size: 14px;
		color: var(--mut);
	}
	.sa.good {
		color: var(--sage);
		font-weight: 600;
	}

	/* ---------- Mobile: mascot on top, quiz below ---------- */
	@media (max-width: 900px) {
		.split {
			grid-template-columns: 1fr;
			gap: 22px;
		}
		.stage-col {
			position: static;
		}
		.stage-card {
			padding: 16px 16px 18px;
		}
		.stage-card :global(.mascot-box) {
			width: min(100%, 250px);
		}
		.stats {
			grid-template-columns: 1fr 1fr;
		}
		.stat.big {
			grid-column: 1 / -1;
		}
		.opt:not(:disabled):hover {
			transform: none;
		}
	}
	@media (max-width: 520px) {
		.qz-head {
			align-items: flex-start;
			flex-direction: column;
		}
		.tag {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.explain,
		.opt,
		.opt.right,
		.opt.wrong,
		.bar i {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
