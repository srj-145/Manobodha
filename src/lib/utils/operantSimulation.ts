import type { GraphDataPoint } from '$lib/types/theory';

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
	durationSeconds: number = 60
): GraphDataPoint[] {
	const rateParam = Math.max(1, Number(rawRateParam) || 10);
	const points: GraphDataPoint[] = [{ x: 0, y: 0 }];
	let totalResponses = 0;
	let pauseCounter = 0; // Tracks post-reinforcement pause duration for FR

	for (let t = 1; t <= durationSeconds; t++) {
		if (isExtinction) {
			// Extinction Burst: Temporary surge in response frequency in initial seconds (t <= 6),
			// followed by rapid exponential decay as behavior ceases.
			const isBurstPhase = t <= 6;
			const burstFactor = isBurstPhase ? 2.2 : 1.0;
			const probability = Math.min(1, Math.max(0, burstFactor * 0.85 * Math.exp(-t / 7)));

			if (Math.random() < probability) {
				totalResponses += Math.floor(Math.random() * 2) + 1;
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
						if (Math.random() < 0.05) totalResponses += 1;
					} else {
						// Exponential acceleration as time limit approaches
						const rateProb = Math.pow(progress, 3) * 2.8;
						const responsesToAdd = Math.floor(rateProb) + (Math.random() < (rateProb % 1) ? 1 : 0);
						totalResponses += responsesToAdd;
					}
					break;
				}

				case 'variable-interval': {
					// VI: Moderate, Steady Linear Slope
					// Unpredictable time intervals produce a continuous, constant response rate without pauses.
					const baseProb = Math.min(0.9, Math.max(0.15, 8 / rateParam));
					if (Math.random() < baseProb) {
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
						const burstResponses = Math.floor(Math.random() * 2) + 2; // High-frequency burst
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
					const burst = Math.floor(Math.random() * 3) + 2;
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