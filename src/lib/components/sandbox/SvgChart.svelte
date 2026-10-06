<script lang="ts">
	import type { GraphDataPoint } from '$lib/types/theory';

	export interface Series {
		id: string;
		label: string;
		color: string;
		points: GraphDataPoint[];
		dash?: string;
		area?: boolean;
		/** Draw a pulsing dot on the last point (the "live" pen). */
		live?: boolean;
	}
	export interface Marker {
		x: number;
		y: number;
		color: string;
		kind?: 'pip' | 'ring';
		label?: string;
	}
	export interface VLine {
		x: number;
		label?: string;
		color: string;
		dash?: string;
	}

	let {
		title,
		desc = '',
		series,
		xDomain,
		yDomain,
		xTicks,
		yTicks,
		xLabel,
		yLabel,
		yFormat = (v: number) => String(v),
		markers = [],
		vlines = [],
		hlines = []
	}: {
		title: string;
		desc?: string;
		series: Series[];
		xDomain: [number, number];
		yDomain: [number, number];
		xTicks: number[];
		yTicks: number[];
		xLabel: string;
		yLabel: string;
		yFormat?: (v: number) => string;
		markers?: Marker[];
		vlines?: VLine[];
		hlines?: { y: number; label: string; color: string }[];
	} = $props();

	let w = $state(720);
	const h = $derived(Math.round(Math.min(400, Math.max(260, w * 0.52))));
	const m = $derived({ l: w < 480 ? 46 : 58, r: 18, t: 18, b: 50 });
	const px = (x: number) => m.l + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * (w - m.l - m.r);
	const py = (y: number) => h - m.b - ((y - yDomain[0]) / (yDomain[1] - yDomain[0])) * (h - m.t - m.b);
	const path = (pts: GraphDataPoint[]) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${px(p.x).toFixed(1)} ${py(p.y).toFixed(1)}`).join('');
</script>

<div class="chart" bind:clientWidth={w}>
	<svg viewBox="0 0 {w} {h}" width={w} height={h} role="img" aria-label="{title}. {desc}">
		<g class="grid">
			{#each yTicks as v (v)}
				<line x1={m.l} x2={w - m.r} y1={py(v)} y2={py(v)} />
				<text x={m.l - 8} y={py(v) + 4} text-anchor="end">{yFormat(v)}</text>
			{/each}
			{#each xTicks as v (v)}
				<text x={px(v)} y={h - m.b + 18} text-anchor="middle">{v}</text>
			{/each}
		</g>
		<path class="axis" d="M{m.l} {m.t}V{h - m.b}H{w - m.r}" />
		<text class="ax" x={(m.l + w - m.r) / 2} y={h - 8} text-anchor="middle">{xLabel}</text>
		<text class="ax" transform="translate(13 {(m.t + h - m.b) / 2}) rotate(-90)" text-anchor="middle">{yLabel}</text>

		{#each hlines as l (l.label)}
			<line x1={m.l} x2={w - m.r} y1={py(l.y)} y2={py(l.y)} stroke={l.color} stroke-dasharray="4 5" opacity="0.8" />
			<text class="note" x={w - m.r - 4} y={py(l.y) - 6} text-anchor="end" fill={l.color}>{l.label}</text>
		{/each}
		{#each vlines as l, i (i)}
			<line x1={px(l.x)} x2={px(l.x)} y1={m.t} y2={h - m.b} stroke={l.color} stroke-dasharray={l.dash ?? '0'} stroke-width="1.5" />
			{#if l.label}
				<text class="note" x={px(l.x) + 6} y={m.t + 12} fill={l.color}>{l.label}</text>
			{/if}
		{/each}

		{#each series as s (s.id)}
			{#if s.area && s.points.length > 1}
				<path d="{path(s.points)}L{px(s.points[s.points.length - 1].x)} {py(yDomain[0])}L{px(s.points[0].x)} {py(yDomain[0])}Z" fill={s.color} opacity="0.1" />
			{/if}
			<path d={path(s.points)} fill="none" stroke={s.color} stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray={s.dash ?? '0'} />
			{#if s.live && s.points.length}
				{@const p = s.points[s.points.length - 1]}
				<circle class="pulse" cx={px(p.x)} cy={py(p.y)} r="6" fill={s.color} />
				<circle cx={px(p.x)} cy={py(p.y)} r="4.5" fill={s.color} stroke="var(--bg)" stroke-width="2" />
			{/if}
		{/each}

		{#each markers as k, i (i)}
			{#if k.kind === 'ring'}
				<circle class="ring" cx={px(k.x)} cy={py(k.y)} r="7" fill="var(--bg)" stroke={k.color} stroke-width="2.5" />
			{:else}
				<path class="pip" d="M{px(k.x)} {py(k.y)}l-5 -9" stroke={k.color} stroke-width="2.2" stroke-linecap="round" />
			{/if}
			{#if k.label}
				<text class="note" x={px(k.x)} y={py(k.y) - 14} text-anchor="middle" fill={k.color}>{k.label}</text>
			{/if}
		{/each}
	</svg>

	<ul class="legend">
		{#each series as s (s.id)}
			<li>
				<svg width="26" height="8" aria-hidden="true"><line x1="0" x2="26" y1="4" y2="4" stroke={s.color} stroke-width="3" stroke-dasharray={s.dash ?? '0'} /></svg>
				{s.label}
			</li>
		{/each}
	</ul>
</div>

<style>
	.chart {
		width: 100%;
	}
	svg {
		display: block;
		max-width: 100%;
		overflow: visible;
	}
	.grid line {
		stroke: var(--line);
		stroke-width: 1;
	}
	text {
		font: 500 12px 'DM Sans', sans-serif;
		fill: var(--mut);
	}
	.ax {
		font-weight: 600;
		fill: var(--ink);
	}
	.note {
		font-weight: 700;
		font-size: 11.5px;
	}
	.axis {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.2;
	}
	.pulse {
		opacity: 0.25;
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 1.4s ease-out infinite;
	}
	.ring {
		transform-box: fill-box;
		transform-origin: center;
		animation: pop 0.5s cubic-bezier(0.2, 1.6, 0.4, 1);
	}
	@keyframes pulse {
		to {
			transform: scale(2.6);
			opacity: 0;
		}
	}
	@keyframes pop {
		from {
			transform: scale(0);
		}
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
		font-size: 13px;
		color: var(--mut);
	}
	.legend li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	@media (prefers-reduced-motion: reduce) {
		.pulse,
		.ring {
			animation: none;
		}
	}
</style>
