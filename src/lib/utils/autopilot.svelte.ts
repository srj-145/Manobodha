/**
 * Autopilot: runs a looping script of scenes so a sandbox animates itself.
 * A scene can set controls, glide sliders to new values (with a highlight) and wait.
 * Calling stop() (e.g. when the user touches a control) cancels everything mid-flight.
 */
export const STOP = Symbol('autopilot-stop');

export interface AutoCtx {
	sleep(ms: number): Promise<void>;
	/** Eased tween from → to; calls set() every frame. */
	glide(from: number, to: number, ms: number, set: (v: number) => void): Promise<void>;
	/** Highlight these control ids (class .autoflash) until marked again. */
	mark(ids: string[]): void;
}
export interface AutoScene {
	label: string;
	run: (c: AutoCtx) => Promise<void>;
}

export class Autopilot {
	on = $state(false);
	scene = $state(0);
	flash = $state<string[]>([]);
	#gen = 0;

	async play(scenes: AutoScene[], from = 0, once = false) {
		const g = ++this.#gen;
		this.on = true;
		this.scene = from % scenes.length;
		try {
			for (;;) {
				await scenes[this.scene].run(this.#ctx(g));
				this.flash = [];
				if (once) {
					this.on = false;
					return;
				}
				this.scene = (this.scene + 1) % scenes.length;
			}
		} catch (e) {
			if (e !== STOP) throw e;
		}
	}

	stop() {
		this.#gen++;
		this.on = false;
		this.flash = [];
	}

	#ctx(g: number): AutoCtx {
		const live = () => g === this.#gen;
		return {
			sleep: (ms) =>
				new Promise((res, rej) => setTimeout(() => (live() ? res() : rej(STOP)), ms)),
			glide: (from, to, ms, set) =>
				new Promise((res, rej) => {
					const t0 = performance.now();
					const f = (now: number) => {
						if (!live()) return rej(STOP);
						const p = Math.min(1, (now - t0) / ms);
						const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
						set(from + (to - from) * e);
						if (p < 1) requestAnimationFrame(f);
						else res();
					};
					requestAnimationFrame(f);
				}),
			mark: (ids) => {
				if (live()) this.flash = ids;
			}
		};
	}
}
