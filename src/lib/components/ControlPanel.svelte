<script lang="ts">
	import type { ControlSchema } from '$lib/types/theory';

	let {
		controls = [],
		values = $bindable({}),
		activeIds = [],
		ontakeover
	}: {
		controls: ControlSchema[];
		values: Record<string, string | number | boolean>;
		/** Controls the automated demo is currently moving — they glow while syncing. */
		activeIds?: string[];
		/** Fired when the user touches a control, so the demo can hand over. */
		ontakeover?: () => void;
	} = $props();

	const pct = (c: ControlSchema) => {
		const v = Number(values[c.id] ?? c.defaultValue);
		return ((v - (c.min ?? 0)) / ((c.max ?? 100) - (c.min ?? 0))) * 100;
	};
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="cp" onpointerdown={() => ontakeover?.()} onkeydown={() => ontakeover?.()} role="group" aria-label="Simulation controls">
	{#each controls as c (c.id)}
		<div class="row" class:flash={activeIds.includes(c.id)}>
			<div class="top">
				<label for={c.id}>{c.label}</label>
				{#if c.type === 'slider'}
					<output for={c.id}>{values[c.id] ?? c.defaultValue}{c.unit ?? ''}</output>
				{/if}
			</div>

			{#if c.type === 'slider'}
				<input
					id={c.id}
					type="range"
					min={c.min}
					max={c.max}
					step={c.step ?? 1}
					bind:value={values[c.id]}
					style="--p:{pct(c)}%"
				/>
			{:else if c.type === 'dropdown'}
				<select id={c.id} bind:value={values[c.id]}>
					{#each c.options ?? [] as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</select>
			{:else}
				<button
					id={c.id}
					type="button"
					role="switch"
					aria-checked={!!values[c.id]}
					class="sw"
					class:on={!!values[c.id]}
					onclick={() => (values[c.id] = !values[c.id])}
				>
					<i></i><span>{values[c.id] ? 'On' : 'Off'}</span>
				</button>
			{/if}

			{#if c.tooltip}<p class="tip">{c.tooltip}</p>{/if}
		</div>
	{/each}
</div>

<style>
	.cp {
		display: grid;
		gap: 6px;
	}
	.row {
		padding: 12px 12px 10px;
		border: 1px solid transparent;
		border-radius: 6px;
		transition:
			background 0.3s,
			border-color 0.3s,
			box-shadow 0.3s;
	}
	.row.flash {
		background: color-mix(in srgb, var(--yel) 16%, transparent);
		border-color: var(--yel);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--yel) 18%, transparent);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 8px;
	}
	label {
		font-weight: 600;
		font-size: 14px;
		line-height: 1.3;
	}
	output {
		font: 600 13px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--rust);
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 4px;
		padding: 4px 7px;
		min-width: 3.2em;
		text-align: center;
	}
	.tip {
		margin: 8px 0 0;
		font-size: 12.5px;
		line-height: 1.45;
		color: var(--mut);
	}
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 28px;
		background: transparent;
		cursor: pointer;
		margin: 0;
	}
	input[type='range']::-webkit-slider-runnable-track {
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(to right, var(--rust) var(--p), var(--line) var(--p));
	}
	input[type='range']::-moz-range-track {
		height: 6px;
		border-radius: 3px;
		background: var(--line);
	}
	input[type='range']::-moz-range-progress {
		height: 6px;
		border-radius: 3px;
		background: var(--rust);
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		margin-top: -7px;
		border-radius: 50%;
		background: var(--bg);
		border: 2px solid var(--rust);
	}
	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--bg);
		border: 2px solid var(--rust);
	}
	select {
		width: 100%;
		min-height: 44px;
		padding: 8px 10px;
		font: inherit;
		font-size: 14.5px;
		color: var(--ink);
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 4px;
	}
	.sw {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 0 14px 0 10px;
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		color: var(--mut);
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 999px;
		cursor: pointer;
		transition: 0.2s;
	}
	.sw i {
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--line);
		position: relative;
		transition: 0.25s;
	}
	.sw i::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--bg);
		transition: 0.25s;
	}
	.sw.on {
		color: var(--ink);
		border-color: var(--rust);
	}
	.sw.on i {
		background: var(--rust);
	}
	.sw.on i::after {
		transform: translateX(14px);
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none !important;
		}
	}
</style>
