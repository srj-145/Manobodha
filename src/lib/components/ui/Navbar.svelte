<script lang="ts">
	import { page } from '$app/stores';

	let isScrolled = $state(false);
	let isMobileOpen = $state(false);

	function toggleMobileMenu() {
		isMobileOpen = !isMobileOpen;
	}

	function closeMenu() {
		isMobileOpen = false;
	}

	$effect(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 10;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header class:scrolled={isScrolled} class:mobile-open={isMobileOpen}>
	<div class="nav-container">
		<a class="brand" href="/" onclick={closeMenu}>
			Manobodha
		</a>

		<button
			class="mobile-toggle"
			aria-expanded={isMobileOpen}
			aria-controls="main-nav"
			aria-label="Toggle navigation menu"
			onclick={toggleMobileMenu}
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				{#if isMobileOpen}
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				{:else}
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				{/if}
			</svg>
		</button>

		<nav id="main-nav" class="nav-links">
			<a href="/" class:active={$page.url.pathname === '/'} onclick={closeMenu}>Home</a>
			<a href="/explore" class:active={$page.url.pathname === '/explore' || $page.url.pathname.startsWith('/sandbox')} onclick={closeMenu}>Sandboxes / Theories</a>
			<a href="/map" class:active={$page.url.pathname === '/map'} onclick={closeMenu}>Theory Map</a>
			<a href="/compare" class:active={$page.url.pathname === '/compare'} onclick={closeMenu}>Comparison</a>
		</nav>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--bg, #f7f4ee);
		border-bottom: 1px solid transparent;
		transition: background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
		font-family: 'DM Sans', system-ui, sans-serif;
	}

	header.scrolled {
		background: color-mix(in srgb, var(--bg, #f7f4ee) 85%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--line, #d8d4ca);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		font-family: 'DM Sans', system-ui, sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: var(--ink, #172238);
		text-decoration: none;
		letter-spacing: -0.01em;
	}

	.nav-links {
		display: flex;
		gap: 32px;
		align-items: center;
	}

	.nav-links a {
		text-decoration: none;
		color: var(--mut, #596177);
		font-size: 15px;
		font-weight: 500;
		padding: 8px 0;
		position: relative;
		transition: color 0.2s ease;
	}

	.nav-links a:hover {
		color: var(--ink, #172238);
	}

	.nav-links a.active {
		color: var(--ink, #172238);
	}

	/* Koyeb-inspired active state indicator (subtle underline) */
	.nav-links a::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background-color: var(--ink, #172238);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.3s ease;
	}

	.nav-links a.active::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.nav-links a:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		color: var(--ink, #172238);
		cursor: pointer;
		padding: 8px;
	}

	@media (max-width: 768px) {
		.mobile-toggle {
			display: block;
		}

		.nav-links {
			position: absolute;
			top: 64px;
			left: 0;
			right: 0;
			background: var(--bg, #f7f4ee);
			border-bottom: 1px solid var(--line, #d8d4ca);
			flex-direction: column;
			gap: 0;
			padding: 8px 24px 24px;
			display: none;
			box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		}

		header.mobile-open .nav-links {
			display: flex;
		}

		.nav-links a {
			width: 100%;
			padding: 16px 0;
			border-bottom: 1px solid var(--line, #d8d4ca);
		}

		.nav-links a::after {
			display: none;
		}

		.nav-links a.active {
			font-weight: 700;
		}
	}
</style>
