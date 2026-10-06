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
			{
				id: 'a',
				text: 'They reset retention to ~100% and flatten the decay slope (increase stability)'
			},
			{ id: 'b', text: 'They cause retroactive interference and accelerate forgetting' },
			{ id: 'c', text: 'They have no mathematical effect on memory stability' },
			{ id: 'd', text: 'They only work if conducted 100 times back-to-back' }
		],
		correctOptionId: 'a',
		explanation:
			'Each spaced review restores memory retention to ~100% and increases memory durability ($S$), making subsequent decay significantly slower.',
		mascotHint: 'Every time you review, the slope gets flatter and flatter!'
	},
	{
		id: 'q5',
		theoryId: 'operant-conditioning',
		theoryTitle: 'Operant Conditioning',
		question: 'Which psychologist is most closely associated with operant conditioning and the "Skinner box"?',
		options: [
			{ id: 'a', text: 'Ivan Pavlov' },
			{ id: 'b', text: 'B.F. Skinner' },
			{ id: 'c', text: 'Hermann Ebbinghaus' },
			{ id: 'd', text: 'Albert Bandura' }
		],
		correctOptionId: 'b',
		explanation:
			'B.F. Skinner built on Thorndike\'s Law of Effect and used controlled chambers (Skinner boxes) to study how consequences shape voluntary behaviour.',
		mascotHint: 'The box is named after him. Who could it be?'
	},
	{
		id: 'q6',
		theoryId: 'operant-conditioning',
		theoryTitle: 'Operant Conditioning',
		question: 'What defines negative reinforcement?',
		options: [
			{ id: 'a', text: 'Adding an unpleasant stimulus to decrease a behaviour' },
			{ id: 'b', text: 'Removing a pleasant stimulus to decrease a behaviour' },
			{ id: 'c', text: 'Removing an unpleasant stimulus to increase a behaviour' },
			{ id: 'd', text: 'Adding a pleasant stimulus to increase a behaviour' }
		],
		correctOptionId: 'c',
		explanation:
			'"Negative" means something is taken away, and "reinforcement" means the behaviour becomes more likely. Taking painkillers to end a headache is a classic example.',
		mascotHint: 'Negative here means "removed", not "bad".'
	},
	{
		id: 'q7',
		theoryId: 'operant-conditioning',
		theoryTitle: 'Operant Conditioning',
		question: 'What is the key difference between punishment and reinforcement?',
		options: [
			{ id: 'a', text: 'Punishment decreases a behaviour; reinforcement increases it' },
			{ id: 'b', text: 'Punishment is always physical; reinforcement is always verbal' },
			{ id: 'c', text: 'Punishment works instantly; reinforcement never does' },
			{ id: 'd', text: 'They are two names for the same process' }
		],
		correctOptionId: 'a',
		explanation:
			'Both can use positive (adding) or negative (removing) stimuli. What separates them is the effect on future behaviour: reinforcement strengthens it, punishment weakens it.',
		mascotHint: 'Ask yourself: does the behaviour become more or less likely?'
	},
	{
		id: 'q8',
		theoryId: 'operant-conditioning',
		theoryTitle: 'Operant Conditioning',
		question: 'What response pattern is typical of a Fixed Interval (FI) schedule?',
		options: [
			{ id: 'a', text: 'A steady, unbroken rate of responding' },
			{ id: 'b', text: 'A "scallop": a pause after reinforcement, then speeding up as the next one nears' },
			{ id: 'c', text: 'Responding stops completely after the first reward' },
			{ id: 'd', text: 'Random bursts with no pattern' }
		],
		correctOptionId: 'b',
		explanation:
			'Because the reward only becomes available after a set time, responding drops right after reinforcement and then accelerates toward the end of the interval, which draws a scalloped curve.',
		mascotHint: 'Think of checking the clock as the end of a shift approaches.'
	},
	{
		id: 'q9',
		theoryId: 'ebbinghaus-curve',
		theoryTitle: 'Ebbinghaus Forgetting Curve',
		question: 'What kind of material did Ebbinghaus memorise to avoid the effect of prior knowledge?',
		options: [
			{ id: 'a', text: 'Poetry' },
			{ id: 'b', text: 'Meaningless nonsense syllables' },
			{ id: 'c', text: 'Faces of strangers' },
			{ id: 'd', text: 'Historical dates' }
		],
		correctOptionId: 'b',
		explanation:
			'Ebbinghaus used consonant-vowel-consonant nonsense syllables (such as "WID" or "ZOF") so that existing meaning and associations could not help him remember.',
		mascotHint: 'He wanted material with no meaning at all.'
	},
	{
		id: 'q10',
		theoryId: 'ebbinghaus-curve',
		theoryTitle: 'Ebbinghaus Forgetting Curve',
		question: 'What does the "savings method" measure?',
		options: [
			{ id: 'a', text: 'How much effort is saved when relearning material compared with learning it the first time' },
			{ id: 'b', text: 'How much money a student saves on tutoring' },
			{ id: 'c', text: 'How many items can be held in short-term memory' },
			{ id: 'd', text: 'How quickly sleep consolidates new memories' }
		],
		correctOptionId: 'a',
		explanation:
			'Ebbinghaus compared the time or repetitions needed to relearn a list with the original learning. Any reduction showed that some trace of the memory remained, even if it could not be recalled.',
		mascotHint: 'Relearning is faster than learning from scratch. Why?'
	},
	{
		id: 'q11',
		theoryId: 'ebbinghaus-curve',
		theoryTitle: 'Ebbinghaus Forgetting Curve',
		question: 'Which study pattern generally gives better long-term retention?',
		options: [
			{ id: 'a', text: 'Cramming everything in one long session (massed practice)' },
			{ id: 'b', text: 'Reviewing only once, the night before a test' },
			{ id: 'c', text: 'Short sessions spread over several days (distributed practice)' },
			{ id: 'd', text: 'Rereading the same page without breaks' }
		],
		correctOptionId: 'c',
		explanation:
			'This is the spacing effect. Spreading reviews over time gives each memory a chance to start fading, and recalling it then strengthens it more than another back-to-back pass.',
		mascotHint: 'Remember the sandbox: well-timed reviews beat one marathon.'
	},
	{
		id: 'q12',
		theoryId: 'ebbinghaus-curve',
		theoryTitle: 'Ebbinghaus Forgetting Curve',
		question: 'Which of these slows the rate of forgetting?',
		options: [
			{ id: 'a', text: 'Making material meaningful and linking it to what you already know' },
			{ id: 'b', text: 'Studying while exhausted' },
			{ id: 'c', text: 'Memorising in a rush without understanding' },
			{ id: 'd', text: 'Avoiding any review' }
		],
		correctOptionId: 'a',
		explanation:
			'Meaningful, well-connected material has higher memory strength, so its curve decays more slowly. Nonsense syllables, the hardest case, fade fastest.',
		mascotHint: 'Connections make memories stick.'
	}
];
