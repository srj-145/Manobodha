<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let { form } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Sign in – Manobodha</title>
	<meta name="description" content="Sign in to Manobodha to access interactive psychology sandboxes." />
</svelte:head>

<main class="auth-page">
	<div class="auth-card">
		<!-- Brand mark -->
		<div class="auth-brand">
			<a href="/" class="brand-link">Manobodha<i>.</i></a>
			<p class="auth-subtitle">Understand theories. <em>Don't just memorize them.</em></p>
		</div>

		<h1 class="auth-title">Sign in</h1>

		<!-- Error banners -->
		{#if form?.message && form?.field === 'general'}
			<div class="alert alert-error" role="alert">
				{form.message}
			</div>
		{/if}
<!-- Email/password form -->
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
			class="auth-form"
			novalidate
		>
			<div class="field">
				<label for="email">Email address</label>
				<input
					type="email"
					id="email"
					name="email"
					autocomplete="email"
					required
					placeholder="you@example.com"
					aria-describedby={form?.field === 'email' ? 'email-error' : undefined}
					aria-invalid={form?.field === 'email' ? 'true' : undefined}
				/>
				{#if form?.field === 'email'}
					<span id="email-error" class="field-error" role="alert">{form.message}</span>
				{/if}
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					autocomplete="current-password"
					required
					placeholder="Your password"
				/>
			</div>

			<button type="submit" class="btn-primary" disabled={loading} aria-busy={loading}>
				{#if loading}
					<span class="spinner" aria-hidden="true"></span>
					Signing in…
				{:else}
					Sign in
				{/if}
			</button>
		</form>

<p class="auth-footer">
			Don't have an account? <a href="/register">Create one</a>
		</p>

		<!-- Subtle T&C reminder -->
		<p class="auth-terms">
			By continuing, you agree to our <a href="/terms">Terms & Conditions</a>. Interactions remain strictly anonymous.
		</p>
	</div>
</main>

<style>
	.auth-page {
		min-height: calc(100vh - var(--nav-h, 64px));
		display: grid;
		place-items: center;
		padding: clamp(32px, 5vw, 64px) var(--page-pad, 24px);
		font-family: 'DM Sans', system-ui, sans-serif;
	}

	.auth-card {
		width: 100%;
		max-width: 420px;
		background: var(--bg, #f7f4ee);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 16px;
		padding: clamp(28px, 5vw, 40px) clamp(20px, 4vw, 36px);
		box-shadow: 0 4px 24px rgba(23, 34, 56, 0.05);
	}

	.auth-brand {
		text-align: center;
		margin-bottom: 24px;
	}

	.brand-link {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 26px;
		font-weight: 400;
		letter-spacing: -0.025em;
		color: var(--ink, #172238);
		text-decoration: none;
	}

	.brand-link i {
		color: var(--rust, #b44f3b);
		font-style: normal;
	}

	.auth-subtitle {
		margin: 6px 0 0;
		font-size: 13.5px;
		color: var(--mut, #596177);
	}

	.auth-title {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 400;
		font-size: clamp(22px, 3.5vw, 26px);
		line-height: 1.25;
		color: var(--ink, #172238);
		margin: 0 0 20px;
		text-align: center;
	}

	.alert {
		padding: 12px 14px;
		border-radius: 8px;
		font-size: 14px;
		margin-bottom: 18px;
		line-height: 1.45;
	}

	.alert-error {
		background: color-mix(in srgb, var(--rust, #b44f3b) 12%, transparent);
		color: var(--rust, #b44f3b);
		border: 1px solid color-mix(in srgb, var(--rust, #b44f3b) 25%, transparent);
	}

	.alert-warning {
		background: color-mix(in srgb, var(--yel, #c9a04f) 14%, transparent);
		color: color-mix(in srgb, var(--ink, #172238) 85%, var(--yel, #c9a04f));
		border: 1px solid color-mix(in srgb, var(--yel, #c9a04f) 30%, transparent);
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field label {
		font-size: 13.5px;
		font-weight: 500;
		color: var(--ink, #172238);
	}

	.field input {
		padding: 10px 13px;
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 8px;
		background: var(--bg, #f7f4ee);
		color: var(--ink, #172238);
		font-family: inherit;
		font-size: 14.5px;
		outline: none;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.field input:focus {
		border-color: var(--ink, #172238);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ink, #172238) 12%, transparent);
	}

	.field input[aria-invalid='true'] {
		border-color: var(--rust, #b44f3b);
	}

	.field-error {
		font-size: 12.5px;
		color: var(--rust, #b44f3b);
	}

	.btn-primary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 20px;
		background: var(--ink, #172238);
		color: var(--bg, #f7f4ee);
		border: none;
		border-radius: 8px;
		font-family: inherit;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.15s, transform 0.1s;
		margin-top: 4px;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--rust, #b44f3b);
	}

	.btn-primary:active:not(:disabled) {
		transform: scale(0.99);
	}

	.btn-primary:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid color-mix(in srgb, var(--bg, #f7f4ee) 40%, transparent);
		border-top-color: var(--bg, #f7f4ee);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 22px 0;
		color: var(--mut, #596177);
		font-size: 13px;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--line, #d8d4ca);
	}
.auth-footer {
		margin: 22px 0 0;
		text-align: center;
		font-size: 13.5px;
		color: var(--mut, #596177);
	}

	.auth-footer a {
		color: var(--ink, #172238);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.auth-footer a:hover {
		color: var(--rust, #b44f3b);
	}

	.auth-terms {
		margin: 16px 0 0;
		text-align: center;
		font-size: 12px;
		line-height: 1.5;
		color: var(--mut, #596177);
	}

	.auth-terms a {
		color: var(--rust, #b44f3b);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.auth-terms a:hover {
		color: var(--ink, #172238);
	}

	@media (max-width: 480px) {
		.auth-card {
			padding: 24px 18px;
		}
	}
</style>
