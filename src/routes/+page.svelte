<script lang="ts">
	import { onMount } from 'svelte';

	let headerElement = $state<HTMLElement | undefined>(undefined);
	let mobileMenuOpen = $state(false);
	let activeSection = $state('top');

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}

	onMount(() => {
		const handleScroll = () => {
			if (headerElement) {
				headerElement.classList.toggle('s', window.scrollY > 20);
			}

			const ids = ['top', 'idea', 'start', 'world', 'compare', 'who'];
			const sections = ids.map((id) => document.getElementById(id));
			let current = 0;
			sections.forEach((sec, idx) => {
				if (sec && sec.getBoundingClientRect().top < 220) {
					current = idx;
				}
			});
			if (ids[current]) {
				activeSection = ids[current];
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		const rvElements = document.querySelectorAll('.rv');
		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						// also reveal blocks that are already ABOVE the viewport (scroll position restored on reload),
						// otherwise they stay invisible and leave a huge blank gap
						if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
							entry.target.classList.add('in');
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.12 }
			);
			rvElements.forEach((el) => observer.observe(el));
		} else {
			rvElements.forEach((el) => el.classList.add('in'));
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>Manobodha – Understand theories. Don't just memorize them.</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>


<main id="top">
	<!-- Hero Section -->
	<div class="w hero">
		<div>
			<p class="lab">Interactive psychology &amp; learning theory</p>
			<h1>Understand theories. <em>Don’t just memorize them.</em></h1>
			<p class="lede">
				Explore how psychological and learning theories work through interactive experiences, visual
				connections, and different perspectives.
			</p>
			<div class="cta">
				<a class="btn" href="#start">Explore Manobodha <span class="arr">→</span></a>
				<a class="tl" href="#idea">How it works</a>
			</div>
		</div>
		<div class="art">
			<svg
				viewBox="0 0 480 460"
				role="img"
				aria-label="Line illustration: a central theory node connected to Learning, Behaviour, Memory and Motivation"
			>
				<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4">
					<path class="ln" style="--l:520" stroke="var(--ink)" d="M240 230Q150 170 92 92" />
					<path
						class="ln"
						style="--l:520;animation-delay:.6s"
						stroke="var(--ink)"
						d="M240 230Q330 160 396 96"
					/>
					<path
						class="ln"
						style="--l:520;animation-delay:.9s"
						stroke="var(--ink)"
						d="M240 230Q160 300 96 374"
					/>
					<path
						class="ln"
						style="--l:520;animation-delay:1.2s"
						stroke="var(--ink)"
						d="M240 230Q340 310 394 376"
					/>
					<path
						class="ln"
						style="--l:380;animation-delay:1.5s"
						stroke="var(--rust)"
						stroke-dasharray="3 6"
						d="M92 92Q230 20 396 96"
					/>
					<path
						class="ln"
						style="--l:380;animation-delay:1.7s"
						stroke="var(--sage)"
						d="M96 374Q240 440 394 376"
					/>
					<circle cx="240" cy="230" r="62" stroke="var(--ink)" stroke-width="1.8" />
					<circle cx="240" cy="230" r="46" stroke="var(--rust)" stroke-dasharray="2 5" />
					<path
						d="M214 232c6-16 22-22 34-12 10-8 22 2 18 14-2 12-14 16-22 10-6 8-22 6-24-4-4-2-6-6-6-8z"
						stroke="var(--ink)"
						stroke-width="1.2"
						opacity=".75"
					/>
				</g>
				<g fill="var(--bg)" stroke="var(--ink)" stroke-width="1.2">
					<circle cx="92" cy="92" r="9" />
					<circle cx="396" cy="96" r="9" />
					<circle cx="96" cy="374" r="9" />
					<circle cx="394" cy="376" r="9" />
				</g>
				<g class="np" fill="none" stroke-width="1.4">
					<circle cx="92" cy="92" r="9" stroke="var(--rust)" />
					<circle cx="396" cy="96" r="9" stroke="var(--blue)" style="animation-delay:.9s" />
					<circle cx="96" cy="374" r="9" stroke="var(--sage)" style="animation-delay:1.8s" />
					<circle cx="394" cy="376" r="9" stroke="var(--yel)" style="animation-delay:2.7s" />
				</g>
				<circle cx="92" cy="92" r="3" fill="var(--rust)" />
				<circle cx="396" cy="96" r="3" fill="var(--blue)" />
				<circle cx="96" cy="374" r="3" fill="var(--sage)" />
				<circle cx="394" cy="376" r="3" fill="var(--yel)" />
				<g class="hl">
					<text x="70" y="68">Learning</text>
					<text x="364" y="72">Memory</text>
					<text x="62" y="406">Behaviour</text>
					<text x="352" y="408">Motivation</text>
					<text x="213" y="320" style="fill:var(--mut);font-size:15px">theory</text>
				</g>
			</svg>
		</div>
	</div>

	<!-- Idea Section -->
	<section id="idea" class="w">
		<p class="lab rv">The idea</p>
		<h2 class="rv">What if you could explore a theory instead of just reading about it?</h2>
		<p class="p rv">
			Manobodha turns abstract psychological ideas into interactive experiences. Change what
			matters, observe what happens, and build a clearer mental model of the theory.
		</p>
		<div class="steps rv">
			<div><b>01</b><span>Explore</span></div>
			<div><b>02</b><span>Observe</span></div>
			<div><b>03</b><span>Understand</span></div>
		</div>
	</section>

	<!-- Start Section -->
	<section id="start" class="w">
		<p class="lab rv">Start here</p>
		<h2 class="rv">Choose how you want to explore.</h2>
		<div class="rows">
			<a class="row rv" href="/sandbox">
				<span class="n">01</span>
				<div>
					<h3>Explore Sandboxes</h3>
					<p>
						Step inside interactive simulations for Operant Conditioning and the Ebbinghaus
						Forgetting Curve.
					</p>
				</div>
				<span class="ar">→</span>
			</a>
			<a class="row rv" href="/map">
				<span class="n">02</span>
				<div>
					<h3>Connect Concepts</h3>
					<p>
						See how psychological and learning theories relate to one another in our visual graph
						map.
					</p>
				</div>
				<span class="ar">→</span>
			</a>
			<a class="row rv" href="/compare">
				<span class="n">03</span>
				<div>
					<h3>Compare Models</h3>
					<p>Explore how different theories interpret the same situation side-by-side.</p>
				</div>
				<span class="ar">→</span>
			</a>
		</div>
	</section>

	<!-- Different Way to Learn -->
	<div class="tr">
		<div class="w">
			<section>
				<p class="lab rv">A different way to learn</p>
				<h2 class="rv">From remembering the definition to seeing the mechanism.</h2>
				<div class="cmp rv">
					<div>
						<h4>Traditional</h4>
						<ul>
							<li>Definition</li>
							<li>Diagram</li>
							<li>Memorize</li>
						</ul>
					</div>
					<div>
						<h4>Manobodha</h4>
						<ul>
							<li>Explore</li>
							<li>Manipulate</li>
							<li>Observe</li>
							<li>Understand</li>
						</ul>
					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- Inside Sandbox Section -->
	<section class="w">
		<p class="lab rv">Inside Manobodha</p>
		<h2 class="rv">Every theory becomes something you can explore.</h2>
		<div class="env rv" aria-hidden="true">
			<div class="side"><i></i><i></i><i></i><i></i></div>
			<div class="main">
				<svg viewBox="0 0 560 290" preserveAspectRatio="xMidYMid meet">
					<g fill="none" stroke-width="3" stroke-linecap="round">
						<path d="M20 250C120 240 160 120 300 100S470 40 540 30" stroke="var(--blue)" />
						<path d="M20 262C140 250 260 230 540 150" stroke="var(--rust)" stroke-dasharray="6 8" />
					</g>
					<g stroke="var(--line)">
						<path d="M20 20V270H550" />
						<path d="M20 140H550" stroke-dasharray="2 8" />
					</g>
					<circle cx="300" cy="100" r="8" fill="var(--yel)" />
				</svg>
				<div class="tag">
					<span class="pulse"></span>Something is waiting to be explored
				</div>
			</div>
		</div>
	</section>

	<!-- Theory World Section -->
	<section id="world" class="w">
		<div class="world">
			<div>
				<p class="lab rv">Theory world</p>
				<h2 class="rv">A growing collection of ideas worth understanding.</h2>
				<p class="p rv">
					Psychology is bigger than a list of definitions. Manobodha brings different perspectives
					together so you can explore how ideas connect, differ, and evolve.
				</p>
				<a class="lk rv" href="/map">Explore the Theory Map <span class="arr">→</span></a>
			</div>
			<svg
				viewBox="0 0 480 400"
				role="img"
				aria-label="Teaser network linking Theory, Learning, Behaviour, Memory, Motivation and Cognition"
			>
				<g stroke="var(--ink)" stroke-width="1" opacity=".5" fill="none">
					<path
						d="M240 200L110 90M240 200L370 80M240 200L90 270M240 200L390 290M240 200L240 350M110 90L370 80M90 270L240 350M390 290L240 350"
					/>
					<path d="M240 200L430 190" stroke-dasharray="3 6" />
					<path d="M240 200L40 170" stroke-dasharray="3 6" />
				</g>
				<g>
					<circle cx="430" cy="190" r="3" fill="var(--mut)" />
					<circle cx="40" cy="170" r="3" fill="var(--mut)" />
				</g>
				<g class="nd">
					<circle
						cx="240"
						cy="200"
						r="34"
						fill="var(--bg)"
						stroke="var(--rust)"
						stroke-width="1.8"
					/>
					<text
						class="nl"
						x="240"
						y="205"
						style="font-style:italic;font-family:Fraunces,serif;font-size:18px">Theory</text
					>
				</g>
				<g class="nd">
					<circle cx="110" cy="90" r="9" fill="var(--bg)" stroke="var(--ink)" />
					<text class="nl" x="110" y="68">Learning</text>
				</g>
				<g class="nd">
					<circle cx="370" cy="80" r="9" fill="var(--bg)" stroke="var(--ink)" />
					<text class="nl" x="370" y="58">Cognition</text>
				</g>
				<g class="nd">
					<circle cx="90" cy="270" r="9" fill="var(--bg)" stroke="var(--ink)" />
					<text class="nl" x="90" y="298">Behaviour</text>
				</g>
				<g class="nd">
					<circle cx="390" cy="290" r="9" fill="var(--bg)" stroke="var(--ink)" />
					<text class="nl" x="390" y="318">Motivation</text>
				</g>
				<g class="nd">
					<circle cx="240" cy="350" r="9" fill="var(--bg)" stroke="var(--ink)" />
					<text class="nl" x="240" y="380">Memory</text>
				</g>
			</svg>
		</div>
	</section>

	<!-- Compare Perspectives Section -->
	<section id="compare" class="w">
		<p class="lab rv">See different perspectives</p>
		<h2 class="rv">One situation. Different ways of understanding it.</h2>
		<p class="sc rv">“One learner keeps struggling.”</p>
		<svg class="tree rv" viewBox="0 0 760 200" aria-hidden="true">
			<g fill="none" stroke="var(--ink)" stroke-width="1.2">
				<path d="M380 0V50M130 50H630M130 50V100M380 50V100M630 50V100" />
			</g>
			<g
				font-family="Fraunces,serif"
				font-size="26"
				font-weight="300"
				text-anchor="middle"
				fill="var(--ink)"
			>
				<text x="130" y="140" fill="var(--rust)">Behaviorism</text>
				<text x="380" y="140" fill="var(--sage)">Cognitivism</text>
				<text x="630" y="140" fill="var(--blue)">Constructivism</text>
			</g>
			<g stroke-width="2">
				<path d="M70 160H190" stroke="var(--rust)" />
				<path d="M320 160H440" stroke="var(--sage)" />
				<path d="M570 160H690" stroke="var(--blue)" />
			</g>
		</svg>
		<p class="p rv" style="margin:48px auto 0;text-align:center">
			Different theories ask different questions. Manobodha lets you see those differences
			side-by-side.
		</p>
		<p style="text-align:center">
			<a class="lk rv" href="/compare">Compare perspectives <span class="arr">→</span></a>
		</p>
	</section>

	<!-- Audience Section -->
	<section id="who" class="w">
		<p class="lab rv">Made for curious minds</p>
		<h2 class="rv">
			For people learning psychology — and people who simply want to understand it better.
		</h2>
		<div class="two rv">
			<div>
				<h3>Psychology students</h3>
				<p>Build stronger mental models of foundational theories.</p>
			</div>
			<div>
				<h3>Curious learners</h3>
				<p>Explore ideas about learning, behaviour, memory, and motivation.</p>
			</div>
		</div>
	</section>

	<!-- Final Banner -->
	<section class="w fin">
		<h2 class="rv">Don’t just learn what a theory says. <em>Understand how it works.</em></h2>
		<a class="btn rv" href="#top">Explore Manobodha <span class="arr">→</span></a>
		<small>Interactive psychology and learning theory, built to be explored.</small>
	</section>
</main>

<footer>
	<div class="w">
		<a class="logo" href="#top">Manobodha<i>.</i></a>
		<nav aria-label="Footer">
			<a href="#start">Explore</a>
			<a href="/map">Theory Map</a>
			<a href="/compare">Compare</a>
			<a href="#who">About</a>
		</nav>
		<p>An interactive learning project exploring psychology and learning theories.</p>
	</div>
</footer>

<style>
	:global(:root) {
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
		padding-top: env(safe-area-inset-top, 0px);
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) {
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

	:global(body) {
		margin: 0;
		background: var(--bg);
		color: var(--ink);
		font:
			400 17px/1.65 'DM Sans',
			system-ui,
			sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	:focus-visible {
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
		font: 700 12px/1 'DM Sans';
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--mut);
		margin: 0 0 28px;
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



	.hero {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 48px;
		align-items: center;
		min-height: min(calc(100svh - 110px), 780px);
		padding: 24px 0 64px;
	}

	h1 {
		font-size: clamp(46px, 7vw, 96px);
		line-height: 0.96;
		margin: 0 0 28px;
	}

	.lede {
		color: var(--mut);
		max-width: 27em;
		margin: 0 0 38px;
		font-size: 18px;
	}

	.cta {
		display: flex;
		gap: 30px;
		align-items: center;
		flex-wrap: wrap;
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

	.tl {
		font-weight: 500;
		border-bottom: 1px solid currentColor;
		padding: 6px 0 2px;
	}
	.tl:hover {
		color: var(--rust);
	}

	.art {
		position: relative;
	}
	.np circle {
		transform-box: fill-box;
		transform-origin: center;
		animation: np 3.6s ease-out infinite;
		opacity: 0;
	}
	@keyframes np {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		40%,
		100% {
			transform: scale(2.6);
			opacity: 0;
		}
	}
	/* narrower screens: the hero stacks */
	@media (max-width: 1040px) {
		.hero {
			grid-template-columns: 1fr;
			min-height: 0;
			gap: 36px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.np circle {
			animation: none;
		}
	}

	.art svg {
		width: 100%;
		height: auto;
		display: block;
		overflow: visible;
	}

	.ln {
		stroke-dasharray: var(--l, 400);
		stroke-dashoffset: var(--l, 400);
		animation: dr 2.4s 0.3s ease forwards;
	}

	@keyframes dr {
		to {
			stroke-dashoffset: 0;
		}
	}

	.hl {
		font:
			italic 300 17px Fraunces,
			serif;
		fill: var(--ink);
	}

	section {
		padding: 140px 0 0;
	}

	h2 {
		font-size: clamp(34px, 5vw, 68px);
		line-height: 1.04;
		margin: 0 0 28px;
		max-width: 14em;
	}

	.p {
		color: var(--mut);
		max-width: 32em;
		margin: 0;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin-top: 72px;
		border-top: 1px solid var(--ink);
	}

	.steps div {
		padding: 24px 24px 0 0;
	}
	.steps div + div {
		padding-left: 24px;
		border-left: 1px solid var(--line);
	}

	.steps b {
		display: block;
		font: 300 15px 'DM Sans';
		color: var(--mut);
	}
	.steps span {
		display: block;
		font:
			300 clamp(28px, 3.4vw, 44px) Fraunces,
			serif;
		margin-top: 36px;
		letter-spacing: -0.02em;
	}

	.rows {
		margin-top: 56px;
	}

	.row {
		display: grid;
		grid-template-columns: 130px 1fr auto;
		gap: 28px;
		align-items: center;
		padding: 38px 0;
		border-top: 1px solid var(--line);
		transition: padding 0.25s;
	}
	.row:last-child {
		border-bottom: 1px solid var(--line);
	}

	.row:hover {
		padding-left: 16px;
	}
	.row:hover h3 {
		color: var(--rust);
	}

	.row .n {
		font:
			300 64px/1 Fraunces,
			serif;
		color: var(--line);
		transition: color 0.2s;
	}
	.row:hover .n {
		color: var(--rust);
	}

	.row h3 {
		font-size: clamp(30px, 3.6vw, 48px);
		margin: 0 0 4px;
		transition: color 0.2s;
	}
	.row p {
		margin: 0;
		color: var(--mut);
	}

	.row .ar {
		font-size: 28px;
		transition: transform 0.2s;
	}
	.row:hover .ar {
		transform: translateX(8px);
	}

	.tr {
		background: var(--pap);
		margin-top: 140px;
		padding: 140px 0;
		border-block: 1px solid var(--line);
	}
	.tr section {
		padding: 0;
	}

	.cmp {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		margin-top: 72px;
	}

	.cmp > div {
		padding: 0 56px 0 0;
	}
	.cmp > div + div {
		padding: 0 0 0 56px;
		border-left: 1px solid var(--line);
	}

	.cmp h4 {
		font: 700 12px 'DM Sans';
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--mut);
		margin: 0 0 28px;
	}
	.cmp div + div h4 {
		color: var(--rust);
	}

	.cmp ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.cmp li {
		font:
			300 clamp(30px, 3.6vw, 48px)/1.1 Fraunces,
			serif;
		letter-spacing: -0.02em;
	}

	.cmp li + li:before {
		content: '↓';
		display: block;
		font: 16px 'DM Sans';
		color: var(--mut);
		margin: 12px 0;
	}

	.cmp div + div li:not(:last-child) {
		color: var(--ink);
	}
	.cmp div + div li:last-child {
		font-style: italic;
		color: var(--rust);
	}

	.cmp div:first-child li {
		color: var(--mut);
	}

	.env {
		margin-top: 64px;
		border: 1px solid var(--line);
		background: var(--bg);
		display: grid;
		grid-template-columns: 150px 1fr;
		min-height: 340px;
		overflow: hidden;
		position: relative;
	}

	.env .side {
		border-right: 1px solid var(--line);
		padding: 24px 20px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.env .side i {
		display: block;
		height: 6px;
		background: var(--line);
		border-radius: 3px;
	}

	.env .side i:nth-child(1) {
		width: 70%;
	}
	.env .side i:nth-child(2) {
		width: 90%;
	}
	.env .side i:nth-child(3) {
		width: 55%;
	}
	.env .side i:nth-child(4) {
		width: 80%;
	}

	.env .side i:nth-child(odd) {
		position: relative;
	}
	.env .side i:nth-child(odd):after {
		content: '';
		position: absolute;
		top: -3px;
		left: 40%;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--bg);
		border: 1px solid var(--mut);
	}

	.env .main {
		position: relative;
		padding: 24px;
	}

	.env svg {
		width: 100%;
		height: 100%;
		min-height: 290px;
		filter: blur(2.2px);
		opacity: 0.9;
	}

	.env .tag {
		position: absolute;
		right: 20px;
		bottom: 20px;
		font:
			italic 300 20px Fraunces,
			serif;
		background: var(--bg);
		border: 1px solid var(--line);
		padding: 10px 16px;
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.pulse {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--rust);
		animation: pu 2.6s ease-in-out infinite;
	}

	@keyframes pu {
		50% {
			opacity: 0.3;
		}
	}

	.world {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: 64px;
		align-items: center;
	}

	.world svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.nd {
		animation: dr2 9s ease-in-out infinite alternate;
	}
	.nd:nth-of-type(2n) {
		animation-duration: 11s;
		animation-delay: -3s;
	}
	.nd:nth-of-type(3n) {
		animation-duration: 13s;
		animation-delay: -6s;
	}

	@keyframes dr2 {
		to {
			transform: translate(5px, -6px);
		}
	}

	.nl {
		font: 400 14px 'DM Sans';
		fill: var(--ink);
		text-anchor: middle;
	}

	.lk {
		display: inline-block;
		margin-top: 36px;
		font-weight: 700;
		border-bottom: 1.5px solid var(--rust);
		padding: 6px 0 2px;
	}
	.lk:hover {
		color: var(--rust);
	}

	.sc {
		font:
			italic 300 clamp(28px, 3.4vw, 44px) Fraunces,
			serif;
		margin: 56px 0 0;
		text-align: center;
		letter-spacing: -0.02em;
	}

	.tree {
		display: block;
		margin: 0 auto;
		width: min(100%, 760px);
		height: auto;
	}

	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		margin-top: 56px;
		border-top: 1px solid var(--ink);
	}

	.two div {
		padding: 28px 40px 0 0;
	}
	.two div + div {
		padding-left: 40px;
		border-left: 1px solid var(--line);
	}

	.two h3 {
		font: 700 12px 'DM Sans';
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin: 0 0 14px;
	}

	.two p {
		margin: 0;
		font:
			300 24px/1.35 Fraunces,
			serif;
		color: var(--ink);
	}

	.fin {
		padding: 180px 0 140px;
		text-align: center;
	}

	.fin h2 {
		margin: 0 auto 40px;
		max-width: 11em;
		font-size: clamp(40px, 6.4vw, 88px);
	}

	.fin small {
		display: block;
		margin-top: 28px;
		color: var(--mut);
		font-size: 15px;
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
		:global(*) {
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
		section {
			padding-top: 96px;
		}
		.tr {
			margin-top: 96px;
			padding: 96px 0;
		}



		.hero,
		.world {
			grid-template-columns: 1fr;
			gap: 36px;
		}
		.hero {
			min-height: 0;
			padding-top: 12px;
		}
		.steps,
		.cmp,
		.two {
			grid-template-columns: 1fr;
		}
		.steps div,
		.steps div + div {
			padding: 20px 0;
			border-left: 0;
			border-bottom: 1px solid var(--line);
		}
		.steps span {
			margin-top: 12px;
		}
		.row {
			grid-template-columns: 64px 1fr 24px;
			gap: 14px;
			padding: 30px 0;
		}
		.row .n {
			font-size: 40px;
		}
		.cmp > div,
		.cmp > div + div {
			padding: 0;
			border: 0;
		}
		.cmp > div + div {
			margin-top: 48px;
			padding-top: 40px;
			border-top: 1px solid var(--line);
		}
		.two div,
		.two div + div {
			padding: 24px 0;
			border-left: 0;
			border-bottom: 1px solid var(--line);
		}
		.env {
			grid-template-columns: 1fr;
		}
		.env .side {
			display: none;
		}
		.fin {
			padding: 120px 0 96px;
		}
	}
</style>
