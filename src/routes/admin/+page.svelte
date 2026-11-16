<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let activeTab = $state<'overview' | 'users' | 'events' | 'sessions' | 'quizzes'>('overview');
	let userSearch = $state('');
	let eventFilter = $state('');
	let actionLoading = $state(false);

	const BACKGROUND_LABELS: Record<string, string> = {
		psych_year1: 'Psychology Year 1',
		psych_year2: 'Psychology Year 2',
		psych_year3plus: 'Psychology Year 3+',
		other_student: 'Student (Other Field)',
		enthusiast: 'Self-Learner / Enthusiast',
		educator: 'Teacher / Educator',
		other: 'Other',
		unspecified: 'Unspecified'
	};

	const FAMILIARITY_LABELS: Record<string, string> = {
		beginner: 'Beginner',
		some: 'Some Familiarity',
		comfortable: 'Comfortable',
		advanced: 'Advanced',
		unspecified: 'Unspecified'
	};

	const GOAL_LABELS: Record<string, string> = {
		studying_psych: 'Studying Psychology',
		understanding_psych: 'Understanding Psychology',
		study_methods: 'Improving Study Methods',
		teaching: 'Teaching / Education',
		curiosity: 'Personal Curiosity',
		apply_other: 'Applying to Another Field',
		other: 'Other',
		unspecified: 'Unspecified'
	};

	const filteredUsers = $derived(
		data.users.filter((u) => {
			if (!userSearch) return true;
			const q = userSearch.toLowerCase();
			return (
				u.name.toLowerCase().includes(q) ||
				u.email.toLowerCase().includes(q) ||
				(u.academic_background && u.academic_background.toLowerCase().includes(q))
			);
		})
	);

	const filteredEvents = $derived(
		data.recentEvents.filter((e) => {
			if (!eventFilter) return true;
			return e.event_type === eventFilter || e.theory === eventFilter;
		})
	);
</script>

<svelte:head>
	<title>Admin & Evaluation Console – Manobodha</title>
</svelte:head>

