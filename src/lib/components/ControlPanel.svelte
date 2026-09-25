<script lang="ts">
	import type { ControlSchema } from '$lib/types/theory';

	let {
		controls = [],
		values = $bindable({})
	}: {
		controls: ControlSchema[];
		values: Record<string, any>;
	} = $props();
</script>

<div class="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
	<h2 class="border-b pb-2 text-lg font-semibold">Simulation Controls</h2>

	{#each controls as control (control.id)}
		<div class="space-y-1">
			<div class="flex items-center justify-between text-sm font-medium">
				<label for={control.id}>{control.label}</label>
				{#if control.type === 'slider'}
					<span class="text-xs text-muted-foreground">{values[control.id] ?? control.defaultValue}</span>
				{/if}
			</div>

			{#if control.type === 'slider'}
				<input
					id={control.id}
					type="range"
					min={control.min ?? 0}
					max={control.max ?? 100}
					step={control.step ?? 1}
					value={values[control.id]}
					oninput={(e) => (values[control.id] = Number(e.currentTarget.value))}
					class="w-full cursor-pointer accent-primary"
				/>
			{:else if control.type === 'dropdown'}
				<select
					id={control.id}
					bind:value={values[control.id]}
					class="w-full rounded-md border bg-background p-2 text-sm"
				>
					{#each control.options ?? [] as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{:else if control.type === 'toggle'}
				<button
					type="button"
					onclick={() => (values[control.id] = !values[control.id])}
					class="w-full rounded-md border p-2 text-xs font-semibold transition-colors {values[control.id]
						? 'bg-primary text-primary-foreground'
						: 'bg-muted text-muted-foreground'}"
				>
					{values[control.id] ? 'Enabled' : 'Disabled'}
				</button>
			{/if}

			{#if control.tooltip}
				<p class="text-[11px] text-muted-foreground">{control.tooltip}</p>
			{/if}
		</div>
	{/each}
</div>