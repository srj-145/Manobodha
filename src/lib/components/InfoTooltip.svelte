<script lang="ts">
	let {
		text,
		id = 'tooltip-' + Math.random().toString(36).substring(2, 9)
	}: { text: string; id?: string } = $props();

	let isVisible = $state(false);

	function show() { isVisible = true; }
	function hide() { isVisible = false; }
	function toggle() { isVisible = !isVisible; }
</script>

<div class="relative inline-flex items-center">
	<button
		type="button"
		aria-describedby={isVisible ? id : undefined}
		onmouseenter={show}
		onmouseleave={hide}
		onfocus={show}
		onblur={hide}
		onclick={toggle}
		class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
		aria-label="More information"
	>
		?
	</button>

	{#if isVisible}
		<div
			{id}
			role="tooltip"
			class="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-md border border-border bg-popover p-2 text-xs text-popover-foreground shadow-md transition-opacity"
		>
			{text}
		</div>
	{/if}
</div>