<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { GraphConfig, GraphDataPoint } from '$lib/types/theory';

	let {
		config = {
			title: 'Output Graph',
			xAxisLabel: 'X Axis',
			yAxisLabel: 'Y Axis',
			chartType: 'line'
		},
		dataPoints = []
	}: {
		config?: GraphConfig;
		dataPoints?: GraphDataPoint[];
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: any = null;

	// Synchronize both chart data AND dataset label dynamically
	$effect(() => {
		const currentPoints = dataPoints;
		const currentTitle = config.title;

		if (chart) {
			chart.data.datasets[0].data = currentPoints;
			chart.data.datasets[0].label = currentTitle;
			chart.update();
		}
	});

	onMount(async () => {
		if (!canvas) return;

		const { default: Chart } = await import('chart.js/auto');

		chart = new Chart(canvas, {
			type: config.chartType || 'line',
			data: {
				datasets: [
					{
						label: config.title,
						data: dataPoints,
						borderColor: 'hsl(221.2 83.2% 53.3%)',
						backgroundColor: 'rgba(59, 130, 246, 0.15)',
						borderWidth: 2,
						fill: true,
						tension: 0.35
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'linear',
						title: { display: true, text: config.xAxisLabel }
					},
					y: {
						title: { display: true, text: config.yAxisLabel }
					}
				}
			}
		});
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<div class="flex h-[400px] flex-col rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
	<h3 class="mb-4 border-b pb-2 text-lg font-semibold">{config.title}</h3>
	<div class="relative min-h-0 flex-1 w-full">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>