// src/lib/data/compareData.ts

export interface Theory {
	id: string;
	name: string;
	short: string;
	hue: number; // colour is derived from this in the page CSS
	thinkers: string;
	question: string;
	constructs: string[];
	learner: string;
	intervention: string;
	limits: string;
	/** Matches a sandbox/[theoryId] route. If absent, the card links to the Theory Map. */
	sandboxId?: string;
}

export interface Lens {
	sees: string;
	does: string;
}

export interface Scenario {
	id: string;
	label: string;
	text: string;
	tension: string;
	lenses: Partial<Record<string, Lens>>;
}

export const theories: Theory[] = [
	{
		id: 'op',
		name: 'Operant Conditioning',
		short: 'Behaviour shaped by its consequences',
		hue: 12,
		thinkers: 'Skinner, Thorndike',
		question: 'What follows the behaviour, and how does that change how often it happens?',
		constructs: ['Reinforcement', 'Punishment', 'Schedules', 'Extinction'],
		learner: 'Responds to consequences; inner states are set aside.',
		intervention: 'Adjust reinforcement: its timing, frequency and type.',
		limits: 'Says little about thinking, meaning or interest.',
		sandboxId: 'operant-conditioning'
	},
	{
		id: 'cc',
		name: 'Classical Conditioning',
		short: 'Learned associations between signals',
		hue: 38,
		thinkers: 'Pavlov, Watson',
		question: 'Which neutral cues have become linked to an emotional or bodily response?',
		constructs: ['Conditioned stimulus', 'Conditioned response', 'Generalisation', 'Extinction'],
		learner: 'Forms automatic associations through repeated pairing.',
		intervention: 'Break or re-pair associations, for example through gradual exposure.',
		limits: 'Struggles to explain deliberate, goal-directed choices.'
	},
	{
		id: 'fg',
		name: 'Forgetting Curve & Spaced Practice',
		short: 'Memory fading, and how spacing changes it',
		hue: 120,
		thinkers: 'Ebbinghaus',
		question: 'How fast does recall decay, and when should practice happen?',
		constructs: ['Retention', 'Spacing', 'Retrieval practice', 'Forgetting'],
		learner: 'Holds a memory trace that weakens unless revisited.',
		intervention: 'Space sessions across days and self-test on earlier material.',
		limits: 'Describes retention more than understanding or motivation.',
		sandboxId: 'ebbinghaus-curve'
	},
	{
		id: 'cl',
		name: 'Cognitive Load',
		short: 'The limits of working memory in learning',
		hue: 215,
		thinkers: 'Sweller',
		question: 'How much does the task ask of working memory at one time?',
		constructs: ['Working memory', 'Intrinsic load', 'Extraneous load', 'Schemas'],
		learner: 'A limited-capacity processor that builds schemas.',
		intervention: 'Chunk content, cut distractions, use worked examples.',
		limits: 'Load is hard to measure directly and says little about motivation.'
	},
	{
		id: 'sl',
		name: 'Social Learning',
		short: 'Learning by watching and judging yourself',
		hue: 265,
		thinkers: 'Bandura',
		question: 'Who is being observed, and what do they seem to gain or lose?',
		constructs: ['Modelling', 'Vicarious reinforcement', 'Self-efficacy', 'Attention'],
		learner: 'Learns from others and from beliefs about their own capability.',
		intervention: 'Provide credible models, show peers succeeding, build self-efficacy.',
		limits: 'Less specific about memory and practice mechanics.'
	},
	{
		id: 'sdt',
		name: 'Self-Determination Theory',
		short: 'Motivation grounded in basic psychological needs',
		hue: 322,
		thinkers: 'Deci, Ryan',
		question: 'Do autonomy, competence and relatedness feel met?',
		constructs: ['Autonomy', 'Competence', 'Relatedness', 'Intrinsic motivation'],
		learner: 'An active agent with inner psychological needs.',
		intervention: 'Offer choice, informative feedback and belonging; avoid controlling rewards.',
		limits: 'A broad needs framework; less precise about moment-to-moment learning.'
	},
	{
		id: 'zpd',
		name: 'Zone of Proximal Development',
		short: 'Understanding built through guided help',
		hue: 170,
		thinkers: 'Vygotsky',
		question: 'What can the learner do alone, and what can they do with the right help?',
		constructs: ['Scaffolding', 'Proximal zone', 'Social interaction', 'Mediating tools'],
		learner: 'Constructs understanding through guided interaction.',
		intervention: 'Scaffold tasks just beyond current ability, then fade support.',
		limits: 'The zone is hard to specify or test precisely.'
	},
	{
		id: 'srl',
		name: 'Self-Regulated Learning',
		short: 'Planning, monitoring and adjusting your own study',
		hue: 90,
		thinkers: 'Zimmerman',
		question: 'How does the learner plan, check and adjust their own studying?',
		constructs: ['Goal setting', 'Monitoring', 'Strategy use', 'Reflection'],
		learner: 'A strategic planner who can steer their own learning.',
		intervention: 'Teach planning, self-checking and reflection routines.',
		limits: 'Assumes the skill and motivation to self-regulate already exist.'
	}
];

