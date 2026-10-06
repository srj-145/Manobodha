import type { GraphDataPoint } from '$lib/types/theory';

/** Second at which reinforcement is withdrawn when Extinction Phase is enabled. */
export const EXTINCTION_ONSET = 20;

/** Small deterministic PRNG so a given seed always draws the same cumulative record. */
export function mulberry32(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Calculates authentic Operant Conditioning cumulative response curves.
 *
 * Schedule Behaviors:
 * - Fixed Interval (FI): "Scallop" pattern — post-reinforcement pause followed by accelerating response rate.
 * - Variable Interval (VI): Moderate, steady, linear slope with no predictable pauses.
 * - Fixed Ratio (FR): "Pause and Run" pattern — high-density response bursts followed by post-reinforcement pauses (PRP).
 * - Variable Ratio (VR): Steepest, highly consistent linear slope with zero post-reinforcement pauses.
 * - Extinction: Initial "Extinction Burst" (temporary surge in response) followed by rapid exponential decay to zero slope.
 */
export function calculateOperantCumulativeRecord(
	scheduleType: string,
	rawRateParam: number | string,
	isExtinction: boolean,
	durationSeconds: number = 60,
	seed?: number
): GraphDataPoint[] {
	const rand = seed === undefined ? Math.random : mulberry32(seed);
	const rateParam = Math.max(1, Number(rawRateParam) || 10);
	const points: GraphDataPoint[] = [{ x: 0, y: 0 }];
	let totalResponses = 0;
	let pauseCounter = 0; // Tracks post-reinforcement pause duration for FR

	for (let t = 1; t <= durationSeconds; t++) {
		if (isExtinction && t > EXTINCTION_ONSET) {
			// Acquisition runs under the chosen schedule until EXTINCTION_ONSET, then reinforcement stops.
			// Extinction Burst: a brief surge right after removal, then exponential decay as behavior ceases.
			const te = t - EXTINCTION_ONSET;
			const isBurstPhase = te <= 6;
			const probability = Math.min(1, 2.2 * Math.exp(-te / 9));

			if (rand() < probability) {
				totalResponses += isBurstPhase ? Math.floor(rand() * 3) + 2 : Math.floor(rand() * 2) + 1;
			}
		} else {
			switch (scheduleType) {
				case 'fixed-interval': {
					// FI: "Scalloped" Curve
					// Post-reinforcement pause at interval start, followed by accelerating response near interval end.
					const timeInInterval = (t - 1) % rateParam;
					const progress = timeInInterval / rateParam;

					if (progress < 0.25) {
						// Post-reinforcement pause window
						if (rand() < 0.05) totalResponses += 1;
					} else {
						// Exponential acceleration as time limit approaches
						const rateProb = Math.pow(progress, 3) * 2.8;
						const responsesToAdd = Math.floor(rateProb) + (rand() < rateProb % 1 ? 1 : 0);
						totalResponses += responsesToAdd;
					}
					break;
				}

				case 'variable-interval': {
					// VI: Moderate, Steady Linear Slope
					// Unpredictable time intervals produce a continuous, constant response rate without pauses.
					const baseProb = Math.min(0.9, Math.max(0.15, 8 / rateParam));
					if (rand() < baseProb) {
						totalResponses += 1;
					}
					break;
				}

				case 'fixed-ratio': {
					// FR: "Pause and Run" Stepped Curve
					// Rapid burst ("run") until ratio quota is met, followed by a Post-Reinforcement Pause (PRP).
					if (pauseCounter > 0) {
						pauseCounter--; // Subject in post-reinforcement pause
					} else {
						const burstResponses = Math.floor(rand() * 2) + 2; // High-frequency burst
						const previousTotal = totalResponses;
						totalResponses += burstResponses;

						// Trigger PRP if a ratio requirement boundary was crossed
						if (Math.floor(previousTotal / rateParam) < Math.floor(totalResponses / rateParam)) {
							pauseCounter = Math.min(6, Math.max(2, Math.floor(rateParam / 4)));
						}
					}
					break;
				}

				case 'variable-ratio': {
					// VR: Steepest, Continuous High Slope
					// Highest overall response rate with zero post-reinforcement pauses (e.g., slot machines).
					const burst = Math.floor(rand() * 3) + 2;
					totalResponses += burst;
					break;
				}

				default:
					totalResponses += 1;
			}
		}

		points.push({ x: t, y: totalResponses });
	}

	return points;
}

/**
 * Seconds at which a reinforcer (pellet) is delivered for a given record.
 * Ratio schedules pay after N responses; interval schedules pay the first response after N seconds.
 * "Variable" schedules draw N around the mean. Nothing is delivered after extinction begins.
 */
export function deriveReinforcers(
	scheduleType: string,
	rawRate: number | string,
	isExtinction: boolean,
	points: GraphDataPoint[],
	seed = 1
): number[] {
	const rate = Math.max(1, Number(rawRate) || 10);
	const rand = mulberry32(seed + 101);
	const end = isExtinction ? Math.min(EXTINCTION_ONSET, points.length - 1) : points.length - 1;
	const isRatio = scheduleType.endsWith('ratio');
	const draw = () =>
		scheduleType.startsWith('variable') ? Math.max(1, Math.round(rate * (0.4 + rand() * 1.2))) : rate;
	const out: number[] = [];
	let need = draw();
	let base = 0;
	let lastT = 0;

	for (let t = 1; t <= end; t++) {
		if (isRatio) {
			if (points[t].y - base >= need) {
				out.push(t);
				base = points[t].y;
				need = draw();
			}
		} else if (points[t].y > points[t - 1].y && t - lastT >= need) {
			out.push(t);
			lastT = t;
			need = draw();
		}
	}
	return out;
}
