<script lang="ts">
	import { page } from '$app/stores';
	import { quizQuestions } from '$lib/data/quizQuestions';
	import Mascot from '$lib/components/Mascot.svelte';
	import type { MascotEmote, QuizState } from '$lib/types/quiz';
	import { resolveRoute } from '$app/paths';

	// Extract active theory filter from URL query param: /quiz?theory=operant-conditioning
	const activeTheoryId = $derived($page.url.searchParams.get('theory'));

	// Filter questions for the specific sandbox theory (or load all if no filter is provided)
	const activeQuestions = $derived(
		activeTheoryId
			? quizQuestions.filter((q) => q.theoryId === activeTheoryId)
			: quizQuestions
	);

	let quizState = $state<QuizState>({
		currentQuestionIndex: 0,
		selectedOptionId: null,
		isAnswerSubmitted: false,
		score: 0,
		isCompleted: false
	});

	const currentQuestion = $derived(
		activeQuestions[quizState.currentQuestionIndex] ?? activeQuestions[0]
	);

	// Reactive Mascot Emote & Speech
	const mascotEmote = $derived<MascotEmote>(
		quizState.isCompleted
			? quizState.score >= activeQuestions.length / 2
				? 'happy'
				: 'gloomy'
			: !quizState.isAnswerSubmitted
				? 'idea'
				: quizState.selectedOptionId === currentQuestion?.correctOptionId
					? 'correct'
					: 'wrong'
	);

	const mascotSpeech = $derived<string>(
		quizState.isCompleted
			? `Quiz complete! You scored ${quizState.score}/${activeQuestions.length}!`
			: !quizState.isAnswerSubmitted
				? currentQuestion?.mascotHint ?? 'Let’s test your knowledge!'
				: quizState.selectedOptionId === currentQuestion?.correctOptionId
					? 'Spot on! Great understanding!'
					: 'Not quite! Read the explanation below.'
	);

	function selectOption(optionId: string) {
		if (quizState.isAnswerSubmitted) return;
		quizState.selectedOptionId = optionId;
	}

	function submitAnswer() {
		if (!quizState.selectedOptionId || quizState.isAnswerSubmitted) return;

		quizState.isAnswerSubmitted = true;
		if (quizState.selectedOptionId === currentQuestion.correctOptionId) {
			quizState.score += 1;
		}
	}

	function nextQuestion() {
		if (quizState.currentQuestionIndex + 1 < activeQuestions.length) {
			quizState.currentQuestionIndex += 1;
			quizState.selectedOptionId = null;
			quizState.isAnswerSubmitted = false;
		} else {
			quizState.isCompleted = true;
		}
	}

	function restartQuiz() {
		quizState = {
			currentQuestionIndex: 0,
			selectedOptionId: null,
			isAnswerSubmitted: false,
			score: 0,
			isCompleted: false
		};
	}

	// Dynamic return URL back to the active sandbox or home
	const backToSandboxUrl = $derived(
		activeTheoryId
			? resolveRoute('/sandbox/[theoryId]', { theoryId: activeTheoryId })
			: '/'
	);
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<!-- Header -->
	<header class="flex items-center justify-between border-b pb-4">
		<div>
			<h1 class="text-3xl font-extrabold text-slate-900">
				{currentQuestion?.theoryTitle ?? 'Psychology'} Quiz
			</h1>
			<p class="text-sm text-slate-500">
				{activeTheoryId
					? `Targeted knowledge check for ${currentQuestion?.theoryTitle}`
					: 'Comprehensive psychology knowledge check'}
			</p>
		</div>
		<a
			href={backToSandboxUrl}
			class="rounded-lg border bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
		>
			← Back to Sandbox
		</a>
	</header>

	{#if activeQuestions.length === 0}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
			<p class="font-bold">No quiz questions found for this topic yet.</p>
			<script lang="ts">
	import { resolveRoute } from '$app/paths';
	// ... existing imports ...
</script>

<!-- Replace line 119 with this: -->
{#if activeQuestions.length === 0}
	<div class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
		<p class="font-bold">No quiz questions found for this topic yet.</p>
		<a href={resolveRoute('/')} class="mt-4 inline-block font-medium text-amber-800 underline">
			Return to Home
		</a>
	</div>
{/if}
		</div>
	{:else if !quizState.isCompleted}
		<!-- Main Quiz Flow -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Question & Options Card -->
			<div class="space-y-6 md:col-span-2">
				<!-- Progress bar -->
				<div class="space-y-2">
					<div class="flex justify-between text-xs font-semibold text-slate-500">
						<span>Question {quizState.currentQuestionIndex + 1} of {activeQuestions.length}</span>
						<span>Topic: {currentQuestion.theoryTitle}</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
						<div
							class="h-full bg-blue-600 transition-all duration-300"
							style="width: {((quizState.currentQuestionIndex + 1) / activeQuestions.length) * 100}%"
						></div>
					</div>
				</div>

				<!-- Question Card -->
				<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					<h2 class="text-lg font-bold text-slate-800">{currentQuestion.question}</h2>

					<!-- Options List -->
					<div class="mt-6 space-y-3">
						{#each currentQuestion.options as option (option.id)}
							{@const isSelected = quizState.selectedOptionId === option.id}
							{@const isCorrectOption = option.id === currentQuestion.correctOptionId}

							<button
								type="button"
								onclick={() => selectOption(option.id)}
								disabled={quizState.isAnswerSubmitted}
								class="w-full rounded-lg border p-4 text-left font-medium transition-all {isSelected
									? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
									: 'border-slate-200 bg-white hover:border-slate-300'} {quizState.isAnswerSubmitted &&
								isCorrectOption
									? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
									: ''} {quizState.isAnswerSubmitted && isSelected && !isCorrectOption
									? 'border-rose-500 bg-rose-50 text-rose-900'
									: ''}"
							>
								<div class="flex items-center justify-between">
									<span>{option.text}</span>
									{#if quizState.isAnswerSubmitted && isCorrectOption}
										<span class="text-xs font-bold text-emerald-600">✓ Correct</span>
									{:else if quizState.isAnswerSubmitted && isSelected && !isCorrectOption}
										<span class="text-xs font-bold text-rose-600">✕ Incorrect</span>
									{/if}
								</div>
							</button>
						{/each}
					</div>

					<!-- Submission & Next Buttons -->
					<div class="mt-6 flex justify-end">
						{#if !quizState.isAnswerSubmitted}
							<button
								type="button"
								onclick={submitAnswer}
								disabled={!quizState.selectedOptionId}
								class="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
							>
								Submit Answer
							</button>
						{:else}
							<button
								type="button"
								onclick={nextQuestion}
								class="rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white shadow hover:bg-slate-800"
							>
								{quizState.currentQuestionIndex + 1 === activeQuestions.length
									? 'See Quiz Results'
									: 'Next Question →'}
							</button>
						{/if}
					</div>
				</div>

				<!-- Explanation Box -->
				{#if quizState.isAnswerSubmitted}
					<div class="rounded-xl border border-blue-200 bg-blue-50/50 p-5 text-sm text-slate-800">
						<h3 class="font-bold text-blue-900">Explanation</h3>
						<p class="mt-1 leading-relaxed">{currentQuestion.explanation}</p>
					</div>
				{/if}
			</div>

			<!-- Mascot Sidebar -->
			<div class="flex flex-col items-center justify-start rounded-xl border bg-slate-50/50 p-6">
				<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Lab Assistant</h3>
				<div class="mt-8">
					<Mascot emote={mascotEmote} speechText={mascotSpeech} color="blue" size="lg" />
				</div>
			</div>
		</div>
	{:else}
		<!-- Quiz Completed Results -->
		<div class="space-y-6 text-center">
			<div class="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm space-y-4">
				<Mascot emote={mascotEmote} speechText={mascotSpeech} color="pink" size="lg" />

				<h2 class="text-2xl font-bold text-slate-900">Quiz Completed!</h2>
				<p class="text-4xl font-extrabold text-blue-600">
					{quizState.score} / {activeQuestions.length}
				</p>

				<div class="pt-4 flex justify-center gap-3">
					<button
						type="button"
						onclick={restartQuiz}
						class="rounded-lg border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
					>
						Retake Quiz
					</button>
					<a
						href={backToSandboxUrl}
						class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
					>
						Return to Sandbox
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>