<script lang="ts">
	interface Question {
		id: string;
		prompt: string;
		options: string[];
		correctIndex: number;
		explanation: string;
	}

	let { questions = [] }: { questions: Question[] } = $props();

	let currentIndex = $state(0);
	let selectedOption = $state<number | null>(null);
	let isSubmitted = $state(false);
	let score = $state(0);
	let isComplete = $state(false);

	const currentQuestion = $derived(questions[currentIndex]);

	function selectAnswer(index: number) {
		if (!isSubmitted) {
			selectedOption = index;
		}
	}

	function submitAnswer() {
		if (selectedOption === null) return;
		isSubmitted = true;
		if (selectedOption === currentQuestion.correctIndex) {
			score += 1;
		}
	}

	function nextQuestion() {
		if (currentIndex + 1 < questions.length) {
			currentIndex += 1;
			selectedOption = null;
			isSubmitted = false;
		} else {
			isComplete = true;
		}
	}

	function resetQuiz() {
		currentIndex = 0;
		selectedOption = null;
		isSubmitted = false;
		score = 0;
		isComplete = false;
	}
</script>

<div class="rounded-lg border bg-card p-6 shadow-sm">
	{#if !isComplete && currentQuestion}
		<div class="space-y-4">
			<div class="flex justify-between text-sm text-muted-foreground">
				<span>Question {currentIndex + 1} of {questions.length}</span>
				<span>Score: {score}</span>
			</div>

			<h3 class="text-lg font-semibold">{currentQuestion.prompt}</h3>

			<div class="space-y-2">
				{#each currentQuestion.options as option, index}
					<button
						type="button"
						onclick={() => selectAnswer(index)}
						disabled={isSubmitted}
						class="w-full rounded-md border p-3 text-left text-sm transition-colors {selectedOption === index
							? 'border-primary bg-primary/10 font-medium'
							: 'hover:bg-muted'}"
					>
						{option}
					</button>
				{/each}
			</div>

			{#if !isSubmitted}
				<button
					type="button"
					onclick={submitAnswer}
					disabled={selectedOption === null}
					class="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
				>
					Submit Answer
				</button>
			{:else}
				<div class="space-y-3 rounded-md p-4 {selectedOption === currentQuestion.correctIndex ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}">
					<p class="font-bold">
						{selectedOption === currentQuestion.correctIndex ? 'Correct!' : 'Incorrect'}
					</p>
					<p class="text-sm">{currentQuestion.explanation}</p>
				</div>

				<button
					type="button"
					onclick={nextQuestion}
					class="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground"
				>
					{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
				</button>
			{/if}
		</div>
	{:else if isComplete}
		<div class="space-y-4 text-center">
			<h3 class="text-2xl font-bold">Quiz Complete!</h3>
			<p class="text-muted-foreground">
				You scored <span class="font-bold text-foreground">{score}</span> out of {questions.length} ({Math.round((score / questions.length) * 100)}%).
			</p>
			<button
				type="button"
				onclick={resetQuiz}
				class="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
			>
				Restart Quiz
			</button>
		</div>
	{/if}
</div>