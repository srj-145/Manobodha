<script lang="ts">
	import { page } from '$app/stores';
	import { resolveRoute } from '$app/paths';
	import '$lib/css/sandbox.css';
	import SandboxShell from '$lib/components/sandbox/SandboxShell.svelte';
	import OperantSandbox from '$lib/components/sandbox/OperantSandbox.svelte';
	import ForgettingSandbox from '$lib/components/sandbox/ForgettingSandbox.svelte';

	const theoryId = $derived($page.params.theoryId ?? '');
</script>

<!-- Shell = sticky sub-nav + dark glass theme + animated switch between the two models -->
<SandboxShell {theoryId}>
	{#if theoryId === 'operant-conditioning'}
		<OperantSandbox />
	{:else if theoryId === 'ebbinghaus-curve'}
		<ForgettingSandbox />
	{:else}
		<div class="sb">
			<h1>Sandbox not found</h1>
			<p class="sb-lede">There is no sandbox called “{theoryId}”.</p>
			<div class="sb-btns"><a class="sb-btn" href={resolveRoute('/explore')}>← Back to all sandboxes</a></div>
		</div>
	{/if}
</SandboxShell>
