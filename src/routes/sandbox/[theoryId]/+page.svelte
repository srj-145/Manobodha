<script lang="ts">
	import { page } from '$app/stores';
	import { resolveRoute } from '$app/paths';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import OutputGraph from '$lib/components/OutputGraph.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import { calculateOperantCumulativeRecord } from '$lib/utils/operantSimulation';
	import type { ControlSchema, GraphConfig } from '$lib/types/theory';

	const theoryId = $derived($page.params.theoryId);

	const controlsSchema: ControlSchema[] = [
		{
			id: 'reinforcementRate',
			label: 'Interval (s) / Ratio Quota',
			type: 'slider',
			min: 5,
			max: 30,
			step: 1,
			defaultValue: 15,
			tooltip: 'Defines interval duration (seconds) or required response count for reinforcement.'
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
			tooltip: 'Simulates complete removal of reinforcement.'
		}
	];

	let controlValues = $state<Record<string, string | number | boolean>>({
		reinforcementRate: 15,
		scheduleType: 'fixed-interval',
		extinctionMode: false
	});

	const dataPoints = $derived(
		calculateOperantCumulativeRecord(
			controlValues.scheduleType as string,
			controlValues.reinforcementRate as number,
			controlValues.extinctionMode as boolean
		)
	);

	const graphConfig: GraphConfig = $derived({
		title: `Cumulative Response Record — ${(theoryId ?? '').toUpperCase()}`,
		xAxisLabel: 'Elapsed Time (seconds)',
		yAxisLabel: 'Cumulative Responses',
		chartType: 'line'
	});
</script>

<div class="space-y-6 p-6">
	<!-- Header -->
	<header class="flex items-center justify-between border-b pb-4">
		<div>
			<h1 class="text-2xl font-bold capitalize">{(theoryId ?? '').replace('-', ' ')} Sandbox</h1>
			<p class="text-sm text-slate-500">Experiment with parameters in real-time</p>
		</div>

		<a
			href="{resolveRoute('/quiz')}?theory={theoryId}"
			class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-emerald-700"
		>
			<span>🎯 Take {theoryId === 'operant-conditioning' ? 'Operant' : 'Memory'} Quiz</span>
		</a>
	</header>

	<!-- Active Sandbox Workbench Grid -->
	<main class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<section class="rounded-lg border bg-white p-4 shadow-sm md:col-span-1">
			<h2 class="mb-4 text-base font-semibold">Simulation Parameters</h2>
			<ControlPanel controls={controlsSchema} bind:values={controlValues} />
		</section>

		<section class="rounded-lg border bg-white p-4 shadow-sm md:col-span-2">
			<OutputGraph config={graphConfig} {dataPoints} />
		</section>
	</main>

	<!-- Floating Mascot Assistant -->
	<div class="fixed bottom-6 right-6">
		<a href="{resolveRoute('/quiz')}?theory={theoryId}" class="group block">
			<Mascot
				emote="idea"
				speechText="Ready to test what you learned? Tap me to start the quiz!"
				color="blue"
				size="md"
			/>
		</a>
	</div>
</div>