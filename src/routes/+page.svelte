<script lang="ts">
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import OutputGraph from '$lib/components/OutputGraph.svelte';
	import type { ControlSchema, GraphConfig } from '$lib/types/theory';

	const dummyControls: ControlSchema[] = [
		{
			id: 'reinforcementRate',
			label: 'Reinforcement Interval / Ratio Value',
			type: 'slider',
			min: 1,
			max: 60,
			step: 1,
			defaultValue: 15,
			tooltip: 'Interval duration (seconds) or required response count.'
		},
		{
			id: 'scheduleType',
			label: 'Schedule Type',
			type: 'dropdown',
			defaultValue: 'fixed-interval',
			options: [
				{ label: 'Fixed Interval (FI)', value: 'fixed-interval' },
				{ label: 'Variable Interval (VI)', value: 'variable-interval' },
				{ label: 'Fixed Ratio (FR)', value: 'fixed-ratio' },
				{ label: 'Variable Ratio (VR)', value: 'variable-ratio' }
			]
		},
		{
			id: 'extinctionMode',
			label: 'Extinction Phase',
			type: 'toggle',
			defaultValue: false,
			tooltip: 'Simulates cessation of reinforcement delivery.'
		}
	];

	let controlValues = $state<Record<string, any>>({
		reinforcementRate: 15,
		scheduleType: 'fixed-interval',
		extinctionMode: false
	});

	const dummyGraphConfig: GraphConfig = {
		title: 'Cumulative Response Graph (Dummy)',
		xAxisLabel: 'Time (s)',
		yAxisLabel: 'Cumulative Responses',
		chartType: 'line'
	};

	const dummyDataPoints = [
		{ x: 0, y: 0 },
		{ x: 10, y: 5 },
		{ x: 20, y: 12 },
		{ x: 30, y: 28 },
		{ x: 40, y: 45 },
		{ x: 50, y: 65 },
		{ x: 60, y: 90 }
	];
</script>

<main class="container mx-auto max-w-6xl space-y-6 p-6">
	<header class="border-b pb-4">
		<h1 class="text-3xl font-bold">Manobodha Workbench</h1>
		<p class="mt-1 text-muted-foreground">Week 2 Prototype — Modular Control & Graph Shell</p>
	</header>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="md:col-span-1">
			<ControlPanel controls={dummyControls} bind:values={controlValues} />
		</div>
		<div class="md:col-span-2">
			<OutputGraph config={dummyGraphConfig} dataPoints={dummyDataPoints} />
		</div>
	</div>
</main>