/**
 * DemoPlayer — drives the automated "Play / Demo Scene" loop for a sandbox.
 * Each scene = glide (controls move to the scene's values) → run (the simulation plays,
 * `progress` goes 0→1) → hold. Scenes repeat forever until paused.
 */
export interface DemoOptions {
	scenes: number;
	glideMs: number;
	runMs: number;
	holdMs: number;
	/** Called every frame of the glide phase with eased progress 0→1. */
	onGlide: (scene: number, p: number) => void;
	/** Called when a scene begins (snapshot "from" control values here). */
	onSceneStart: (scene: number) => void;
}

export const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export class DemoPlayer {
	playing = $state(false);
	scene = $state(0);
	phase = $state<'glide' | 'run' | 'hold'>('glide');
	/** 0→1 position of the simulation clock (also driven by the scrubber). */
	progress = $state(0);
	/** Playback speed multiplier (0.5 / 1 / 2). Bound to the speed pills in DemoBar. */
	speed = $state(1);

	#raf = 0;
	#last = 0;
	#el = 0;
	#o: DemoOptions;

	constructor(o: DemoOptions) {
		this.#o = o;
	}

	#sync() {
		const { glideMs: g, runMs: r } = this.#o;
		if (this.#el < g) {
			this.phase = 'glide';
			this.progress = 0;
			this.#o.onGlide(this.scene, ease(this.#el / g));
		} else if (this.#el < g + r) {
			if (this.phase === 'glide') this.#o.onGlide(this.scene, 1);
			this.phase = 'run';
			this.progress = (this.#el - g) / r;
		} else {
			this.phase = 'hold';
			this.progress = 1;
		}
	}

	#tick = (now: number) => {
		if (!this.playing) return;
		this.#el += Math.min(64, now - this.#last) * this.speed;
		this.#last = now;
		const { glideMs, runMs, holdMs, scenes } = this.#o;
		if (this.#el >= glideMs + runMs + holdMs) {
			this.scene = (this.scene + 1) % scenes;
			this.#el = 0;
			this.#o.onSceneStart(this.scene);
		}
		this.#sync();
		this.#raf = requestAnimationFrame(this.#tick);
	};

	/** Start (or restart the current scene so controls glide from wherever the user left them). */
	play() {
		cancelAnimationFrame(this.#raf);
		this.playing = true;
		this.#el = 0;
		this.#o.onSceneStart(this.scene);
		this.#last = performance.now();
		this.#raf = requestAnimationFrame(this.#tick);
	}

	pause() {
		this.playing = false;
		cancelAnimationFrame(this.#raf);
	}

	toggle() {
		if (this.playing) this.pause();
		else this.play();
	}

	/** Manual scrub: pauses the demo and moves the simulation clock. */
	seek(p: number) {
		this.pause();
		this.phase = 'run';
		this.progress = Math.min(1, Math.max(0, p));
		this.#el = this.#o.glideMs + this.progress * this.#o.runMs;
	}

	jump(scene: number) {
		this.scene = scene;
		this.play();
	}
}
