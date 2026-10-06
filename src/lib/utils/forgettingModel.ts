import type { GraphDataPoint } from '$lib/types/theory';

export const HORIZON_DAYS = 30;

export interface ForgettingParams {
	/** Initial memory strength S (days). R = e^(-t/S). */
	strength: number;
	/** Strength multiplier gained per successful review. */
	boost: number;
	/** Review when retention falls to this fraction (0–1). */
	threshold: number;
	/** Active recall (self-testing) adds a bonus to the multiplier. */
	activeRecall: boolean;
}

export interface ReviewEvent {
	t: number;
	/** Strength S after this review. */
	strength: number;
	interval: number;
}

export const RECALL_BONUS = 0.6;

export const retention = (t: number, s: number) => Math.exp(-t / s);

export function buildForgettingModel(p: ForgettingParams) {
	const mult = p.boost + (p.activeRecall ? RECALL_BONUS : 0);
	const step = 0.1;
	const single: GraphDataPoint[] = [];
	const spaced: GraphDataPoint[] = [];
	const reviews: ReviewEvent[] = [];
	const segs: { t0: number; s: number }[] = [{ t0: 0, s: p.strength }];

	let s = p.strength;
	let t0 = 0;
	for (;;) {
		const interval = s * Math.log(1 / p.threshold);
		const tr = t0 + interval;
		if (tr >= HORIZON_DAYS) break;
		s *= mult;
		reviews.push({ t: tr, strength: s, interval });
		segs.push({ t0: tr, s });
		t0 = tr;
	}

	for (let i = 0; i <= HORIZON_DAYS / step + 0.5; i++) {
		const t = Math.round(i * step * 10) / 10;
		single.push({ x: t, y: retention(t, p.strength) * 100 });
	}
	// Spaced curve: piecewise decay with a vertical jump to 100% at each review.
	segs.forEach((seg, i) => {
		const end = segs[i + 1]?.t0 ?? HORIZON_DAYS;
		spaced.push({ x: seg.t0, y: 100 });
		for (let t = Math.ceil((seg.t0 + 1e-9) / step) * step; t < end; t += step)
			spaced.push({ x: t, y: retention(t - seg.t0, seg.s) * 100 });
		spaced.push({ x: end, y: retention(end - seg.t0, seg.s) * 100 });
	});

	/** State of the spaced memory at time t. */
	const at = (t: number) => {
		let seg = segs[0];
		let n = 0;
		for (let i = 0; i < segs.length; i++) if (t >= segs[i].t0) (seg = segs[i]), (n = i);
		return {
			single: retention(t, p.strength) * 100,
			spaced: retention(t - seg.t0, seg.s) * 100,
			strength: seg.s,
			reviews: n,
			sinceReview: t - seg.t0
		};
	};

	return { single, spaced, reviews, at, mult };
}
