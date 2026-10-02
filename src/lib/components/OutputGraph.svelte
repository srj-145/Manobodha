<script lang="ts">
	import { onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
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
	let chart: Chart | null = null;

	function initOrUpdateChart() {
		if (!canvas) return;

		if (chart) {
			chart.data.labels = dataPoints.map((p) => p.x);
			chart.data.datasets[0].data = dataPoints.map((p) => p.y);
			chart.data.datasets[0].label = config.title;

			// Typed scale reference to avoid Chart.js scale union errors without 'any'
			const scales = chart.options.scales as Record<
				string,
				{ title?: { display?: boolean; text?: string } } | undefined
			>;

			if (scales?.x?.title) {
				scales.x.title.text = config.xAxisLabel;
			}
			if (scales?.y?.title) {
				scales.y.title.text = config.yAxisLabel;
			}

			chart.update();
			return;
		}

		chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: dataPoints.map((p) => p.x),
				datasets: [
					{
						label: config.title,
						data: dataPoints.map((p) => p.y),
						borderColor: 'rgb(59, 130, 246)',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						borderWidth: 2,
						fill: true,
						tension: 0.1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						title: {
							display: true,
							text: config.xAxisLabel
						}
					},
					y: {
						title: {
							display: true,
							text: config.yAxisLabel
						},
						beginAtZero: true
					}
				}
			}
		});
	}

	$effect(() => {
		initOrUpdateChart();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
			chart = null;
		}
	});
</script>

<div class="flex h-[400px] flex-col rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
	<div class="relative h-full w-full flex-1">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>
