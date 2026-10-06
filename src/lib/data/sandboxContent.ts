export const quadrants = [
	{ key: 'pr', tag: '+R', name: 'Positive reinforcement', rule: 'Add something pleasant', effect: 'Behavior ↑', eg: 'A pellet drops after the lever press; a learner earns praise for finishing a task.', tone: 'sage' },
	{ key: 'nr', tag: '−R', name: 'Negative reinforcement', rule: 'Remove something unpleasant', effect: 'Behavior ↑', eg: 'Pressing the lever switches off a mild floor shock; buckling up stops the car chime.', tone: 'blue' },
	{ key: 'pp', tag: '+P', name: 'Positive punishment', rule: 'Add something unpleasant', effect: 'Behavior ↓', eg: 'A shock follows the press; a parking ticket follows illegal parking.', tone: 'rust' },
	{ key: 'np', tag: '−P', name: 'Negative punishment', rule: 'Remove something pleasant', effect: 'Behavior ↓', eg: 'Food access is paused after the press; screen time is lost after breaking a rule.', tone: 'yel' }
];

export const schedules = [
	{ id: 'fixed-ratio', abbr: 'FR', name: 'Fixed Ratio', rule: 'Reward after every N responses.', pattern: 'Pause-and-run: a pause after each reward, then a fast burst.', eg: 'Piecework pay, a coffee card stamped every 10 cups.', d: 'M2 38L14 30M14 30V28L30 20M30 20V18L46 10M46 10V8L62 2' },
	{ id: 'variable-ratio', abbr: 'VR', name: 'Variable Ratio', rule: 'Reward after an unpredictable number of responses.', pattern: 'Highest, steadiest rate with almost no pauses. Most resistant to extinction.', eg: 'Slot machines, loot drops, pull-to-refresh feeds.', d: 'M2 38L78 4' },
	{ id: 'fixed-interval', abbr: 'FI', name: 'Fixed Interval', rule: 'Reward for the first response after a set time.', pattern: 'Scallop: little responding early, accelerating as the time nears.', eg: 'Cramming before a scheduled exam; a monthly paycheck.', d: 'M2 38C10 38 16 34 22 22M22 30C30 30 38 26 44 14M44 22C52 22 60 18 66 6' },
	{ id: 'variable-interval', abbr: 'VI', name: 'Variable Interval', rule: 'Reward for the first response after an unpredictable time.', pattern: 'Slow, steady responding with no predictable pauses.', eg: 'Checking email, pop quizzes, fishing.', d: 'M2 38L78 16' }
];

export const applications = [
	{ icon: '🎮', name: 'Gamification', body: 'Points, streaks and badges are reinforcers. Variable rewards (mystery boxes, random bonuses) borrow the VR pattern, so use them with care and avoid manipulating learners.' },
	{ icon: '🌱', name: 'Habit formation', body: 'Reinforce immediately and consistently while a habit is new, then thin the reward to a variable schedule. A tiny instant win beats a large delayed one.' },
	{ icon: '🐕', name: 'Training & shaping', body: 'Reward successive approximations of the target behavior. Clicker training marks the exact moment of success; token economies do the same in classrooms.' }
];

export const operantScenes = [
	{ title: 'Fixed Ratio — pause and run', note: 'Every 10th press earns a pellet. Watch the staircase: a burst of pressing, a short pause after each reward.', schedule: 'fixed-ratio', rate: 10, extinction: false },
	{ title: 'Variable Ratio — the steepest line', note: 'Pellets arrive after an unpredictable number of presses (about 10). No pauses, highest response rate.', schedule: 'variable-ratio', rate: 10, extinction: false },
	{ title: 'Fixed Interval — the scallop', note: 'The first press after 15 seconds pays. Responding speeds up as the interval runs out.', schedule: 'fixed-interval', rate: 15, extinction: false },
	{ title: 'Variable Interval — steady and moderate', note: 'Unpredictable waiting times (about 15 s) keep the behavior steady with no pauses.', schedule: 'variable-interval', rate: 15, extinction: false },
	{ title: 'Extinction — reinforcement stops at 20 s', note: 'Acquisition under VR, then pellets stop. Expect an extinction burst, then decay toward zero.', schedule: 'variable-ratio', rate: 8, extinction: true }
];

export const forgettingScenes = [
	{ title: 'Active recall at 20% retention', note: 'Memory decays to 20%, you test yourself, retention snaps back to 100%, and every future decay is flatter.', strength: 2, boost: 1.8, threshold: 20, activeRecall: true },
	{ title: 'Passive re-reading instead', note: 'Same schedule, no self-testing. Each review adds less strength, so the curve stays steeper and reviews come sooner.', strength: 2, boost: 1.8, threshold: 20, activeRecall: false },
	{ title: 'A stronger start, earlier reviews', note: 'Starting with higher strength (S = 5) and reviewing at 40% needs far fewer sessions to hold the memory for a month.', strength: 5, boost: 1.8, threshold: 40, activeRecall: true }
];

export const forgettingInsights = [
	{ icon: '⏳', name: 'Half-life', body: 'Retention halves every S·ln 2 days. Strengthening S is the only way to lengthen the half-life, and reviews do exactly that.' },
	{ icon: '🔁', name: 'Spaced repetition (SRS)', body: 'Review just before forgetting, then expand the gap (1 → 3 → 7 → 16 days). Each successful retrieval raises S, so the next gap can be longer.' },
	{ icon: '🧠', name: 'Active recall', body: 'Trying to retrieve an answer beats re-reading. Effortful retrieval is the "desirable difficulty" that builds stability, so flashcards and practice tests work.' },
	{ icon: '📉', name: 'A simplified model', body: 'Real forgetting is closer to a power law, and S varies by material and person. R = e^(−t/S) is a clean teaching model, not a precise prediction.' }
];
