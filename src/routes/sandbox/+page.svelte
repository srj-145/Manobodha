<script lang="ts">
	import { resolveRoute } from '$app/paths';
	import InfoTooltip from '$lib/components/InfoTooltip.svelte';
	import { accessibility } from '$lib/stores/accessibility.svelte';

	// Catalog of active interactive sandboxes
	const activeSandboxes = [
		{
			id: 'operant-conditioning',
			title: 'Operant Conditioning Sandbox',
			icon: '🎯',
			badge: 'Behavioral Psychology',
			description:
				'Dynamic Skinner Box simulation supporting 5 consequence types, 5 reinforcement schedules (FR, VR, FI, VI, Extinction), magnitude, delay, and real-time response graphs.',
			route: resolveRoute('/sandbox/[theoryId]', { theoryId: 'operant-conditioning' })
		},
		{
			id: 'ebbinghaus-curve',
			title: 'Ebbinghaus Forgetting Curve Sandbox',
			icon: '🧠',
			badge: 'Cognitive Psychology',
			description:
				'Interactive memory decay model graphing initial learning strength, exponential retention trajectories, spacing intervals, and active retrieval prompts over time.',
			route: resolveRoute('/sandbox/[theoryId]', { theoryId: 'ebbinghaus-curve' })
		}
	];

	// Secondary analytical tools
	const relatedTools = [
		{
			title: 'Curated Comparison Workbench',
			icon: '⚖️',
			description:
				'Overlaid dual-subject graphing canvas allowing direct side-by-side comparison of schedules or memory models with delta analysis.',
			route: resolveRoute('/compare'),
			buttonText: 'Open Comparison Engine →'
		},
		{
			title: 'Theory Relational Mind Map',
			icon: '🗺️',
			description:
				'Interactive DAG showing how behaviorism, cognitivism, and individual learning theories connect.',
			route: resolveRoute('/map'),
			buttonText: 'Explore Mind Map →'
		}
	];
</script>

<div
	class="min-h-screen space-y-8 p-6 transition-all"
	class:bg-black={accessibility.highContrast}
	class:text-white={accessibility.highContrast}
	class:text-lg={accessibility.fontScale === 'large'}
	class:text-xl={accessibility.fontScale === 'xlarge'}
>
	<!-- Header Navigation -->
	<header class="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-3xl font-extrabold tracking-tight">Interactive Sandboxes Hub</h1>
				<InfoTooltip text="Directory of active psychology simulation workbenches and modeling tools." />
			</div>
			<p class="mt-1 text-sm text-muted-foreground">
				Select an active laboratory workbench below to run live simulations, tweak variables, and test learning science models.
			</p>
		</div>

		<div class="flex items-center gap-3">
			<a
				href={resolveRoute('/')}
				class="rounded-lg border px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted"
			>
				← Back to Home
			</a>
			<button
				type="button"
				onclick={() => accessibility.toggleHighContrast()}
				class="rounded-lg border px-3 py-2 text-xs font-medium shadow-sm hover:bg-muted"
			>
				{accessibility.highContrast ? 'Standard Contrast' : 'High Contrast'}
			</button>
		</div>
	</header>

	<!-- Active Sandboxes Grid -->
	<section class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-bold">Active Simulation Models</h2>
			<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
				2 Workbenches Live
			</span>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each activeSandboxes as sandbox (sandbox.id)}
				<div
					class="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
				>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-3xl">{sandbox.icon}</span>
							<span class="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
								{sandbox.badge}
							</span>
						</div>
						<h3 class="text-xl font-bold">{sandbox.title}</h3>
						<p class="text-sm leading-relaxed text-muted-foreground">
							{sandbox.description}
						</p>
					</div>

					<div class="mt-6 border-t pt-4">
						<a
							href={sandbox.route}
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
						>
							Launch {sandbox.title.split(' ')[0]} Simulator →
						</a>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Related Workbench Tools -->
	<section class="space-y-4 pt-4">
		<h2 class="text-xl font-bold">Comparative & Mapping Tools</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each relatedTools as tool (tool.title)}
				<div class="flex flex-col justify-between rounded-xl border bg-card/60 p-6 shadow-sm">
					<div class="space-y-2">
						<div class="text-2xl">{tool.icon}</div>
						<h3 class="text-lg font-bold">{tool.title}</h3>
						<p class="text-xs leading-relaxed text-muted-foreground">{tool.description}</p>
					</div>

					<div class="mt-4">
						<a
							href={tool.route}
							class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
						>
							{tool.buttonText}
						</a>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>