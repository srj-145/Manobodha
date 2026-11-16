<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const BACKGROUND_LABELS: Record<string, string> = {
		psych_year1: 'Psychology student — Year 1',
		psych_year2: 'Psychology student — Year 2',
		psych_year3plus: 'Psychology student — Year 3+',
		other_student: 'Student in another field',
		enthusiast: 'Psychology enthusiast / self-learner',
		educator: 'Teacher / educator',
		other: 'Other'
	};

	const FAMILIARITY_LABELS: Record<string, string> = {
		beginner: 'Beginner',
		some: 'Some familiarity',
		comfortable: 'Comfortable with the basics',
		advanced: 'Advanced'
	};

	const GOAL_LABELS: Record<string, string> = {
		studying_psych: 'Studying psychology',
		understanding_psych: 'Understanding psychology better',
		study_methods: 'Improving my learning / study methods',
		teaching: 'Teaching / education',
		curiosity: 'Personal curiosity',
		apply_other: 'Applying psychology to another field',
		other: 'Other'
	};

	const REFERRAL_LABELS: Record<string, string> = {
		university_class: 'University / class',
		friend: 'Friend or colleague',
		social_media: 'Social media',
		search_engine: 'Search engine',
		other: 'Other'
	};

	let editingName = $state(false);
	let editingProfile = $state(false);
	$effect(() => { if (!data.profile) editingProfile = true; });
	let editingPassword = $state(false);

	let nameLoading = $state(false);
	let profileLoading = $state(false);
	let passwordLoading = $state(false);

	const nameSuccess = $derived(form?.action === 'updateName' && form?.success);
	const nameError = $derived(form?.action === 'updateName' && !form?.success ? form : null);
	const profileSuccess = $derived(form?.action === 'saveProfile' && form?.success);
	const profileError = $derived(form?.action === 'saveProfile' && !form?.success ? form : null);
	const pwSuccess = $derived(form?.action === 'changePassword' && form?.success);
	const pwError = $derived(form?.action === 'changePassword' && !form?.success ? form : null);

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Your account – Manobodha</title>
</svelte:head>

