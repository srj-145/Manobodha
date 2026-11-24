<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { resolveRoute } from '$app/paths';
	import '$lib/css/lab.css';
	import BackButton from '$lib/components/ui/BackButton.svelte';

	let { theoryId, children }: { theoryId: string; children: Snippet } = $props();

	// Reference flow: 01 Learn → 02 Practice → 03 Review → 04 Recall.
	// Practice and Review ARE the two sandboxes, so the flow bar also switches models.
	// "Learn" is always shown as completed (navy), exactly like the reference.
	const steps = [
		{ n: '01', label: 'Learn', sub: 'Concept', href: '/explore', id: 'learn' },
		{ n: '02', label: 'Practice', sub: 'Operant conditioning', href: '/sandbox/operant-conditioning', id: 'operant-conditioning' },
		{ n: '03', label: 'Review', sub: 'Forgetting curve', href: '/sandbox/ebbinghaus-curve', id: 'ebbinghaus-curve' },
		{ n: '04', label: 'Recall', sub: 'Quiz', href: '/quiz', id: 'quiz' }
	];
	const dir = $derived(theoryId === 'ebbinghaus-curve' ? 1 : -1);
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="manolab">
	<header class="lab-header">
		<div class="head-left">
			<BackButton variant="sbx" fallback="/explore" />
			<div class="brand"><span class="dot"></span> Learning Psychology Lab</div>
		</div>
	</header>

	<nav class="learning-flow" aria-label="Learning flow">
		{#each steps as s, i (s.n)}
			{#if i > 0}<div class="flow-line" aria-hidden="true"></div>{/if}
			<a
				class="flow-step"
				class:active={s.id === 'learn' || s.id === theoryId}
				href={resolveRoute(s.href)}
				aria-current={s.id === theoryId ? 'page' : undefined}
			>
				<span>{s.n}</span><b>{s.label}</b><small>{s.sub}</small>
			</a>
		{/each}
	</nav>

	<!-- keyed on the model so switching tabs slides the new sandbox in -->
	{#key theoryId}
		<div in:fly={{ x: 32 * dir, duration: 320 }}>
			{@render children()}
		</div>
	{/key}
</div>
