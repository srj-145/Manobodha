/**
 * Shared state for the floating companion (Bodhi).
 * Any page/component can make the companion react:  companion.say('Nice!', 'right')
 */
export type CompanionMood =
	| 'neutral'
	| 'excited'
	| 'nervous'
	| 'right'
	| 'wrong'
	| 'confused'
	| 'surprise'
	| 'sad';

class Companion {
	msg = $state('');
	/** A sandbox sets this while the learner is editing parameters, so Bodhi's idle motion holds still too. */
	frozen = $state(false);
	mood = $state<CompanionMood | null>(null);
	#timer: ReturnType<typeof setTimeout> | undefined;

	say(text: string, mood: CompanionMood = 'neutral', ms = 5200) {
		this.msg = text;
		this.mood = mood;
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => this.clear(), ms);
	}
	clear() {
		clearTimeout(this.#timer);
		this.msg = '';
		this.mood = null;
	}
}

export const companion = new Companion();