<main class="admin-page">
	<div class="admin-container">
		<!-- Header -->
		<header class="admin-header">
			<div class="header-left">
				<div class="header-badges">
					<span class="badge-creator">Creator Console</span>
					<span class="badge-role">VIT Capstone Research</span>
				</div>
				<h1 class="admin-title">Platform Evaluation & Data</h1>
				<p class="admin-sub">
					Real-time audience demographics, user activity, and concept check efficacy.
				</p>
			</div>

			<!-- Quick Export & Actions -->
			<div class="header-actions">
				<div class="dropdown-wrap">
					<span class="action-label">Export CSV:</span>
					<div class="export-links">
						<a href="/admin/export?type=users" class="btn-export">Users</a>
						<a href="/admin/export?type=events" class="btn-export">Interactions</a>
						<a href="/admin/export?type=sessions" class="btn-export">Sessions</a>
						<a href="/admin/export?type=quizzes" class="btn-export">Quizzes</a>
					</div>
				</div>
			</div>
		</header>

		<!-- Alert notification from form actions -->
		{#if form?.message}
			<div class="alert" class:alert-success={form.success} class:alert-error={!form.success} role="alert">
				{form.message}
			</div>
		{/if}

		<!-- ============ Quick Co-Creator Invite ============ -->
		<div class="admin-card invite-card">
			<div class="invite-info">
				<div class="invite-icon">✦</div>
				<div>
					<h3>Co-Creator Admin Access</h3>
					<p>Grant administrator status to your capstone partner. They can also be added in <code>.env</code> under <code>ADMIN_EMAILS</code>.</p>
				</div>
			</div>
			<form
				method="POST"
				action="?/grantAdminByEmail"
				use:enhance={() => {
					actionLoading = true;
					return async ({ update }) => {
						actionLoading = false;
						await update();
					};
				}}
				class="invite-form"
			>
				<input
					type="email"
					name="email"
					placeholder="partner@vitbhopal.ac.in"
					required
					disabled={actionLoading}
				/>
				<button type="submit" class="btn-primary" disabled={actionLoading}>
					{actionLoading ? 'Granting…' : 'Make Admin'}
				</button>
			</form>
		</div>

		<!-- ============ KPI Metrics Cards ============ -->
		<section class="kpi-grid">
			<div class="kpi-card">
				<span class="kpi-label">Registered Learners</span>
				<div class="kpi-num">{data.summary.totalUsers}</div>
				<div class="kpi-sub">
					<span><strong>{data.summary.googleUsers}</strong> via Google</span>
					<span>•</span>
					<span><strong>{data.summary.localUsers}</strong> via Email</span>
				</div>
			</div>

			<div class="kpi-card">
				<span class="kpi-label">Theory Sessions</span>
				<div class="kpi-num">{data.summary.totalSessions}</div>
				<div class="kpi-sub">
					<span class="highlight">{data.summary.completedSessions} completed</span>
					<span>({data.summary.completionRate}%)</span>
				</div>
			</div>

			<div class="kpi-card">
				<span class="kpi-label">Concept Check Pass Rate</span>
				<div class="kpi-num">{data.summary.quizAccuracy}%</div>
				<div class="kpi-sub">
					<span><strong>{data.summary.correctQuizzes}</strong> / {data.summary.totalQuizzes} answers correct</span>
				</div>
			</div>

			<div class="kpi-card">
				<span class="kpi-label">Avg. Confidence</span>
				<div class="kpi-num">
					{data.summary.avgConfidence ? `${data.summary.avgConfidence} / 5` : '—'}
				</div>
				<div class="kpi-sub">
					<span>{data.summary.totalRatings} self-ratings submitted</span>
				</div>
			</div>

			<div class="kpi-card">
				<span class="kpi-label">Interactions Tracked</span>
				<div class="kpi-num">{data.summary.totalEvents}</div>
				<div class="kpi-sub">
					<span>Telemetry & sandbox events</span>
				</div>
			</div>
		</section>

		<!-- ============ Navigation Tabs ============ -->
		<nav class="admin-tabs" aria-label="Admin Sections">
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === 'overview'}
				onclick={() => (activeTab = 'overview')}
			>
				Overview & Demographics
			</button>
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === 'users'}
				onclick={() => (activeTab = 'users')}
			>
				Learner Directory ({data.users.length})
			</button>
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === 'events'}
				onclick={() => (activeTab = 'events')}
			>
				Live Interaction Log ({data.recentEvents.length})
			</button>
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === 'sessions'}
				onclick={() => (activeTab = 'sessions')}
			>
				Theory Sessions ({data.recentSessions.length})
			</button>
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === 'quizzes'}
				onclick={() => (activeTab = 'quizzes')}
			>
				Concept Checks ({data.recentQuizzes.length})
			</button>
		</nav>

		<!-- ============ TAB 1: OVERVIEW & DEMOGRAPHICS ============ -->
		{#if activeTab === 'overview'}
			<div class="tab-content">
				<div class="charts-grid">
					<!-- Academic Background -->
					<div class="admin-card chart-card">
						<div class="card-head">
							<h3>Audience Background</h3>
							<span class="card-note">Target: 1st/2nd yr students & self-learners</span>
						</div>
						<div class="bar-list">
							{#each data.breakdowns.background as item}
								{@const pct = data.summary.totalUsers > 0 ? Math.round((item.total / data.summary.totalUsers) * 100) : 0}
								<div class="bar-row">
									<div class="bar-info">
										<span class="bar-label">{BACKGROUND_LABELS[item.label ?? 'unspecified'] ?? item.label}</span>
										<span class="bar-count"><strong>{item.total}</strong> ({pct}%)</span>
									</div>
									<div class="bar-track">
										<div class="bar-fill rust" style="width: {pct}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Psychology Familiarity -->
					<div class="admin-card chart-card">
						<div class="card-head">
							<h3>Psychology Familiarity</h3>
							<span class="card-note">Prior familiarity distribution</span>
						</div>
						<div class="bar-list">
							{#each data.breakdowns.familiarity as item}
								{@const pct = data.summary.totalUsers > 0 ? Math.round((item.total / data.summary.totalUsers) * 100) : 0}
								<div class="bar-row">
									<div class="bar-info">
										<span class="bar-label">{FAMILIARITY_LABELS[item.label ?? 'unspecified'] ?? item.label}</span>
										<span class="bar-count"><strong>{item.total}</strong> ({pct}%)</span>
									</div>
									<div class="bar-track">
										<div class="bar-fill blue" style="width: {pct}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Primary Goal -->
					<div class="admin-card chart-card">
						<div class="card-head">
							<h3>Learner Goals</h3>
							<span class="card-note">Primary motivation for visiting</span>
						</div>
						<div class="bar-list">
							{#each data.breakdowns.goal as item}
								{@const pct = data.summary.totalUsers > 0 ? Math.round((item.total / data.summary.totalUsers) * 100) : 0}
								<div class="bar-row">
									<div class="bar-info">
										<span class="bar-label">{GOAL_LABELS[item.label ?? 'unspecified'] ?? item.label}</span>
										<span class="bar-count"><strong>{item.total}</strong> ({pct}%)</span>
									</div>
									<div class="bar-track">
										<div class="bar-fill sage" style="width: {pct}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Interaction Types -->
					<div class="admin-card chart-card">
						<div class="card-head">
							<h3>Activity Breakdown</h3>
							<span class="card-note">Events by trigger type</span>
						</div>
						<div class="bar-list">
							{#each data.breakdowns.events as item}
								{@const pct = data.summary.totalEvents > 0 ? Math.round((item.total / data.summary.totalEvents) * 100) : 0}
								<div class="bar-row">
									<div class="bar-info">
										<span class="bar-label"><code>{item.label}</code></span>
										<span class="bar-count"><strong>{item.total}</strong> ({pct}%)</span>
									</div>
									<div class="bar-track">
										<div class="bar-fill yel" style="width: {pct}%"></div>
									</div>
								</div>
							{/each}
							{#if data.breakdowns.events.length === 0}
								<p class="empty-note">No interaction events logged yet.</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- ============ TAB 2: USER DIRECTORY ============ -->
		{#if activeTab === 'users'}
			<div class="tab-content">
				<div class="table-card admin-card">
					<div class="table-toolbar">
						<input
							type="search"
							placeholder="Search by name, email, background…"
							bind:value={userSearch}
							class="table-search"
						/>
						<span class="table-count">Showing {filteredUsers.length} of {data.users.length} users</span>
					</div>

					<div class="table-responsive">
						<table class="data-table">
							<thead>
								<tr>
									<th>Learner</th>
									<th>Provider</th>
									<th>Background</th>
									<th>Familiarity</th>
									<th>Goal</th>
									<th>Registered</th>
									<th>Last Active</th>
									<th>Admin Role</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredUsers as u (u.id)}
									<tr>
										<td>
											<div class="user-meta">
												<strong>{u.name}</strong>
												<small>{u.email}</small>
											</div>
										</td>
										<td>
											<span class="badge" class:badge-google={u.auth_provider === 'google'}>
												{u.auth_provider === 'google' ? 'Google' : 'Email'}
											</span>
										</td>
										<td>
											<span class="bg-tag">
												{BACKGROUND_LABELS[u.academic_background ?? 'unspecified'] ?? u.academic_background ?? '—'}
											</span>
										</td>
										<td>
											{FAMILIARITY_LABELS[u.psychology_familiarity ?? 'unspecified'] ?? u.psychology_familiarity ?? '—'}
										</td>
										<td>
											<small class="goal-text">
												{GOAL_LABELS[u.primary_goal ?? 'unspecified'] ?? u.primary_goal ?? '—'}
											</small>
										</td>
										<td><small>{u.created_at}</small></td>
										<td><small>{u.last_login_at ?? 'Never'}</small></td>
										<td>
											<form method="POST" action="?/toggleAdmin" use:enhance class="role-form">
												<input type="hidden" name="userId" value={u.id} />
												{#if u.is_admin}
													<input type="hidden" name="makeAdmin" value="0" />
													<button
														type="submit"
														class="role-badge is-admin"
														title="Click to revoke admin access"
													>
														Admin ✓
													</button>
												{:else}
													<input type="hidden" name="makeAdmin" value="1" />
													<button
														type="submit"
														class="role-badge not-admin"
														title="Click to grant admin access"
													>
														+ Make Admin
													</button>
												{/if}
											</form>
										</td>
									</tr>
								{/each}
								{#if filteredUsers.length === 0}
									<tr>
										<td colspan="8" class="text-center empty-cell">No users match your filter.</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- ============ TAB 3: LIVE INTERACTION LOG ============ -->
		{#if activeTab === 'events'}
			<div class="tab-content">
				<div class="table-card admin-card">
					<div class="table-toolbar">
						<select bind:value={eventFilter} class="table-select">
							<option value="">All Event Types & Theories</option>
							<option value="sandbox_started">sandbox_started</option>
							<option value="sandbox_completed">sandbox_completed</option>
							<option value="quiz_started">quiz_started</option>
							<option value="quiz_completed">quiz_completed</option>
							<option value="mindmap_viewed">mindmap_viewed</option>
							<option value="comparison_viewed">comparison_viewed</option>
							<option value="operant-conditioning">operant-conditioning</option>
							<option value="ebbinghaus-curve">ebbinghaus-curve</option>
						</select>
						<span class="table-count">Showing {filteredEvents.length} events</span>
					</div>

					<div class="table-responsive">
						<table class="data-table">
							<thead>
								<tr>
									<th>Timestamp</th>
									<th>Learner</th>
									<th>Theory</th>
									<th>Event</th>
									<th>Metadata</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredEvents as e (e.id)}
									<tr>
										<td><small class="mono-time">{e.created_at}</small></td>
										<td>
											{#if e.user_name}
												<strong>{e.user_name}</strong>
												<br /><small>{e.user_email}</small>
											{:else}
												<span class="text-muted">Guest / Anonymous</span>
											{/if}
										</td>
										<td><span class="theory-pill">{e.theory}</span></td>
										<td><span class="event-pill">{e.event_type}</span></td>
										<td>
											{#if e.metadata}
												<code class="metadata-code">{e.metadata}</code>
											{:else}
												<span class="text-muted">—</span>
											{/if}
										</td>
									</tr>
								{/each}
								{#if filteredEvents.length === 0}
									<tr>
										<td colspan="5" class="text-center empty-cell">
											No interaction events recorded yet. Open a sandbox or quiz to see events stream in real-time.
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- ============ TAB 4: THEORY SESSIONS ============ -->
		{#if activeTab === 'sessions'}
			<div class="tab-content">
				<div class="table-card admin-card">
					<div class="table-responsive">
						<table class="data-table">
							<thead>
								<tr>
									<th>Learner</th>
									<th>Theory</th>
									<th>Started At</th>
									<th>Completed At</th>
									<th>Duration</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{#each data.recentSessions as s (s.id)}
									<tr>
										<td>
											{#if s.user_name}
												<strong>{s.user_name}</strong>
												<br /><small>{s.user_email}</small>
											{:else}
												<span class="text-muted">Guest / Anonymous</span>
											{/if}
										</td>
										<td><span class="theory-pill">{s.theory}</span></td>
										<td><small>{s.started_at}</small></td>
										<td><small>{s.completed_at ?? 'In progress / exited'}</small></td>
										<td>
											{#if s.duration_seconds !== null}
												<span>{Math.floor(s.duration_seconds / 60)}m {s.duration_seconds % 60}s</span>
											{:else}
												<span class="text-muted">—</span>
											{/if}
										</td>
										<td>
											{#if s.completed_at}
												<span class="status-pill status-complete">Completed</span>
											{:else}
												<span class="status-pill status-partial">Exited early</span>
											{/if}
										</td>
									</tr>
								{/each}
								{#if data.recentSessions.length === 0}
									<tr>
										<td colspan="6" class="text-center empty-cell">No theory sessions recorded yet.</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- ============ TAB 5: CONCEPT CHECKS ============ -->
		{#if activeTab === 'quizzes'}
			<div class="tab-content">
				<div class="table-card admin-card">
					<div class="table-responsive">
						<table class="data-table">
							<thead>
								<tr>
									<th>Learner</th>
									<th>Theory</th>
									<th>Question ID</th>
									<th>Selected Answer</th>
									<th>Result</th>
									<th>Timestamp</th>
								</tr>
							</thead>
							<tbody>
								{#each data.recentQuizzes as q (q.id)}
									<tr>
										<td>
											{#if q.user_name}
												<strong>{q.user_name}</strong>
												<br /><small>{q.user_email}</small>
											{:else}
												<span class="text-muted">Guest / Anonymous</span>
											{/if}
										</td>
										<td><span class="theory-pill">{q.theory}</span></td>
										<td><code>{q.question_id}</code></td>
										<td><span class="answer-text">{q.answer}</span></td>
										<td>
											{#if q.correct}
												<span class="result-pill pass">✓ Correct</span>
											{:else}
												<span class="result-pill fail">✗ Incorrect</span>
											{/if}
										</td>
										<td><small>{q.created_at}</small></td>
									</tr>
								{/each}
								{#if data.recentQuizzes.length === 0}
									<tr>
										<td colspan="6" class="text-center empty-cell">No concept check results submitted yet.</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	.admin-page {
		min-height: calc(100vh - var(--nav-h, 64px));
		padding: clamp(28px, 4vw, 48px) var(--page-pad, 28px) 96px;
		background: var(--bg, #f7f4ee);
		color: var(--ink, #172238);
		font-family: 'DM Sans', system-ui, sans-serif;
	}

	.admin-container {
		max-width: var(--page-max, 1160px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	/* Header */
	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		flex-wrap: wrap;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--line, #d8d4ca);
	}

	.header-badges {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	.badge-creator {
		background: var(--rust, #b44f3b);
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 4px;
	}

	.badge-role {
		background: color-mix(in srgb, var(--ink, #172238) 8%, transparent);
		color: var(--ink, #172238);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 4px;
	}

	.admin-title {
		margin: 0;
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 400;
		font-size: clamp(28px, 4vw, 42px);
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.admin-sub {
		margin: 6px 0 0;
		font-size: 15px;
		color: var(--mut, #596177);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.dropdown-wrap {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--pap, #eeeae0);
		padding: 6px 12px;
		border-radius: 8px;
		border: 1px solid var(--line, #d8d4ca);
	}

	.action-label {
		font-size: 12px;
		font-weight: 600;
		color: var(--mut, #596177);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.export-links {
		display: flex;
		gap: 4px;
	}

	.btn-export {
		font-size: 12.5px;
		font-weight: 600;
		padding: 4px 8px;
		border-radius: 4px;
		color: var(--ink, #172238);
		background: var(--bg, #f7f4ee);
		text-decoration: none;
		border: 1px solid var(--line, #d8d4ca);
		transition: background-color 0.15s, border-color 0.15s;
	}

	.btn-export:hover {
		background: var(--ink, #172238);
		color: var(--bg, #f7f4ee);
		border-color: var(--ink, #172238);
	}

	/* Alerts */
	.alert {
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 14px;
		line-height: 1.45;
	}

	.alert-success {
		background: color-mix(in srgb, var(--sage, #6b7c69) 15%, transparent);
		color: var(--sage, #6b7c69);
		border: 1px solid color-mix(in srgb, var(--sage, #6b7c69) 30%, transparent);
	}

	.alert-error {
		background: color-mix(in srgb, var(--rust, #b44f3b) 12%, transparent);
		color: var(--rust, #b44f3b);
		border: 1px solid color-mix(in srgb, var(--rust, #b44f3b) 25%, transparent);
	}

	/* Co-Creator Invite Card */
	.admin-card {
		background: var(--pap, #eeeae0);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 12px;
		padding: 20px 24px;
	}

	.invite-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
		background: color-mix(in srgb, var(--blue, #566f8f) 8%, var(--pap, #eeeae0));
		border-color: color-mix(in srgb, var(--blue, #566f8f) 25%, var(--line, #d8d4ca));
	}

	.invite-info {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.invite-icon {
		font-size: 24px;
		color: var(--blue, #566f8f);
	}

	.invite-info h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
	}

	.invite-info p {
		margin: 3px 0 0;
		font-size: 13.5px;
		color: var(--mut, #596177);
	}

	.invite-info code {
		font-family: monospace;
		background: color-mix(in srgb, var(--ink, #172238) 8%, transparent);
		padding: 1px 4px;
		border-radius: 3px;
		font-size: 12px;
	}

	.invite-form {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.invite-form input {
		padding: 9px 12px;
		font-size: 14px;
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 8px;
		background: var(--bg, #f7f4ee);
		color: var(--ink, #172238);
		min-width: 240px;
	}

	.invite-form input:focus {
		border-color: var(--ink, #172238);
		outline: none;
	}

	.btn-primary {
		padding: 9px 16px;
		background: var(--ink, #172238);
		color: var(--bg, #f7f4ee);
		border: none;
		border-radius: 8px;
		font-size: 13.5px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.15s;
		white-space: nowrap;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--rust, #b44f3b);
	}

	/* KPI Grid */
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}

	.kpi-card {
		background: var(--bg, #f7f4ee);
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 12px;
		padding: 18px 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		transition: transform 0.15s, border-color 0.15s;
	}

	.kpi-card:hover {
		transform: translateY(-2px);
		border-color: var(--ink, #172238);
	}

	.kpi-label {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--mut, #596177);
	}

	.kpi-num {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 32px;
		font-weight: 400;
		line-height: 1;
		color: var(--ink, #172238);
		margin: 4px 0;
	}

	.kpi-sub {
		font-size: 12.5px;
		color: var(--mut, #596177);
		display: flex;
		gap: 6px;
		align-items: center;
		flex-wrap: wrap;
	}

	.kpi-sub .highlight {
		color: var(--sage, #6b7c69);
		font-weight: 600;
	}

	/* Tabs */
	.admin-tabs {
		display: flex;
		gap: 6px;
		border-bottom: 2px solid var(--line, #d8d4ca);
		overflow-x: auto;
		padding-bottom: 2px;
	}

	.tab-btn {
		background: none;
		border: none;
		padding: 10px 16px;
		font-size: 14px;
		font-weight: 600;
		color: var(--mut, #596177);
		cursor: pointer;
		position: relative;
		white-space: nowrap;
		transition: color 0.15s;
		font-family: inherit;
	}

	.tab-btn:hover {
		color: var(--ink, #172238);
	}

	.tab-btn.active {
		color: var(--rust, #b44f3b);
	}

	.tab-btn.active::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -4px;
		height: 3px;
		background: var(--rust, #b44f3b);
		border-radius: 2px;
	}

	.tab-content {
		animation: fadeIn 0.25s ease both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Charts Grid */
	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
		gap: 20px;
	}

	.chart-card {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		border-bottom: 1px solid var(--line, #d8d4ca);
		padding-bottom: 10px;
	}

	.card-head h3 {
		margin: 0;
		font-family: 'Fraunces', Georgia, serif;
		font-size: 18px;
		font-weight: 400;
	}

	.card-note {
		font-size: 12px;
		color: var(--mut, #596177);
	}

	.bar-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.bar-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.bar-info {
		display: flex;
		justify-content: space-between;
		font-size: 13.5px;
	}

	.bar-label {
		color: var(--ink, #172238);
	}

	.bar-count {
		color: var(--mut, #596177);
		font-size: 12.5px;
	}

	.bar-track {
		height: 8px;
		background: color-mix(in srgb, var(--ink, #172238) 8%, transparent);
		border-radius: 999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	.bar-fill.rust {
		background: var(--rust, #b44f3b);
	}
	.bar-fill.blue {
		background: var(--blue, #566f8f);
	}
	.bar-fill.sage {
		background: var(--sage, #6b7c69);
	}
	.bar-fill.yel {
		background: var(--yel, #c9a04f);
	}

	.empty-note {
		margin: 0;
		font-size: 13px;
		color: var(--mut, #596177);
		font-style: italic;
	}

	/* Data Tables */
	.table-card {
		padding: 0;
		overflow: hidden;
	}

	.table-toolbar {
		padding: 16px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		border-bottom: 1px solid var(--line, #d8d4ca);
		flex-wrap: wrap;
	}

	.table-search,
	.table-select {
		padding: 8px 12px;
		font-size: 14px;
		border: 1px solid var(--line, #d8d4ca);
		border-radius: 8px;
		background: var(--bg, #f7f4ee);
		color: var(--ink, #172238);
		min-width: 260px;
	}

	.table-count {
		font-size: 13px;
		color: var(--mut, #596177);
	}

	.table-responsive {
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13.5px;
		text-align: left;
	}

	.data-table th {
		background: color-mix(in srgb, var(--ink, #172238) 4%, var(--pap, #eeeae0));
		padding: 12px 16px;
		font-weight: 600;
		color: var(--mut, #596177);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid var(--line, #d8d4ca);
		white-space: nowrap;
	}

	.data-table td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--line, #d8d4ca);
		vertical-align: middle;
	}

	.data-table tr:last-child td {
		border-bottom: none;
	}

	.data-table tr:hover td {
		background: color-mix(in srgb, var(--ink, #172238) 2%, transparent);
	}

	.user-meta strong {
		display: block;
		font-size: 14px;
		color: var(--ink, #172238);
	}

	.user-meta small {
		color: var(--mut, #596177);
	}

	.badge {
		display: inline-block;
		padding: 2px 7px;
		border-radius: 4px;
		font-size: 11.5px;
		font-weight: 600;
		background: color-mix(in srgb, var(--ink, #172238) 10%, transparent);
		color: var(--ink, #172238);
	}

	.badge-google {
		background: color-mix(in srgb, var(--blue, #566f8f) 15%, transparent);
		color: var(--blue, #566f8f);
	}

	.bg-tag {
		font-size: 12.5px;
		color: var(--ink, #172238);
	}

	.goal-text {
		color: var(--mut, #596177);
	}

	.role-form {
		margin: 0;
	}

	.role-badge {
		padding: 4px 8px;
		font-size: 11.5px;
		font-weight: 600;
		border-radius: 4px;
		cursor: pointer;
		font-family: inherit;
		border: 1px solid transparent;
		transition: 0.15s;
	}

	.role-badge.is-admin {
		background: var(--rust, #b44f3b);
		color: #fff;
	}

	.role-badge.is-admin:hover {
		background: color-mix(in srgb, var(--rust, #b44f3b) 80%, black);
	}

	.role-badge.not-admin {
		background: transparent;
		border-color: var(--line, #d8d4ca);
		color: var(--mut, #596177);
	}

	.role-badge.not-admin:hover {
		border-color: var(--ink, #172238);
		color: var(--ink, #172238);
	}

	.mono-time {
		font-family: monospace;
		font-size: 12px;
		color: var(--mut, #596177);
	}

	.theory-pill {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		background: color-mix(in srgb, var(--blue, #566f8f) 12%, transparent);
		color: var(--blue, #566f8f);
	}

	.event-pill {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 12px;
		font-family: monospace;
		background: color-mix(in srgb, var(--rust, #b44f3b) 12%, transparent);
		color: var(--rust, #b44f3b);
	}

	.metadata-code {
		font-size: 11.5px;
		background: color-mix(in srgb, var(--ink, #172238) 6%, transparent);
		padding: 2px 6px;
		border-radius: 4px;
		max-width: 240px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		white-space: nowrap;
	}

	.status-pill {
		display: inline-block;
		padding: 3px 8px;
		border-radius: 4px;
		font-size: 11.5px;
		font-weight: 600;
	}

	.status-complete {
		background: color-mix(in srgb, var(--sage, #6b7c69) 15%, transparent);
		color: var(--sage, #6b7c69);
	}

	.status-partial {
		background: color-mix(in srgb, var(--yel, #c9a04f) 20%, transparent);
		color: color-mix(in srgb, var(--ink, #172238) 85%, var(--yel, #c9a04f));
	}

	.result-pill {
		display: inline-block;
		padding: 3px 8px;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 600;
	}

	.result-pill.pass {
		background: color-mix(in srgb, var(--sage, #6b7c69) 15%, transparent);
		color: var(--sage, #6b7c69);
	}

	.result-pill.fail {
		background: color-mix(in srgb, var(--rust, #b44f3b) 12%, transparent);
		color: var(--rust, #b44f3b);
	}

	.empty-cell {
		padding: 32px 16px;
		color: var(--mut, #596177);
		font-style: italic;
	}

	.text-center {
		text-align: center;
	}

	.text-muted {
		color: var(--mut, #596177);
		font-size: 12.5px;
	}

	@media (max-width: 780px) {
		.admin-header {
			flex-direction: column;
		}
		.invite-card {
			flex-direction: column;
			align-items: flex-start;
		}
		.invite-form {
			width: 100%;
			flex-direction: column;
		}
		.invite-form input {
			width: 100%;
		}
		.charts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
