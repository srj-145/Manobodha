import type { Question } from '$lib/types/quiz';

export const quizQuestions: Question[] = [
	{
		id: 'q1',
		theoryId: 'operant-conditioning',
		theoryTitle: 'Operant Conditioning',
		question:
			'Which schedule of reinforcement produces a steady, high response rate with almost no post-reinforcement pause?',
		options: [
			{ id: 'a', text: 'Fixed Interval (FI)' },
			{ id: 'b', text: 'Variable Ratio (VR)' },
			{ id: 'c', text: 'Fixed Ratio (FR)' },
			{ id: 'd', text: 'Variable Interval (VI)' }
		],
		correctOptionId: 'b',
		explanation:
			'Variable Ratio (VR) schedules deliver reinforcement after an unpredictable number of responses (like slot machines), resulting in persistent, rapid responding with no pause.',
		mascotHint: 'Think about gambling! Which schedule keeps people pulling the lever endlessly?'
	},
	{
		id: 'q2',
		theoryId: 'operant-conditioning',
		theoryTitle: 'Operant Conditioning',
		question:
			'What happens to cumulative responses during an Extinction Phase in Operant Conditioning?',
		options: [
			{ id: 'a', text: 'Response rate increases exponentially' },
			{ id: 'b', text: 'Response rate drops immediately to zero' },
			{ id: 'c', text: 'Response rate temporarily spikes (burst), then gradually flattens' },
			{ id: 'd', text: 'Response rate continues unchanged forever' }
		],
		correctOptionId: 'c',
		explanation:
			'When reinforcement stops, organisms often experience an "extinction burst" (a brief spike in effort) before the response rate gradually declines to baseline.',
		mascotHint:
			'When a vending machine eats your dollar, do you press the button faster first before giving up?'
	},
	{
		id: 'q3',
		theoryId: 'ebbinghaus-curve',
		theoryTitle: 'Ebbinghaus Forgetting Curve',
		question: 'According to Ebbinghaus, when does the steepest rate of memory decay occur?',
		options: [
			{ id: 'a', text: 'Immediately within the first hour/day after learning' },
			{ id: 'b', text: 'After 30 days of inactivity' },
			{ id: 'c', text: 'Uniformly across all time periods' },
			{ id: 'd', text: 'Only during sleep cycles' }
		],
		correctOptionId: 'a',
		explanation:
			'The Ebbinghaus retention curve decays exponentially. Over 50% of newly learned information is lost within the first day unless active review occurs.',
		mascotHint: 'Notice the sharp cliff at Day 1 on our Memory Graph!'
	},
	{
		id: 'q4',
		theoryId: 'ebbinghaus-curve',
		theoryTitle: 'Ebbinghaus Forgetting Curve',
		question: 'How do spaced repetition review sessions impact the retention curve over time?',
		options: [
			{ id: 'a', text: 'They reset retention to ~100% and flatten the decay slope (increase stability)' },
			{ id: 'b', text: 'They cause retroactive interference and accelerate forgetting' },
			{ id: 'c', text: 'They have no mathematical effect on memory stability' },
			{ id: 'd', text: 'They only work if conducted 100 times back-to-back' }
		],
		correctOptionId: 'a',
		explanation:
			'Each spaced review restores memory retention to ~100% and increases memory durability ($S$), making subsequent decay significantly slower.',
		mascotHint: 'Every time you review, the slope gets flatter and flatter!'
	}
];