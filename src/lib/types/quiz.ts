export type MascotEmote =
	'neutral' | 'happy' | 'correct' | 'wrong' | 'idea' | 'confused' | 'inspired' | 'gloomy';

export type MascotColor = 'blue' | 'pink' | 'green' | 'yellow';

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

export interface QuizState {
	currentQuestionIndex: number;
	selectedOptionId: string | null;
	isAnswerSubmitted: boolean;
	score: number;
	isCompleted: boolean;
}
