<script lang="ts">
	import type { ControlSchema } from '$lib/types/theory';

	let {
		controls = [],
		values = $bindable({})
	}: {
		controls: ControlSchema[];
		values: Record<string, string | number | boolean>;
	} = $props();
</script>

<div class="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
	<h2 class="text-lg font-semibold">Simulation Controls</h2>

	{#each controls as control (control.id)}
		<div class="space-y-1.5">
			<div class="flex items-center justify-between">
				<label for={control.id} class="text-sm font-medium">
					{control.label}
				</label>
				{#if control.type === 'slider'}
					<span class="font-mono text-xs text-muted-foreground">
						{values[control.id] ?? control.defaultValue}
					</span>
				{/if}
			</div>

			{#if control.type === 'slider'}
				<input
					id={control.id}
					type="range"
					min={control.min}
					max={control.max}
					step={control.step ?? 1}
					bind:value={values[control.id]}
					class="w-full accent-primary"
				/>
			{:else if control.type === 'dropdown'}
				<select
					id={control.id}
					bind:value={values[control.id]}
					class="w-full rounded-md border bg-background p-2 text-sm"
				>
					{#each control.options ?? [] as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{:else if control.type === 'toggle'}
				<button
					id={control.id}
					type="button"
					onclick={() => (values[control.id] = !values[control.id])}
					class="w-full rounded-md border p-2 text-sm font-medium transition-colors {values[
						control.id
					]
						? 'text-destructive-foreground bg-destructive'
						: 'bg-muted text-muted-foreground'}"
				>
					{values[control.id] ? 'Enabled' : 'Disabled'}
				</button>
			{/if}

			{#if control.tooltip}
				<p class="text-xs text-muted-foreground">{control.tooltip}</p>
			{/if}
		</div>
	{/each}
</div>
