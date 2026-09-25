<script lang="ts">
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import OutputGraph from '$lib/components/OutputGraph.svelte';
	import InfoTooltip from '$lib/components/InfoTooltip.svelte';
	import { accessibility } from '$lib/stores/accessibility.svelte';
	import { calculateOperantCumulativeRecord } from '$lib/utils/operantSimulation';
	import type { ControlSchema, GraphConfig } from '$lib/types/theory';

	const controlsSchema: ControlSchema[] = [
		{
			id: 'reinforcementRate',
			label: 'Reinforcement Interval / Ratio Value',
			type: 'slider',
			min: 5,
			max: 30,
			step: 1,
			defaultValue: 15,
			tooltip: 'Interval duration (seconds) or required response count for reinforcement.'
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
			],
			tooltip: 'Determines the rule governing reinforcement delivery.'
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

	// Reactively compute graph points whenever slider or dropdown changes
	const dataPoints = $derived(
		calculateOperantCumulativeRecord(
			controlValues.scheduleType,
			controlValues.reinforcementRate,
			controlValues.extinctionMode
		)
	);

	const graphConfig: GraphConfig = {
		title: 'Cumulative Response Graph',
		xAxisLabel: 'Elapsed Time (seconds)',
		yAxisLabel: 'Cumulative Responses',
		chartType: 'line'
	};
</script>

<div class="space-y-6 p-6 {accessibility.highContrast ? 'bg-black text-white' : ''}">
	<header class="flex items-center justify-between border-b pb-4">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Manobodha Workbench</h1>
			<p class="text-sm text-muted-foreground">Interactive Psychology Simulation Platform</p>
		</div>
		<div class="flex items-center gap-3">
			<a
				href="/sandbox/operant-conditioning"
				class="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
			>
				Open Dynamic Sandbox Route →
			</a>
			<button
				type="button"
				onclick={() => accessibility.toggleHighContrast()}
				class="rounded border px-3 py-1 text-xs"
			>
				Toggle Contrast
			</button>
		</div>
	</header>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="md:col-span-1">
			<ControlPanel controls={controlsSchema} bind:values={controlValues} />
		</div>
		<div class="md:col-span-2">
			<OutputGraph config={graphConfig} {dataPoints} />
		</div>
	</div>
</div>