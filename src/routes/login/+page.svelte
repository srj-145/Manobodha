<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let { form } = $props();

	let loading = $state(false);

	const urlError = $derived.by(() => {
		const err = page.url.searchParams.get('error');
		if (err === 'google_not_configured') {
			return 'Google sign-in is not yet configured in this environment. Please sign in with email and password, or see setup instructions.';
		}
		if (err === 'google_cancelled') {
			return 'Google sign-in was cancelled. Please try again or use email and password.';
		}
		if (err === 'google_failed') {
			return 'Google authentication could not be completed. Please try again or use your password.';
		}
		if (err === 'invalid_oauth_state') {
			return 'Your sign-in session expired. Please try again.';
		}
		return null;
	});
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

		{#if urlError}
			<div class="alert alert-warning" role="alert">
				{urlError}
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

		<div class="divider"><span>or</span></div>

		<!-- Google OAuth -->
		<a href="/auth/google" class="btn-google">
			<svg class="google-icon" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="#4285F4"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="#34A853"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="#FBBC05"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
				/>
				<path
					fill="#EA4335"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
				/>
			</svg>
			Continue with Google
		</a>

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

	.btn-google {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 11px 20px;
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 8px;
		background: var(--bg, #f7f4ee);
		color: var(--ink, #172238);
		font-family: inherit;
		font-size: 14.5px;
		font-weight: 500;
		text-decoration: none;
		transition: background-color 0.15s, border-color 0.15s;
	}

	.btn-google:hover {
		background: var(--pap, #eeeae0);
		border-color: color-mix(in srgb, var(--ink, #172238) 25%, transparent);
	}

	.google-icon {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
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
