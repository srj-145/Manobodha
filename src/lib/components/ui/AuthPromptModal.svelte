<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { fade, scale } from 'svelte/transition';

	let { user } = $props<{ user?: { id: string; name: string } | null }>();

	// Initial pop-up after 30 seconds; recurring pop-up every 1 minute (60s) after closing
	const INITIAL_TIMEOUT_SECONDS = 30;
	const RECURRING_TIMEOUT_SECONDS = 60;

	const STORAGE_TIMER = 'manobodha_auth_timer';
	const STORAGE_SHOWN_INITIAL = 'manobodha_auth_shown_initial';

	let isOpen = $state(false);
	let modalEl = $state<HTMLElement | undefined>(undefined);

	const isAuthPage = $derived.by(() => {
		const p = page.url.pathname;
		return p.startsWith('/login') || p.startsWith('/register') || p.startsWith('/logout');
	});

	const context = $derived.by(() => {
		const p = page.url.pathname;
		if (p.startsWith('/sandbox')) return 'sandbox';
		if (p.startsWith('/compare')) return 'compare';
		if (p.startsWith('/map')) return 'map';
		return 'general';
	});

	let hasShownInitial = false;
	let currentSeconds = 0;

	function dismiss() {
		isOpen = false;
		hasShownInitial = true;
		currentSeconds = 0;
		try {
			sessionStorage.setItem(STORAGE_SHOWN_INITIAL, 'true');
			sessionStorage.setItem(STORAGE_TIMER, '0');
		} catch {
			// ignore
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			dismiss();
		}
	}

	onMount(() => {
		if (user || isAuthPage) return;

		try {
			hasShownInitial = sessionStorage.getItem(STORAGE_SHOWN_INITIAL) === 'true';
			currentSeconds = parseInt(sessionStorage.getItem(STORAGE_TIMER) || '0', 10);
		} catch {
			// ignore
		}

		const getTargetTimeout = () => (hasShownInitial ? RECURRING_TIMEOUT_SECONDS : INITIAL_TIMEOUT_SECONDS);

		// If time was already reached before unmount/reload
		if (currentSeconds >= getTargetTimeout()) {
			isOpen = true;
			hasShownInitial = true;
			currentSeconds = 0;
			try {
				sessionStorage.setItem(STORAGE_SHOWN_INITIAL, 'true');
				sessionStorage.setItem(STORAGE_TIMER, '0');
			} catch {
				// ignore
			}
		}

		// Tick every second of active site browsing
		const interval = setInterval(() => {
			if (user || isAuthPage || isOpen) return;

			currentSeconds += 1;
			try {
				sessionStorage.setItem(STORAGE_TIMER, currentSeconds.toString());
			} catch {
				// ignore
			}

			if (currentSeconds >= getTargetTimeout()) {
				isOpen = true;
				hasShownInitial = true;
				currentSeconds = 0;
				try {
					sessionStorage.setItem(STORAGE_SHOWN_INITIAL, 'true');
					sessionStorage.setItem(STORAGE_TIMER, '0');
				} catch {
					// ignore
				}
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && !user && !isAuthPage}
	<!-- Backdrop -->
	<div
		class="modal-backdrop"
		transition:fade={{ duration: 220 }}
		onclick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
		role="presentation"
	>
		<!-- Dialog Box -->
		<div
			class="modal-box"
			bind:this={modalEl}
			transition:scale={{ start: 0.94, duration: 240 }}
			tabindex="-1"
			role="dialog"
			aria-modal="true"
			aria-labelledby="prompt-title"
			aria-describedby="prompt-desc"
		>
			<!-- Close button -->
			<button
				type="button"
				class="btn-close"
				onclick={dismiss}
				aria-label="Close dialog"
			>
				✕
			</button>

			<div class="modal-content">
				<img
					src="/mascot/excited.webp"
					alt="Bodhi mascot"
					class="modal-mascot"
					width="76"
					height="76"
				/>

				{#if context === 'sandbox'}
					<h2 id="prompt-title">Save your sandbox progress</h2>
					<p id="prompt-desc">
						You've been experimenting with psychology sandboxes! Create a free account or sign in
						to save your simulation trials, log concept check answers, and help evaluate our research.
					</p>
				{:else if context === 'compare'}
					<h2 id="prompt-title">Sign in to save comparisons</h2>
					<p id="prompt-desc">
						You've been comparing learning theories! Create an account to save your notes,
						track your concept checks, and keep your progress synced.
					</p>
				{:else if context === 'map'}
					<h2 id="prompt-title">Unlock your theory map journey</h2>
					<p id="prompt-desc">
						You've been exploring the Theory Mind Map! Join Manobodha to save your visited theories,
						complete knowledge checks, and support our educational research.
					</p>
				{:else}
					<h2 id="prompt-title">Enjoying Manobodha?</h2>
					<p id="prompt-desc">
						Create a free account or sign in to track your learning journey, save sandbox
						experiments, and complete quick concept checks.
					</p>
				{/if}

				<div class="modal-actions">
					<a href="/register" class="btn-create" onclick={dismiss}>
						Create free account
					</a>

					<div class="secondary-row">
						<span>Already have an account? <a href="/login" onclick={dismiss}>Sign in</a></span>
						<span class="sep">·</span>
						<button type="button" class="btn-guest" onclick={dismiss}>
							Continue as guest
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(17, 24, 38, 0.65);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		z-index: 1000;
		display: grid;
		place-items: center;
		padding: 20px;
		font-family: 'DM Sans', system-ui, sans-serif;
	}

	.modal-box {
		width: 100%;
		max-width: 450px;
		background: var(--bg, #f7f4ee);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 18px;
		padding: 32px 28px;
		box-shadow: 0 16px 40px rgba(23, 34, 56, 0.22);
		position: relative;
		text-align: center;
	}

	.btn-close {
		position: absolute;
		top: 14px;
		right: 14px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--line, #d8d4ca);
		background: transparent;
		color: var(--mut, #596177);
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-close:hover {
		color: var(--ink, #172238);
		border-color: var(--ink, #172238);
		background: color-mix(in srgb, var(--ink, #172238) 5%, transparent);
	}

	.modal-mascot {
		margin: 0 auto 12px;
		display: block;
		filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08));
	}

	h2 {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 400;
		font-size: 26px;
		color: var(--ink, #172238);
		margin: 0 0 10px;
		line-height: 1.2;
	}

	p {
		font-size: 14px;
		line-height: 1.5;
		color: var(--mut, #596177);
		margin: 0 0 24px;
	}

	.modal-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.btn-create {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 11px 20px;
		background: var(--ink, #172238);
		color: var(--bg, #f7f4ee);
		border-radius: 8px;
		font-size: 14.5px;
		font-weight: 600;
		text-decoration: none;
		transition: background-color 0.15s ease;
	}

	.btn-create:hover {
		background: var(--rust, #b44f3b);
	}

	.secondary-row {
		margin-top: 10px;
		font-size: 13px;
		color: var(--mut, #596177);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.secondary-row a {
		color: var(--ink, #172238);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.secondary-row a:hover {
		color: var(--rust, #b44f3b);
	}

	.sep {
		opacity: 0.5;
	}

	.btn-guest {
		background: none;
		border: none;
		color: var(--mut, #596177);
		font-family: inherit;
		font-size: 13px;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.btn-guest:hover {
		color: var(--ink, #172238);
	}
</style>
