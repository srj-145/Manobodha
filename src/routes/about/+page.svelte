<script lang="ts">
	import { resolveRoute } from '$app/paths';
	import { site } from '$lib/config';
	import DocPage from '$lib/components/ui/DocPage.svelte';
</script>

<svelte:head>
	<title>About – Manobodha</title>
	<meta name="description" content="Why Manobodha exists, how it works, and what you can explore today." />
</svelte:head>

<DocPage eyebrow="About" title="Theories you can play with." lede="Manobodha (मनोबोध) joins mano, “mind”, with bodha, “understanding”. It is a place to explore how the mind works by experimenting, not just reading.">
	<h2>Why it exists</h2>
	<p>
		Psychology textbooks describe theories in paragraphs and diagrams. But ideas like reinforcement schedules or the forgetting curve
		make far more sense when you can <strong>change a setting and watch what happens</strong>. Manobodha turns each theory into a small,
		friendly simulation so the mechanism becomes visible.
	</p>

	<h2>How it works</h2>
	<ol class="steps">
		<li><div><b>Learn</b>Start with a short, plain-language idea of the concept.</div></li>
		<li><div><b>Practice</b>Open the sandbox, adjust the parameters and run the simulation.</div></li>
		<li><div><b>Review</b>Compare outcomes, see the theory on the map, and contrast it with others.</div></li>
		<li><div><b>Recall</b>Check your understanding with a quick quiz, guided by Bodhi.</div></li>
	</ol>

	<h2>What you can explore today</h2>
	<ul>
		<li><a href={resolveRoute('/sandbox/operant-conditioning')}>Operant conditioning</a>: a Skinner box with reinforcement and punishment.</li>
		<li><a href={resolveRoute('/sandbox/ebbinghaus-curve')}>Forgetting curve</a>: how memory fades and how spaced review slows it.</li>
		<li><a href={resolveRoute('/map')}>Theory map</a> and <a href={resolveRoute('/compare')}>comparison</a>: see how ideas connect and differ.</li>
		<li><a href={resolveRoute('/quiz')}>Quiz</a>: test yourself on what you explored.</li>
	</ul>

	<h2>Good to know</h2>
	<details>
		<summary>Do I need an account?</summary>
		<p>No. Everything works without signing up. See the <a href={resolveRoute('/privacy')}>privacy page</a> for what is stored in your browser.</p>
	</details>
	<details>
		<summary>Are the simulations scientifically exact?</summary>
		<p>They are simplified teaching models. They show the direction and shape of each effect clearly, but they are not research-grade experiments.</p>
	</details>
	<details>
		<summary>Who is Bodhi?</summary>
		<p>Bodhi is your study companion. Tap the “?” badge on any page for tips about what you are looking at, or to jump to a quiz.</p>
	</details>
	<details>
		<summary>Can I hide the companion?</summary>
		<p>Yes. Open Bodhi’s panel and choose “Hide Bodhi”. A small “?” button stays behind so help is always one tap away.</p>
	</details>

	{#if site.contactEmail}
		<h2>Get in touch</h2>
		<p>Questions or feedback? Write to <a href="mailto:{site.contactEmail}">{site.contactEmail}</a>.</p>
	{/if}

	<a class="cta" href={resolveRoute('/explore')}>Start exploring →</a>
</DocPage>
