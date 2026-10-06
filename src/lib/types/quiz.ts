export type MascotState =
	| 'intro' // excited welcome
	| 'idle' // neutral, waiting
	| 'thinking' // nervous / curious while the learner weighs options
	| 'correct' // happy
	| 'wrong' // sad
	| 'confused' // second miss in a row
	| 'celebrate' // surprise + confetti
	| 'sad'; // low score at the end

export interface QuizOption {
	id: string;
	text: string;
}

export interface Question {
	id: string;
	theoryId: 'operant-conditioning' | 'ebbinghaus-curve';
	theoryTitle: string;
	question: string;
	options: QuizOption[];
	correctOptionId: string;
	explanation: string;
	mascotHint: string;
}

export interface AnswerRecord {
	questionId: string;
	selectedOptionId: string;
	correct: boolean;
}