<main class="profile-page">
	<div class="profile-container">
		<header class="profile-header">
			<div>
				<p class="eyebrow">Account</p>
				<h1 class="profile-title">{data.user.name}</h1>
				<p class="profile-email">{data.user.email}</p>
			</div>
			<a href="/logout" class="btn-logout">Sign out</a>
		</header>

		{#if !data.profile}
			<div class="alert alert-info" role="status">
				<strong>Welcome to Manobodha!</strong> Please complete this quick "About you" section so we can understand our audience.
			</div>
		{/if}

		<!-- ======= Account Info ======= -->
		<section class="profile-section">
			<div class="section-header">
				<h2>Account information</h2>
				<p class="section-sub">Member since {formatDate(data.user.createdAt)}</p>
			</div>

			{#if editingName}
				<form
					method="POST"
					action="?/updateName"
					use:enhance={() => {
						nameLoading = true;
						return async ({ update }) => {
							nameLoading = false;
							editingName = false;
							await update();
						};
					}}
					class="inline-edit-form"
				>
					{#if nameError?.field === 'name' || nameError?.field === 'general'}
						<div class="alert alert-error" role="alert">{nameError.message}</div>
					{/if}
					<div class="field">
						<label for="name">Display name</label>
						<input
							type="text"
							id="name"
							name="name"
							value={data.user.name}
							required
							autocomplete="name"
						/>
					</div>
					<div class="btn-row">
						<button type="submit" class="btn-primary" disabled={nameLoading}>
							{nameLoading ? 'Saving…' : 'Save name'}
						</button>
						<button type="button" class="btn-ghost" onclick={() => (editingName = false)}>
							Cancel
						</button>
					</div>
				</form>
			{:else}
				<div class="info-row">
					<div>
						<span class="info-label">Display name</span>
						<span class="info-value">{data.user.name}</span>
					</div>
					<button class="btn-edit" onclick={() => (editingName = true)}>Edit</button>
				</div>
				{#if nameSuccess}
					<p class="success-msg" role="status">✓ {form?.message}</p>
				{/if}
			{/if}

			<div class="info-row">
				<div>
					<span class="info-label">Email address</span>
					<span class="info-value">{data.user.email}</span>
				</div>
			</div>

			<div class="info-row">
				<div>
					<span class="info-label">Sign-in provider</span>
					<span class="info-value provider-badge">{data.user.authProvider === 'google' ? 'Google' : 'Email & Password'}</span>
				</div>
			</div>
		</section>

		<!-- ======= Audience Profile ======= -->
		<section class="profile-section">
			<div class="section-header">
				<h2>Your background &amp; goals</h2>
				<p class="section-sub">Used to help us evaluate the educational impact of Manobodha</p>
			</div>

			{#if editingProfile || !data.profile}
				<form
					method="POST"
					action="?/saveProfile"
					use:enhance={() => {
						profileLoading = true;
						return async ({ update }) => {
							profileLoading = false;
							if (data.profile) editingProfile = false;
							await update();
						};
					}}
					class="inline-edit-form"
				>
					<input type="hidden" name="is_onboarding" value={!data.profile ? 'true' : 'false'} />

					{#if profileError?.field === 'general'}
						<div class="alert alert-error" role="alert">{profileError.message}</div>
					{/if}

					<div class="field">
						<label for="academic_background">What best describes you?</label>
						<select id="academic_background" name="academic_background" required>
							<option value="" disabled selected={!data.profile}>Select…</option>
							<option value="psych_year1" selected={data.profile?.academicBackground === 'psych_year1'}>
								Psychology student — Year 1
							</option>
							<option value="psych_year2" selected={data.profile?.academicBackground === 'psych_year2'}>
								Psychology student — Year 2
							</option>
							<option value="psych_year3plus" selected={data.profile?.academicBackground === 'psych_year3plus'}>
								Psychology student — Year 3+
							</option>
							<option value="other_student" selected={data.profile?.academicBackground === 'other_student'}>
								Student in another field
							</option>
							<option value="enthusiast" selected={data.profile?.academicBackground === 'enthusiast'}>
								Psychology enthusiast / self-learner
							</option>
							<option value="educator" selected={data.profile?.academicBackground === 'educator'}>
								Teacher / educator
							</option>
							<option value="other" selected={data.profile?.academicBackground === 'other'}>
								Other
							</option>
						</select>
						{#if profileError?.field === 'academic_background'}
							<span class="field-error" role="alert">{profileError.message}</span>
						{/if}
					</div>

					<div class="field">
						<label for="psychology_familiarity">How familiar are you with psychology?</label>
						<select id="psychology_familiarity" name="psychology_familiarity" required>
							<option value="" disabled selected={!data.profile}>Select…</option>
							<option value="beginner" selected={data.profile?.psychologyFamiliarity === 'beginner'}>
								Beginner
							</option>
							<option value="some" selected={data.profile?.psychologyFamiliarity === 'some'}>
								Some familiarity
							</option>
							<option value="comfortable" selected={data.profile?.psychologyFamiliarity === 'comfortable'}>
								Comfortable with the basics
							</option>
							<option value="advanced" selected={data.profile?.psychologyFamiliarity === 'advanced'}>
								Advanced
							</option>
						</select>
						{#if profileError?.field === 'psychology_familiarity'}
							<span class="field-error" role="alert">{profileError.message}</span>
						{/if}
					</div>

					<div class="field">
						<label for="primary_goal">Primary reason for using the platform</label>
						<select id="primary_goal" name="primary_goal" required>
							<option value="" disabled selected={!data.profile}>Select…</option>
							<option value="studying_psych" selected={data.profile?.primaryGoal === 'studying_psych'}>
								Studying psychology
							</option>
							<option value="understanding_psych" selected={data.profile?.primaryGoal === 'understanding_psych'}>
								Understanding psychology better
							</option>
							<option value="study_methods" selected={data.profile?.primaryGoal === 'study_methods'}>
								Improving my learning/study methods
							</option>
							<option value="teaching" selected={data.profile?.primaryGoal === 'teaching'}>
								Teaching/education
							</option>
							<option value="curiosity" selected={data.profile?.primaryGoal === 'curiosity'}>
								Personal curiosity
							</option>
							<option value="apply_other" selected={data.profile?.primaryGoal === 'apply_other'}>
								Applying psychology to another field
							</option>
							<option value="other" selected={data.profile?.primaryGoal === 'other'}>
								Other
							</option>
						</select>
						{#if profileError?.field === 'primary_goal'}
							<span class="field-error" role="alert">{profileError.message}</span>
						{/if}
					</div>

					<div class="field">
						<label for="referral_source">How did you hear about us? <span class="opt">(optional)</span></label>
						<select id="referral_source" name="referral_source">
							<option value="" selected={!data.profile?.referralSource}>Select…</option>
							<option value="university_class" selected={data.profile?.referralSource === 'university_class'}>
								University/class
							</option>
							<option value="friend" selected={data.profile?.referralSource === 'friend'}>
								Friend
							</option>
							<option value="social_media" selected={data.profile?.referralSource === 'social_media'}>
								Social media
							</option>
							<option value="search_engine" selected={data.profile?.referralSource === 'search_engine'}>
								Search engine
							</option>
							<option value="other" selected={data.profile?.referralSource === 'other'}>
								Other
							</option>
						</select>
					</div>

					{#if !data.profile}
						<div class="tc-block">
							<label class="tc-label">
								<input type="checkbox" name="terms_agreed" required />
								<span>
									I agree to the <a href="/terms" target="_blank" rel="noopener">Terms & Conditions</a>. Manobodha is open under the MIT Licence; interactions remain strictly anonymous, and only the background section is analyzed for project evaluation.
								</span>
							</label>
							{#if profileError?.field === 'terms_agreed' || profileError?.field === 'data_consent'}
								<span class="field-error" role="alert">{profileError.message}</span>
							{/if}
						</div>
					{/if}

					<div class="btn-row">
						<button type="submit" class="btn-primary" disabled={profileLoading}>
							{profileLoading ? 'Saving…' : !data.profile ? 'Save & continue to sandboxes' : 'Save changes'}
						</button>
						{#if data.profile}
							<button type="button" class="btn-ghost" onclick={() => (editingProfile = false)}>
								Cancel
							</button>
						{/if}
					</div>
				</form>
			{:else}
				<div class="profile-summary">
					<div class="info-row">
						<div>
							<span class="info-label">Academic / psychology background</span>
							<span class="info-value">{BACKGROUND_LABELS[data.profile?.academicBackground ?? ''] ?? data.profile?.academicBackground ?? '—'}</span>
						</div>
					</div>
					<div class="info-row">
						<div>
							<span class="info-label">Psychology familiarity</span>
							<span class="info-value">{FAMILIARITY_LABELS[data.profile?.psychologyFamiliarity ?? ''] ?? data.profile?.psychologyFamiliarity ?? '—'}</span>
						</div>
					</div>
					<div class="info-row">
						<div>
							<span class="info-label">Primary goal</span>
							<span class="info-value">{GOAL_LABELS[data.profile?.primaryGoal ?? ''] ?? data.profile?.primaryGoal ?? '—'}</span>
						</div>
					</div>
					{#if data.profile?.referralSource}
						<div class="info-row">
							<div>
								<span class="info-label">Found us via</span>
								<span class="info-value">{REFERRAL_LABELS[data.profile.referralSource] ?? data.profile.referralSource}</span>
							</div>
						</div>
					{/if}
				</div>
				<button class="btn-edit-section" onclick={() => (editingProfile = true)}>
					Edit background
				</button>
				{#if profileSuccess}
					<p class="success-msg" role="status">✓ {form?.message ?? 'Profile saved.'}</p>
				{/if}
			{/if}
		</section>

		<!-- ======= Change Password ======= -->
		{#if data.user.hasPassword}
			<section class="profile-section">
				<div class="section-header">
					<h2>Password &amp; Security</h2>
					<p class="section-sub">Update your account password</p>
				</div>

				{#if editingPassword}
					<form
						method="POST"
						action="?/changePassword"
						use:enhance={() => {
							passwordLoading = true;
							return async ({ update }) => {
								passwordLoading = false;
								if (form?.success) editingPassword = false;
								await update();
							};
						}}
						class="inline-edit-form"
					>
						{#if pwError?.field === 'general'}
							<div class="alert alert-error" role="alert">{pwError.message}</div>
						{/if}

						<div class="field">
							<label for="current_password">Current password</label>
							<input
								type="password"
								id="current_password"
								name="current_password"
								required
								autocomplete="current-password"
							/>
							{#if pwError?.field === 'current_password'}
								<span class="field-error" role="alert">{pwError.message}</span>
							{/if}
						</div>

						<div class="field">
							<label for="new_password">New password</label>
							<input
								type="password"
								id="new_password"
								name="new_password"
								required
								autocomplete="new-password"
								placeholder="At least 8 characters"
							/>
							{#if pwError?.field === 'new_password'}
								<span class="field-error" role="alert">{pwError.message}</span>
							{/if}
						</div>

						<div class="field">
							<label for="confirm_new_password">Confirm new password</label>
							<input
								type="password"
								id="confirm_new_password"
								name="confirm_new_password"
								required
								autocomplete="new-password"
							/>
							{#if pwError?.field === 'confirm_new_password'}
								<span class="field-error" role="alert">{pwError.message}</span>
							{/if}
						</div>

						<div class="btn-row">
							<button type="submit" class="btn-primary" disabled={passwordLoading}>
								{passwordLoading ? 'Saving…' : 'Change password'}
							</button>
							<button type="button" class="btn-ghost" onclick={() => (editingPassword = false)}>
								Cancel
							</button>
						</div>
					</form>
				{:else}
					<p class="info-value muted">Your password is securely hashed and stored in MySQL.</p>
					<button class="btn-edit-section" onclick={() => (editingPassword = true)}>
						Change password
					</button>
					{#if pwSuccess}
						<p class="success-msg" role="status">✓ {form?.message}</p>
					{/if}
				{/if}
			</section>
		{:else}
			<section class="profile-section">
				<div class="section-header">
					<h2>Password &amp; Security</h2>
				</div>
				<p class="info-value muted">You signed in with Google. Passwords are managed securely through your Google account.</p>
			</section>
		{/if}
	</div>
</main>

<style>
	.profile-page {
		min-height: calc(100vh - var(--nav-h, 64px));
		padding: 48px var(--page-pad, 24px) 80px;
		font-family: 'DM Sans', system-ui, sans-serif;
	}

	.profile-container {
		max-width: 640px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.profile-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.eyebrow {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rust, #b44f3b);
		margin: 0 0 6px;
	}

	.profile-title {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 400;
		font-size: 36px;
		line-height: 1.1;
		color: var(--ink, #172238);
		margin: 0;
	}

	.profile-email {
		margin: 6px 0 0;
		font-size: 15px;
		color: var(--mut, #596177);
	}

	.btn-logout {
		padding: 8px 16px;
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 8px;
		color: var(--mut, #596177);
		font-family: inherit;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
		transition: color 0.15s, border-color 0.15s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.btn-logout:hover {
		color: var(--rust, #b44f3b);
		border-color: var(--rust, #b44f3b);
	}

	.alert {
		padding: 12px 14px;
		border-radius: 8px;
		font-size: 14px;
	}

	.alert-error {
		background: color-mix(in srgb, var(--rust, #b44f3b) 10%, transparent);
		color: var(--rust, #b44f3b);
		border: 1px solid color-mix(in srgb, var(--rust, #b44f3b) 22%, transparent);
	}

	.alert-info {
		background: color-mix(in srgb, var(--blue, #566f8f) 10%, transparent);
		color: var(--ink, #172238);
		border: 1px solid color-mix(in srgb, var(--blue, #566f8f) 22%, transparent);
	}

	.profile-section {
		background: var(--pap, #eeeae0);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 12px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.section-header {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.section-header h2 {
		margin: 0;
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 400;
		font-size: 20px;
		color: var(--ink, #172238);
	}

	.section-sub {
		margin: 0;
		font-size: 13px;
		color: var(--mut, #596177);
	}

	.info-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid var(--line, #d8d4ca);
	}

	.info-row:last-of-type {
		border-bottom: none;
	}

	.info-label {
		display: block;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--mut, #596177);
		margin-bottom: 3px;
	}

	.info-value {
		font-size: 15px;
		color: var(--ink, #172238);
	}

	.info-value.muted {
		color: var(--mut, #596177);
	}

	.provider-badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 4px;
		background: color-mix(in srgb, var(--ink, #172238) 8%, transparent);
		font-size: 13px;
		font-weight: 500;
	}

	.profile-summary {
		display: flex;
		flex-direction: column;
	}

	.inline-edit-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.field label {
		font-size: 14px;
		font-weight: 500;
		color: var(--ink, #172238);
	}

	.opt {
		font-weight: 400;
		color: var(--mut, #596177);
		font-size: 13px;
	}

	.field input,
	.field select {
		padding: 9px 12px;
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 8px;
		background: var(--bg, #f7f4ee);
		color: var(--ink, #172238);
		font-family: inherit;
		font-size: 14.5px;
		outline: none;
		transition: border-color 0.15s;
	}

	.field input:focus,
	.field select:focus {
		border-color: var(--ink, #172238);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ink, #172238) 10%, transparent);
	}

	.field-error {
		font-size: 13px;
		color: var(--rust, #b44f3b);
	}

	.tc-block {
		background: color-mix(in srgb, var(--pap, #eeeae0) 65%, transparent);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 10px;
		padding: 14px 16px;
	}

	.tc-label {
		display: flex;
		gap: 12px;
		font-size: 13px;
		color: var(--ink, #172238);
		line-height: 1.5;
		cursor: pointer;
		align-items: flex-start;
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

	.btn-row {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.btn-primary {
		padding: 9px 18px;
		background: var(--ink, #172238);
		color: var(--bg, #f7f4ee);
		border: none;
		border-radius: 8px;
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.15s;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--rust, #b44f3b);
	}

	.btn-primary:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.btn-ghost {
		padding: 9px 18px;
		background: transparent;
		color: var(--mut, #596177);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 8px;
		font-family: inherit;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
	}

	.btn-ghost:hover {
		color: var(--ink, #172238);
		border-color: color-mix(in srgb, var(--ink, #172238) 30%, transparent);
	}

	.btn-edit {
		font-family: inherit;
		font-size: 13px;
		font-weight: 500;
		color: var(--blue, #566f8f);
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px 0;
		text-decoration: underline;
		text-underline-offset: 2px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.btn-edit:hover {
		color: var(--ink, #172238);
	}

	.btn-edit-section {
		font-family: inherit;
		font-size: 14px;
		font-weight: 500;
		color: var(--blue, #566f8f);
		background: none;
		border: 1px solid color-mix(in srgb, var(--blue, #566f8f) 40%, transparent);
		border-radius: 6px;
		padding: 7px 14px;
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
		align-self: flex-start;
	}

	.btn-edit-section:hover {
		color: var(--ink, #172238);
		border-color: color-mix(in srgb, var(--ink, #172238) 30%, transparent);
	}

	.success-msg {
		font-size: 13px;
		color: var(--sage, #6b7c69);
		margin: 4px 0 0;
	}

	@media (max-width: 600px) {
		.profile-header {
			flex-direction: column;
		}
		.profile-section {
			padding: 18px;
		}
	}
</style>
