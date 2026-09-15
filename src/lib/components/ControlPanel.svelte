<script lang="ts">
	import type { ControlSchema } from '$lib/types/theory';

	let {
		controls = [],
		values = $bindable({})
	}: {
		controls: ControlSchema[];
		values: Record<string, any>;
	} = $props();

	function updateValue(id: string, val: any) {
		values[id] = val;
	}
</script>

<div class="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
	<h3 class="border-b pb-2 text-lg font-semibold">Simulation Controls</h3>

	{#each controls as control (control.id)}
		<div class="space-y-2">
			<div class="flex items-center justify-between text-sm font-medium">
				<label for={control.id} class="text-foreground">{control.label}</label>
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
					min={control.min ?? 0}
					max={control.max ?? 100}
					step={control.step ?? 1}
					value={values[control.id] ?? control.defaultValue}
					oninput={(e) => updateValue(control.id, parseFloat(e.currentTarget.value))}
					class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
				/>

			{:else if control.type === 'toggle'}
				<button
					id={control.id}
					type="button"
					aria-pressed={values[control.id] ?? control.defaultValue}
					class="w-full rounded-md border py-2 text-sm font-medium transition-colors {values[control.id]
						? 'bg-primary text-primary-foreground'
						: 'bg-secondary text-secondary-foreground'}"
					onclick={() => updateValue(control.id, !values[control.id])}
				>
					{values[control.id] ? 'Enabled' : 'Disabled'}
				</button>

			{:else if control.type === 'dropdown'}
				<select
					id={control.id}
					value={values[control.id] ?? control.defaultValue}
					onchange={(e) => updateValue(control.id, e.currentTarget.value)}
					class="w-full rounded-md border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				>
					{#each control.options || [] as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{/if}

			{#if control.tooltip}
				<p class="text-xs text-muted-foreground">{control.tooltip}</p>
			{/if}
		</div>
	{/each}
</div>