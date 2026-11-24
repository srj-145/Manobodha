<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	let loading = $state(false);
	let password = $state('');
	let confirmPassword = $state('');

	// Strength: requires >= 8 chars
	const passwordStrong = $derived(password.length >= 8);
	const passwordsMatch = $derived(password === confirmPassword && confirmPassword.length > 0);
</script>

<svelte:head>
	<title>Create account – Manobodha</title>
	<meta
		name="description"
		content="Create a free Manobodha account to explore interactive psychology sandboxes."
	/>
</svelte:head>

<main class="auth-page">
	<div class="auth-card">
		<!-- Brand mark -->
		<div class="auth-brand">
			<a href="/" class="brand-link">Manobodha<i>.</i></a>
			<p class="auth-subtitle">Understand theories. <em>Don't just memorize them.</em></p>
		</div>

		<h1 class="auth-title">Create your account</h1>

		<!-- General error -->
		{#if form?.message && form?.field === 'general'}
			<div class="alert alert-error" role="alert">{form.message}</div>
		{/if}

		<form
			method="POST"
			action="?/register"
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
			<!-- ============ Account details ============ -->
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Account details</legend>

				<div class="field">
					<label for="name">Display name</label>
					<input
						type="text"
						id="name"
						name="name"
						autocomplete="name"
						required
						placeholder="e.g. Priya Sharma"
						aria-describedby={form?.field === 'name' ? 'name-error' : undefined}
						aria-invalid={form?.field === 'name' ? 'true' : undefined}
					/>
					{#if form?.field === 'name'}
						<span id="name-error" class="field-error" role="alert">{form.message}</span>
					{/if}
				</div>

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
						autocomplete="new-password"
						required
						placeholder="At least 8 characters"
						bind:value={password}
						aria-describedby="password-hint"
						aria-invalid={form?.field === 'password' ? 'true' : undefined}
					/>
					<span id="password-hint" class="field-hint" class:hint-ok={passwordStrong}>
						{#if password.length === 0}
							Minimum 8 characters
						{:else if !passwordStrong}
							Too short — keep typing
						{:else}
							✓ Minimum length reached
						{/if}
					</span>
					{#if form?.field === 'password'}
						<span class="field-error" role="alert">{form.message}</span>
					{/if}
				</div>

				<div class="field">
					<label for="confirm_password">Confirm password</label>
					<input
						type="password"
						id="confirm_password"
						name="confirm_password"
						autocomplete="new-password"
						required
						placeholder="Repeat your password"
						bind:value={confirmPassword}
						aria-invalid={form?.field === 'confirm_password' ? 'true' : undefined}
					/>
					{#if confirmPassword.length > 0}
						<span class="field-hint" class:hint-ok={passwordsMatch}>
							{passwordsMatch ? '✓ Passwords match' : 'Passwords do not match yet'}
						</span>
					{/if}
					{#if form?.field === 'confirm_password'}
						<span class="field-error" role="alert">{form.message}</span>
					{/if}
				</div>
			</fieldset>

			<!-- ============ About you ============ -->
			<fieldset class="fieldset">
				<legend class="fieldset-legend">
					About you
					<span class="legend-note">Helps us understand our learner community</span>
				</legend>

				<div class="field">
					<label for="academic_background">What best describes you?</label>
					<select
						id="academic_background"
						name="academic_background"
						required
						aria-invalid={form?.field === 'academic_background' ? 'true' : undefined}
					>
						<option value="" disabled selected>Select…</option>
						<option value="psych_year1">Psychology student — Year 1</option>
						<option value="psych_year2">Psychology student — Year 2</option>
						<option value="psych_year3plus">Psychology student — Year 3+</option>
						<option value="other_student">Student in another field</option>
						<option value="enthusiast">Psychology enthusiast / self-learner</option>
						<option value="educator">Teacher / educator</option>
						<option value="other">Other</option>
					</select>
					{#if form?.field === 'academic_background'}
						<span class="field-error" role="alert">{form.message}</span>
					{/if}
				</div>

				<div class="field">
					<label for="psychology_familiarity">How familiar are you with psychology?</label>
					<select
						id="psychology_familiarity"
						name="psychology_familiarity"
						required
						aria-invalid={form?.field === 'psychology_familiarity' ? 'true' : undefined}
					>
						<option value="" disabled selected>Select…</option>
						<option value="beginner">Beginner — new to it</option>
						<option value="some">Some familiarity</option>
						<option value="comfortable">Comfortable with the basics</option>
						<option value="advanced">Advanced</option>
					</select>
					{#if form?.field === 'psychology_familiarity'}
						<span class="field-error" role="alert">{form.message}</span>
					{/if}
				</div>

				<div class="field">
					<label for="primary_goal">Why are you using Manobodha?</label>
					<select
						id="primary_goal"
						name="primary_goal"
						required
						aria-invalid={form?.field === 'primary_goal' ? 'true' : undefined}
					>
						<option value="" disabled selected>Select…</option>
						<option value="studying_psych">Studying psychology</option>
						<option value="understanding_psych">Understanding psychology better</option>
						<option value="study_methods">Improving my learning / study methods</option>
						<option value="teaching">Teaching / education</option>
						<option value="curiosity">Personal curiosity</option>
						<option value="apply_other">Applying psychology to another field</option>
						<option value="other">Other</option>
					</select>
					{#if form?.field === 'primary_goal'}
						<span class="field-error" role="alert">{form.message}</span>
					{/if}
				</div>

				<div class="field">
					<label for="referral_source">How did you find us? <span class="opt">(optional)</span></label>
					<select id="referral_source" name="referral_source">
						<option value="">Prefer not to say</option>
						<option value="university_class">University / class</option>
						<option value="friend">Friend or colleague</option>
						<option value="social_media">Social media</option>
						<option value="search_engine">Search engine</option>
						<option value="other">Other</option>
					</select>
				</div>
			</fieldset>

			<!-- ============ Terms & Conditions ============ -->
			<div class="tc-block">
				<label class="tc-label">
					<input
						type="checkbox"
						name="terms_agreed"
						id="terms_agreed"
						required
						aria-describedby={form?.field === 'terms_agreed' ? 'terms-error' : 'terms-desc'}
						aria-invalid={form?.field === 'terms_agreed' ? 'true' : undefined}
					/>
					<span id="terms-desc">
						I agree to the <a href="/terms" target="_blank" rel="noopener">Terms & Conditions</a>.
						Manobodha is open under the MIT Licence. User data remains strictly anonymous, and only
						the background section is analyzed for project evaluation.
					</span>
				</label>
				{#if form?.field === 'terms_agreed'}
					<span id="terms-error" class="field-error" role="alert">{form.message}</span>
				{/if}
			</div>

			<button type="submit" class="btn-primary" disabled={loading} aria-busy={loading}>
				{#if loading}
					<span class="spinner" aria-hidden="true"></span>
					Creating account…
				{:else}
					Create account
				{/if}
			</button>
		</form>

<p class="auth-footer">
			Already have an account? <a href="/login">Sign in</a>
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
		max-width: 480px;
		background: var(--bg, #f7f4ee);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 16px;
		padding: clamp(28px, 5vw, 42px);
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

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.fieldset {
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 12px;
		padding: 18px 16px 20px;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
		background: color-mix(in srgb, var(--pap, #eeeae0) 30%, transparent);
	}

	.fieldset-legend {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--mut, #596177);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0 6px;
		display: flex;
		align-items: baseline;
		gap: 8px;
		flex-wrap: wrap;
	}

	.legend-note {
		font-size: 11.5px;
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
		color: var(--mut, #596177);
		opacity: 0.85;
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

	.opt {
		font-weight: 400;
		color: var(--mut, #596177);
		font-size: 12.5px;
	}

	.field input,
	.field select {
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

	.field input:focus,
	.field select:focus {
		border-color: var(--ink, #172238);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ink, #172238) 12%, transparent);
	}

	.field input[aria-invalid='true'],
	.field select[aria-invalid='true'] {
		border-color: var(--rust, #b44f3b);
	}

	.field-error {
		font-size: 12.5px;
		color: var(--rust, #b44f3b);
	}

	.field-hint {
		font-size: 12px;
		color: var(--mut, #596177);
		transition: color 0.2s;
	}

	.field-hint.hint-ok {
		color: var(--sage, #6b7c69);
		font-weight: 500;
	}

	/* T&C Section */
	.tc-block {
		background: color-mix(in srgb, var(--pap, #eeeae0) 65%, transparent);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 10px;
		padding: 14px 16px;
	}

	.tc-label {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		cursor: pointer;
		font-size: 13px;
		color: var(--ink, #172238);
		line-height: 1.5;
	}

	.tc-label input[type='checkbox'] {
		width: 17px;
		height: 17px;
		flex-shrink: 0;
		margin-top: 2px;
		accent-color: var(--rust, #b44f3b);
		cursor: pointer;
	}

	.tc-label a {
		color: var(--rust, #b44f3b);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.tc-label a:hover {
		color: var(--ink, #172238);
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

	@media (max-width: 520px) {
		.auth-card {
			padding: 24px 18px;
		}
		.fieldset {
			padding: 14px 12px 16px;
		}
	}
</style>
