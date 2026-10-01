<script lang="ts">
	import { resolveRoute } from '$app/paths';

	interface Theory {
		id: string;
		name: string;
		desc: string;
		tags: string[];
		pv: string;
		href: string;
		available: boolean;
	}

	const theories: Theory[] = [
		{
			id: 'operant-conditioning',
			name: 'Operant Conditioning',
			desc: 'Explore how reinforcement schedules influence patterns of responding and extinction bursts.',
			tags: ['Behaviour', 'Learning', 'Interactive simulation'],
			pv: 'operant',
			href: '/sandbox/operant-conditioning',
			available: true
		},
		{
			id: 'ebbinghaus-curve',
			name: 'Forgetting Curve',
			desc: 'Explore how recall changes over time and how spacing practice alters the memory stability curve.',
			tags: ['Memory', 'Learning', 'Interactive simulation'],
			pv: 'memory',
			href: '/sandbox/ebbinghaus-curve',
			available: true
		},
		{
			id: 'cognitive-load',
			name: 'Cognitive Load Theory',
			desc: 'Examine the working memory constraints and how intrinsic, extraneous, and germane load affect learning.',
			tags: ['Cognition', 'Learning', 'Conceptual'],
			pv: 'cognition',
			href: '/map',
			available: false
		},
		{
			id: 'social-learning',
			name: 'Social Learning Theory',
			desc: 'Analyze observational learning, modeling, and vicarious reinforcement mechanisms.',
			tags: ['Behaviour', 'Motivation', 'Conceptual'],
			pv: 'social',
			href: '/map',
			available: false
		}
	];

	let searchQuery = $state('');
	let selectedTag = $state('All');

	const tags = ['All', 'Behaviour', 'Memory', 'Learning', 'Cognition', 'Interactive simulation'];

	let filteredTheories = $derived(
		theories.filter((theory) => {
			const matchesSearch =
				theory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				theory.desc.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesTag = selectedTag === 'All' || theory.tags.includes(selectedTag);
			return matchesSearch && matchesTag;
		})
	);
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
	<!-- Navigation Header -->
	<header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
			<a href={resolveRoute('/')} class="font-bold text-lg text-white tracking-tight">
				Theory<i class="not-italic text-indigo-400">Lab</i>.
			</a>

			<nav id="nv" aria-label="Main Navigation" class="flex items-center gap-5 text-sm font-medium text-slate-300">
				<a href={resolveRoute('/')} class="hover:text-indigo-400 transition-colors">Home</a>
				<a href={resolveRoute('/explore')} class="text-indigo-400 font-semibold" aria-current="page">Explore</a>
				<a href={resolveRoute('/map')} class="hover:text-indigo-400 transition-colors">Theory Map</a>
				<a href={resolveRoute('/compare')} class="hover:text-indigo-400 transition-colors">Compare</a>
				<a href="/#about" class="hover:text-indigo-400 transition-colors">About</a>
			</nav>

			<a
				href="#choose"
				class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
			>
				Get Started <span class="arr">→</span>
			</a>
		</div>
	</header>

	<!-- Main Content Section -->
	<main class="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-10">
		<!-- Page Intro Header -->
		<div class="space-y-4 max-w-2xl">
			<span class="text-xs font-bold uppercase tracking-widest text-indigo-400">Interactive Directory</span>
			<h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
				Explore Psychological Theories
			</h1>
			<p class="text-slate-400 text-base leading-relaxed">
				Select a theory to run interactive simulations, test parameters, or visualize structural conceptual relationships across paradigms.
			</p>
		</div>

		<!-- Search and Filter Bar -->
		<div id="choose" class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-slate-800 pb-6">
			<!-- Search Input -->
			<div class="relative flex-1 max-w-md">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search theories or keywords..."
					class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
				/>
			</div>

			<!-- Tag Filter Buttons -->
			<div class="flex flex-wrap items-center gap-2">
				{#each tags as tag}
					<button
						onclick={() => (selectedTag = tag)}
						class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors {selectedTag === tag
							? 'bg-indigo-600 text-white'
							: 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>

		<!-- Theories Grid -->
		<section class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each filteredTheories as theory (theory.id)}
				<article
					class="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-6"
				>
					<div class="space-y-4">
						<div class="flex items-center justify-between gap-2">
							<h2 class="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
								{theory.name}
							</h2>
							{#if theory.available}
								<span class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
									Interactive
								</span>
							{:else}
								<span class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-slate-800 text-slate-400 border border-slate-700">
									Map Reference
								</span>
							{/if}
						</div>

						<p class="text-sm text-slate-400 leading-relaxed">
							{theory.desc}
						</p>

						<!-- Tags -->
						<div class="flex flex-wrap gap-2 pt-2">
							{#each theory.tags as tag}
								<span class="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-950 text-slate-400 border border-slate-800">
									{tag}
								</span>
							{/each}
						</div>
					</div>

					<!-- Direct Sandbox Link -->
					<div class="pt-4 border-t border-slate-800/60 flex items-center justify-between">
						{#if theory.available}
							<a
								href={theory.href}
								class="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group-hover:translate-x-1 transition-transform"
							>
								Launch Interactive Sandbox <span aria-hidden="true">→</span>
							</a>
						{:else}
							<a
								href={resolveRoute('/map')}
								class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors"
							>
								View on Theory Map <span aria-hidden="true">→</span>
							</a>
						{/if}
					</div>
				</article>
			{:else}
				<div class="col-span-full text-center py-12 text-slate-500">
					No psychological theories match your search criteria.
				</div>
			{/each}
		</section>
	</main>

	<!-- Footer Navigation -->
	<footer class="border-t border-slate-800 bg-slate-950 py-12 px-4 lg:px-8 text-slate-500 text-xs mt-20">
		<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="space-y-1 text-center md:text-left">
				<p class="font-bold text-slate-300 text-sm">TheoryLab – Dynamic Psychology Engine</p>
				<p>Built with SvelteKit 5, Chart.js & Tailwind CSS.</p>
			</div>
			<div class="flex items-center gap-6 text-slate-400">
				<a href={resolveRoute('/')} class="hover:text-white transition-colors">Home</a>
				<a href={resolveRoute('/map')} class="hover:text-white transition-colors">Theory Map</a>
				<a href={resolveRoute('/compare')} class="hover:text-white transition-colors">Compare Models</a>
			</div>
		</div>
	</footer>
</div>