export const scenarios: Scenario[] = [
	{
		id: 'quiz',
		label: 'A student keeps failing quizzes',
		text: 'Student keeps failing quizzes.',
		tension: 'Is it about consequences, timing, overload, or how the student manages study?',
		lenses: {
			op: {
				sees: 'Studying is rarely followed by a visible reward, while avoiding it brings immediate relief.',
				does: 'Give quicker, more consistent feedback and reinforce effort with small goals.'
			},
			fg: {
				sees: 'Material studied in one block fades before the quiz, so it was learned but cannot be retrieved.',
				does: 'Spread short sessions over days and test earlier material before the quiz.'
			},
			cl: {
				sees: 'Questions may demand more than working memory can hold when ideas are not yet organised.',
				does: 'Break content into steps, remove distracting detail, use worked examples.'
			},
			srl: {
				sees: 'The student may not plan or check their own understanding before the quiz.',
				does: 'Teach self-testing, goal setting and a short review routine after each quiz.'
			},
			sdt: {
				sees: 'Repeated failure can erode felt competence, which lowers effort next time.',
				does: 'Give informative feedback that shows progress and offers some choice in how to study.'
			}
		}
	},
	{
		id: 'procrastinate',
		label: 'A student leaves work until the night before',
		text: 'Student starts every assignment the night before it is due.',
		tension: 'Is the pull coming from immediate payoffs, weak planning, or low interest in the task?',
		lenses: {
			op: {
				sees: 'Avoiding the task brings instant relief, and deadline panic then rewards last-minute work.',
				does: 'Add small, early rewards for starting and break the task into checkpoints.'
			},
			srl: {
				sees: 'Planning and monitoring are weak, so time is judged badly and nobody checks progress.',
				does: 'Teach backward planning from the deadline and brief progress check-ins.'
			},
			sdt: {
				sees: 'The task may feel imposed or pointless, so there is little inner reason to begin.',
				does: 'Connect the task to personal goals and give some control over topic or format.'
			},
			fg: {
				sees: 'Cramming packs everything into one block, so most of it fades soon after.',
				does: 'Schedule several shorter sessions before the due date.'
			}
		}
	},
	{
		id: 'speak',
		label: 'A student avoids speaking up in class',
		text: 'Student who once stumbled in class now avoids speaking up.',
		tension: 'Is it a learned fear response, a payoff for staying quiet, or a belief about ability?',
		lenses: {
			cc: {
				sees: 'The classroom has become a cue linked with embarrassment, triggering anxiety automatically.',
				does: 'Pair speaking with calm, low-stakes exposure that gradually weakens the link.'
			},
			op: {
				sees: 'Staying silent removes the discomfort, which reinforces staying silent.',
				does: 'Reinforce small attempts to speak and avoid punishing mistakes.'
			},
			sl: {
				sees: 'The student has watched others being judged and doubts their own capability.',
				does: 'Show peers speaking and recovering from errors; build self-efficacy with easy wins.'
			},
			sdt: {
				sees: 'Fear of judgement threatens relatedness and competence at once.',
				does: 'Create a supportive climate where contributions are welcomed and low-pressure.'
			}
		}
	},
	{
		id: 'rewards',
		label: 'A child only reads when promised a reward',
		text: 'Stickers helped at first, but now the child reads only when promised one.',
		tension: 'Did the reward build the habit, or did it change why the child reads?',
		lenses: {
			op: {
				sees: 'Reading is reinforced by stickers, so it occurs when stickers are expected.',
				does: 'Thin out the reward schedule gradually and pair it with praise for effort.'
			},
			sdt: {
				sees: 'A controlling reward can shift motivation from interest to obtaining the prize.',
				does: 'Offer choice of books and informative feedback; use rewards sparingly.'
			},
			sl: {
				sees: 'The child may be copying a pattern where adults and siblings read only for payoff.',
				does: 'Let the child see people they admire reading for enjoyment.'
			}
		}
	},
	{
		id: 'stuck',
		label: 'A learner follows lectures but freezes on new problems',
		text: 'Learner understands the lecture but freezes on unfamiliar problems.',
		tension: 'Is the gap in capacity, in guidance, in memory, or in self-monitoring?',
		lenses: {
			cl: {
				sees: 'New problems add many unfamiliar elements at once and overload working memory.',
				does: 'Start with worked examples, then fade them into full problems.'
			},
			zpd: {
				sees: 'The problem sits beyond what the learner can do alone but within reach with help.',
				does: 'Offer hints and prompts, then withdraw support as they gain skill.'
			},
			srl: {
				sees: 'The learner feels they understand without testing it, so the gap goes unnoticed.',
				does: 'Teach self-explanation and attempting problems before reviewing the answer.'
			},
			fg: {
				sees: 'Lecture content has faded and cannot be retrieved when the problem arrives.',
				does: 'Add retrieval practice that mixes older and newer problem types.'
			},
			sl: {
				sees: 'Without seeing others work through uncertainty, the learner expects instant success.',
				does: 'Model thinking aloud, including false starts and corrections.'
			}
		}
	}
];