/** Tracks whether the learner has an in-app page to go back to (so "← Back" can use real browser history). */
class NavState {
	depth = $state(0);
	get canBack() {
		return this.depth > 0;
	}
}
export const nav = new NavState();
