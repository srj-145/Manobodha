import type { GraphDataPoint } from '$lib/types/theory';

/**
 * Calculates Ebbinghaus Retention Curves with spaced repetition reviews.
 * 
 * Formula: R(t) = R_previous * e^(-1 / S)
 * - Base Strength (S): Represents initial memory encoding quality (meaningfulness/attention).
 * - Spaced Repetitions: Resets retention to ~100% on review days and increases memory stability (S).
 */
export function calculateEbbinghausRetentionCurve(
	rawInitialStrength: number | string | boolean,
	rawRepetitions: number | string | boolean,
	durationDays: number = 30
): GraphDataPoint[] {
	const initialStrength = Math.max(1, Number(rawInitialStrength) || 5);
	const reps = Math.max(0, Number(rawRepetitions) || 0);

	const points: GraphDataPoint[] = [{ x: 0, y: 100 }];

	// Initial stability factor S (higher strength = slower decay)
	let currentS = initialStrength * 1.5;
	let retention = 100;

	// Scheduled review points for spaced repetition (Days 1, 3, 7, 14)
	const reviewDays = [1, 3, 7, 14].slice(0, reps);

	for (let day = 1; day <= durationDays; day++) {
		if (reviewDays.includes(day)) {
			// Spaced Review Event: Retention spikes back near 100% & memory stability increases
			retention = 98;
			currentS *= 1.6; // Memory becomes significantly more durable
		} else {
			// Continuous exponential retention decay
			retention = retention * Math.exp(-1 / currentS);
		}

		points.push({
			x: day,
			y: Math.max(0, Math.round(retention * 10) / 10)
		});
	}

	return points;
}