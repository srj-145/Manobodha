<script lang="ts">
	import { onMount } from 'svelte';
	import { resolveRoute } from '$app/paths';

	interface Theory {
		name: string;
		desc: string;
		tags: string[];
		pv: 'operant' | 'memory';
		href: string;
	}

	const theories: Theory[] = [
		{
			name: 'Operant Conditioning',
			desc: 'Explore how reinforcement schedules influence patterns of responding.',
			tags: ['Behaviour', 'Learning', 'Interactive simulation'],
			pv: 'operant',
			href: '/sandbox/operant-conditioning'
		},
		{
			name: 'Forgetting Curve',
			desc: 'Explore how recall changes over time and how spacing practice changes the learning experience.',
			tags: ['Memory', 'Learning', 'Interactive simulation'],
			pv: 'memory',
			href: '/sandbox/ebbinghaus-curve'
		}
	];

	let isScrolled = $state(false);
	let isMobileOpen = $state(false);

	function toggleMobileMenu() {
		isMobileOpen = !isMobileOpen;
	}

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		const rvElements = document.querySelectorAll('.rv');
		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver(
				(entries) => {
					entries.forEach((x) => {
						if (x.isIntersecting) {
							x.target.classList.add('in');
							io.unobserve(x.target);
						}
					});
				},
				{ threshold: 0.1 }
			);
			rvElements.forEach((r) => io.observe(r));
		} else {
			rvElements.forEach((r) => r.classList.add('in'));
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>Explore theory – Manobodha</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="theory-lab-theme">


	<main>
		<!-- Intro Section -->
		<div class="w intro">
			<div>
				<p class="lab">Explore theory</p>
				<h1>See how theories <em>work.</em></h1>
				<p class="lede">
					Choose a theory, change what matters, and see the ideas behind it come to life.
				</p>
			</div>
			<div class="mini" aria-hidden="true">
				<svg viewBox="0 0 240 150">
					<g fill="none" stroke-linecap="round">
						<path stroke="var(--line)" d="M70 10V120H234" />
						<path
							class="ln"
							style="--l:260"
							stroke="var(--rust)"
							stroke-width="2.2"
							d="M74 112C110 100 130 50 170 40S214 24 232 18"
						/>
						<g stroke="var(--ink)" stroke-width="1.1">
							<path d="M6 36h46M6 70h46M6 104h46" />
						</g>
						<circle cx="170" cy="40" r="11" stroke="var(--ink)" />
					</g>
					<g fill="var(--bg)" stroke="var(--ink)">
						<circle cx="38" cy="36" r="5" />
						<circle cx="20" cy="70" r="5" />
						<circle cx="32" cy="104" r="5" />
					</g>
					<circle cx="170" cy="40" r="3" fill="var(--rust)" />
				</svg>
			</div>
		</div>

		<!-- Available Experiences Section -->
		<section id="choose" class="w">
			<div class="sec">
				<div>
					<p class="lab" style="margin-bottom:18px">Available experiences</p>
					<h2>Choose something to explore.</h2>
				</div>
			</div>

			<div class="list" id="list" role="list">
				{#each theories as theory, i (theory.name)}
					<a class="ex rv" href={theory.href}>
						<div>
							<span class="n">{String(i + 1).padStart(2, '0')}</span>
							<h3>{theory.name}</h3>
							<p>{theory.desc}</p>
							<ul class="meta">
								{#each theory.tags as tag (tag)}
									<li>{tag}</li>
								{/each}
							</ul>
							<span class="cta">Explore theory <span class="arr">→</span></span>
						</div>
						<div class="pv">
							{#if theory.pv === 'operant'}
								<svg viewBox="0 0 280 120" aria-hidden="true">
									<g fill="none" stroke-linecap="round">
										<path stroke="var(--line)" d="M70 8V104H272" />
										<path
											class="c"
											style="--l:420"
											stroke="var(--rust)"
											stroke-width="2.4"
											d="M74 98L110 84L114 66L160 54L164 38L214 28L218 14L268 8"
										/>
										<path
											class="c"
											style="--l:420"
											stroke="var(--blue)"
											stroke-width="2"
											stroke-dasharray="5 6"
											d="M74 100C130 94 190 70 268 40"
										/>
										<g stroke="var(--ink)" stroke-width="1.1">
											<path d="M8 30h44M8 60h44M8 90h44" />
										</g>
									</g>
									<g fill="var(--bg)" stroke="var(--ink)">
										<circle cx="30" cy="30" r="5" />
										<circle cx="18" cy="60" r="5" />
										<circle cx="38" cy="90" r="5" />
									</g>
								</svg>
							{:else if theory.pv === 'memory'}
								<svg viewBox="0 0 280 120" aria-hidden="true">
									<g fill="none" stroke-linecap="round">
										<path stroke="var(--line)" d="M30 8V104H272" />
										<path
											class="c"
											style="--l:420"
											stroke="var(--sage)"
											stroke-width="2.4"
											d="M34 12C60 70 100 96 140 100S220 104 268 104"
										/>
										<path
											class="c"
											style="--l:420"
											stroke="var(--rust)"
											stroke-width="2"
											d="M34 12C60 60 80 70 100 72C104 40 118 36 130 36C150 66 170 66 190 66C196 44 210 40 268 50"
										/>
									</g>
									<g fill="var(--yel)">
										<circle cx="100" cy="72" r="4" />
										<circle cx="190" cy="66" r="4" />
									</g>
									<g stroke="var(--yel)" stroke-width="1">
										<path d="M100 72V104M190 66V104" />
									</g>
								</svg>
							{/if}
						</div>
					</a>
				{/each}
			</div>

			<!-- More Experiences Coming Section -->
			<div class="soon rv">
				<p class="lab">More experiences are coming</p>
				<h2>A collection that keeps growing.</h2>
				<p class="p">
					Manobodha is designed as a growing collection of interactive theory experiences.
				</p>
				<div class="slots" id="slots" aria-hidden="true">
					<div class="slot"><span>In the works</span><i></i></div>
					<div class="slot"><i></i></div>
					<div class="slot"><i></i></div>
					<div class="slot"><i></i></div>
				</div>
				<p class="more">More to come.</p>
			</div>
		</section>

		<!-- How it Works Section -->
		<div class="how">
			<div class="w">
				<p class="lab rv">How it works</p>
				<h2 class="rv">What happens inside a sandbox.</h2>
				<div class="steps rv">
					<div>
						<b>01</b><span>Change</span>
						<p>Adjust the variables that matter.</p>
					</div>
					<div>
						<b>02</b><span>Observe</span>
						<p>Watch the theoretical mechanism respond.</p>
					</div>
					<div>
						<b>03</b><span>Understand</span>
						<p>Connect what you observed to the underlying theory.</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Final CTA Section -->
		<section class="w fin">
			<h2 class="rv">Ready to explore?</h2>
			<p class="rv">Pick a theory and start experimenting.</p>
			<a class="btn rv" href="#choose">Explore a theory <span class="arr">→</span></a>
		</section>
	</main>

	<!-- Footer -->
	<footer>
		<div class="w">
			<a class="logo" href={resolveRoute('/')}>Theory<i>Lab</i>.</a>
			<nav aria-label="Footer">
				<a href="/sandbox">Explore</a>
				<a href={resolveRoute('/map')}>Theory Map</a>
				<a href={resolveRoute('/compare')}>Compare</a>
				<a href="/#about">About</a>
			</nav>
			<p>An interactive learning project exploring psychology and learning theories.</p>
		</div>
	</footer>
</div>

<style>
	.theory-lab-theme {
		--bg: #f7f4ee;
		--ink: #172238;
		--mut: #596177;
		--line: #d8d4ca;
		--rust: #b44f3b;
		--sage: #6b7c69;
		--blue: #566f8f;
		--yel: #c9a04f;
		--pap: #eeeae0;
		--inv: #f7f4ee;
		box-sizing: border-box;
		background: var(--bg);
		color: var(--ink);
		font:
			400 17px/1.65 'DM Sans',
			system-ui,
			sans-serif;
		min-height: 100vh;
		-webkit-font-smoothing: antialiased;
	}

	@media (prefers-color-scheme: dark) {
		.theory-lab-theme {
			--bg: #111826;
			--ink: #ede8dc;
			--mut: #a3aabb;
			--line: #2b3446;
			--rust: #e27e67;
			--sage: #97aa95;
			--blue: #8ca8cc;
			--yel: #dfb866;
			--pap: #182034;
			--inv: #111826;
		}
	}

	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: calc(72px + env(safe-area-inset-top, 0px));
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	a:focus-visible {
		outline: 2px solid var(--rust);
		outline-offset: 3px;
	}

	h1,
	h2,
	h3 {
		font-family: Fraunces, Georgia, serif;
		font-weight: 300;
		letter-spacing: -0.025em;
	}

	.w {
		max-width: 1160px;
		margin: 0 auto;
		padding: 0 28px;
	}

	.lab {
		font:
			700 12px/1 'DM Sans',
			sans-serif;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--mut);
		margin: 0 0 24px;
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.lab:before {
		content: '';
		width: 28px;
		border-top: 1px solid var(--rust);
	}

	em {
		font-style: italic;
		color: var(--rust);
	}

	.arr {
		display: inline-block;
		transition: transform 0.2s;
	}

	a:hover .arr {
		transform: translateX(5px);
	}




	nav {
		margin-left: auto;
		display: flex;
		gap: 30px;
		font-size: 15px;
		font-weight: 500;
	}

	nav a {
		color: var(--mut);
		border-bottom: 1.5px solid transparent;
		padding: 3px 0;
		transition: 0.2s;
	}

	nav a:hover {
		color: var(--ink);
		border-color: var(--rust);
	}




	.btn {
		background: var(--rust);
		color: #fff;
		font-weight: 700;
		padding: 17px 28px;
		border-radius: 4px;
		transition: 0.2s;
		min-height: 48px;
		display: inline-block;
	}

	.btn:hover {
		background: var(--ink);
		color: var(--inv);
	}

	.intro {
		display: grid;
		grid-template-columns: 1fr 240px;
		gap: 64px;
		align-items: end;
		padding: 56px 0 72px;
	}

	h1 {
		font-size: clamp(46px, 6.4vw, 88px);
		line-height: 0.98;
		margin: 0 0 24px;
	}

	.lede {
		color: var(--mut);
		max-width: 28em;
		margin: 0;
		font-size: 18px;
	}

	.mini :global(svg) {
		width: 100%;
		height: auto;
		display: block;
	}

	.ln {
		stroke-dasharray: var(--l, 300);
		stroke-dashoffset: var(--l, 300);
		animation: dr 2s 0.3s ease forwards;
	}

	@keyframes dr {
		to {
			stroke-dashoffset: 0;
		}
	}

	.sec {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 24px;
		flex-wrap: wrap;
		margin-bottom: 36px;
	}

	h2 {
		font-size: clamp(30px, 4vw, 52px);
		line-height: 1.05;
		margin: 0;
	}

	.list {
		border-bottom: 1px solid var(--line);
	}

	.ex {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 56px;
		align-items: center;
		padding: 44px 0;
		border-top: 1px solid var(--line);
		position: relative;
		transition:
			background 0.25s,
			padding 0.25s;
	}

	.ex:nth-child(even) {
		grid-template-columns: 1fr 1.2fr;
	}

	.ex:nth-child(even) .pv {
		order: -1;
	}

	.ex:before {
		content: '';
		position: absolute;
		left: 0;
		top: -1px;
		height: 2px;
		width: 0;
		background: var(--rust);
		transition: width 0.5s;
	}

	.ex:hover,
	.ex:focus-visible {
		background: var(--pap);
		padding-left: 18px;
		padding-right: 18px;
		outline: none;
	}

	.ex:hover:before,
	.ex:focus-visible:before {
		width: 100%;
	}

	.ex:focus-visible {
		box-shadow: inset 0 0 0 2px var(--rust);
	}

	.ex .n {
		display: block;
		font:
			300 54px/1 Fraunces,
			serif;
		color: var(--line);
		transition: color 0.2s;
		margin-bottom: 8px;
	}

	.ex:hover .n,
	.ex:focus-visible .n {
		color: var(--rust);
	}

	.ex h3 {
		font-size: clamp(30px, 3.6vw, 50px);
		line-height: 1.05;
		margin: 0 0 12px;
	}

	.ex p {
		margin: 0 0 18px;
		color: var(--mut);
		max-width: 28em;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 18px;
		margin: 0 0 22px;
		padding: 0;
		list-style: none;
		font:
			700 11px 'DM Sans',
			sans-serif;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--sage);
	}

	.meta li:last-child {
		color: var(--mut);
	}

	.cta {
		font-weight: 700;
		border-bottom: 1.5px solid var(--rust);
		padding: 6px 0 2px;
		display: inline-block;
	}

	.pv {
		border: 1px solid var(--line);
		background: var(--bg);
		padding: 14px;
		min-height: 150px;
		display: flex;
		align-items: center;
	}

	.pv :global(svg) {
		width: 100%;
		height: auto;
		display: block;
	}

	.pv :global(path.c) {
		stroke-dasharray: var(--l, 500);
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 1.2s ease;
	}

	.ex:hover .pv :global(path.c),
	.ex:focus-visible .pv :global(path.c) {
		animation: rd 1.4s ease;
	}

	@keyframes rd {
		from {
			stroke-dashoffset: var(--l, 500);
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	.soon {
		margin-top: 140px;
	}

	.soon h2 {
		max-width: 14em;
	}

	.soon .p {
		color: var(--mut);
		max-width: 30em;
		margin: 20px 0 0;
	}

	.slots {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		margin-top: 48px;
	}

	.slot {
		aspect-ratio: 1.5;
		border: 1px dashed var(--line);
		border-radius: 3px;
		position: relative;
		opacity: 0.9;
	}

	.slot span {
		position: absolute;
		left: 14px;
		top: 12px;
		font:
			italic 300 18px Fraunces,
			serif;
		color: var(--mut);
	}

	.slot i {
		position: absolute;
		right: 16px;
		bottom: 14px;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		border: 1px solid var(--line);
	}

	.more {
		margin: 24px 0 0;
		font:
			italic 300 22px Fraunces,
			serif;
		color: var(--rust);
	}

	.slot:nth-child(2) {
		opacity: 0.65;
	}
	.slot:nth-child(3) {
		opacity: 0.4;
	}
	.slot:nth-child(4) {
		opacity: 0.22;
	}

	.how {
		margin-top: 140px;
		background: var(--pap);
		border-block: 1px solid var(--line);
		padding: 110px 0;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin-top: 56px;
		border-top: 1px solid var(--ink);
	}

	.steps div {
		padding: 24px 28px 0 0;
	}

	.steps div + div {
		padding-left: 28px;
		border-left: 1px solid var(--line);
	}

	.steps b {
		font:
			300 15px 'DM Sans',
			sans-serif;
		color: var(--mut);
	}

	.steps span {
		display: block;
		font:
			300 clamp(30px, 3.6vw, 48px) Fraunces,
			serif;
		margin: 26px 0 8px;
		letter-spacing: -0.02em;
	}

	.steps p {
		margin: 0;
		color: var(--mut);
		max-width: 16em;
	}

	.fin {
		padding: 150px 0 130px;
		text-align: center;
	}

	.fin h2 {
		font-size: clamp(40px, 6vw, 80px);
		margin-bottom: 20px;
	}

	.fin p {
		color: var(--mut);
		margin: 0 0 36px;
	}

	footer {
		border-top: 1px solid var(--line);
		padding: 40px 0 56px;
		color: var(--mut);
		font-size: 15px;
	}

	footer .w {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
	}

	footer nav {
		margin: 0;
		gap: 24px;
	}

	footer p {
		width: 100%;
		margin: 8px 0 0;
		font-size: 14px;
	}

	.rv {
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.9s,
			transform 0.9s;
	}

	:global(.rv.in) {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
		* {
			animation: none !important;
			transition: none !important;
		}
		.ln {
			stroke-dashoffset: 0;
		}
		.rv {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 900px) {
		.w {
			padding: 0 22px;
		}
		.intro {
			grid-template-columns: 1fr;
			gap: 32px;
			padding: 36px 0 56px;
		}
		.mini {
			max-width: 200px;
		}
		.ex,
		.ex:nth-child(even) {
			grid-template-columns: 1fr;
			gap: 20px;
			padding: 36px 0;
		}
		.ex .n {
			font-size: 38px;
		}
		.ex:hover,
		.ex:focus-visible {
			padding-left: 0;
			padding-right: 0;
		}
		.ex:nth-child(even) .pv {
			order: 0;
		}
		.slots {
			grid-template-columns: 1fr 1fr;
		}
		.soon,
		.how {
			margin-top: 96px;
		}
		.how {
			padding: 80px 0;
		}
		.steps {
			grid-template-columns: 1fr;
		}
		.steps div,
		.steps div + div {
			padding: 22px 0;
			border-left: 0;
			border-bottom: 1px solid var(--line);
		}
		.fin {
			padding: 100px 0 80px;
		}
	}
</style>
