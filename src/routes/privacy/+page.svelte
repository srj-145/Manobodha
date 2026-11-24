<script lang="ts">
	import { site } from '$lib/config';
	import DocPage from '$lib/components/ui/DocPage.svelte';
</script>

<svelte:head>
	<title>Privacy – Manobodha</title>
	<meta name="description" content="What Manobodha stores, what it does not collect, and the third-party services it uses." />
</svelte:head>

<DocPage eyebrow="Legal" title="Privacy, in plain words." lede="Short version: Manobodha does not ask who you are, and it does not build a profile of you.">
	<h2>What we collect</h2>
	<p>Manobodha has no accounts, sign-ups or forms, and it does not ask for personal information. Quiz answers and simulation settings stay in your browser tab and are not sent anywhere.</p>

	<h2>What is stored on your device</h2>
	<ul>
		<li>One preference in your browser’s local storage: whether you minimised the Bodhi companion.</li>
	</ul>
	<p>You can clear it any time through your browser’s site-data settings.</p>

	<h2>Third-party services</h2>
	<ul>
		<li><strong>Google Fonts</strong> serves the typefaces. Your browser contacts Google to download them, which shares your IP address with Google under <a href="https://policies.google.com/privacy" rel="noopener noreferrer">Google’s privacy policy</a>.</li>
		<li><strong>Hosting.</strong> Like most web hosts, ours may keep standard server logs (such as IP address and requested page) for security and reliability.</li>
	</ul>

	<h2>Children</h2>
	<p>Manobodha is built for learners of all ages and collects no personal data from anyone.</p>

	<h2>Changes</h2>
	<p>If this ever changes, for example if analytics are added, this page will be updated first.</p>

	{#if site.contactEmail}
		<h2>Questions</h2>
		<p>Write to <a href="mailto:{site.contactEmail}">{site.contactEmail}</a>.</p>
	{/if}
</DocPage>
