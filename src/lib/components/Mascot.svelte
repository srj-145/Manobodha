<script lang="ts">
	import type { MascotEmote, MascotColor } from '$lib/types/quiz';

	let {
		emote = 'neutral',
		color = 'blue',
		speechText = '',
		position = 'inline',
		size = 'md'
	}: {
		emote?: MascotEmote;
		color?: MascotColor;
		speechText?: string;
		position?: 'inline' | 'fixed-bottom-right';
		size?: 'sm' | 'md' | 'lg';
	} = $props();

	// Color palette matching Dango inspiration
	const colorMap: Record<MascotColor, { body: string; shadow: string; blush: string }> = {
		blue: { body: '#93BDC6', shadow: '#6F98A2', blush: '#6B909A' },
		pink: { body: '#F4B8C3', shadow: '#D8919E', blush: '#C87B89' },
		green: { body: '#B5D8A3', shadow: '#8FB87A', blush: '#7EA86A' },
		yellow: { body: '#F5E39B', shadow: '#D6C070', blush: '#C2AC5A' }
	};

	const sizeClasses: Record<'sm' | 'md' | 'lg', { container: string; bubbleText: string }> = {
		sm: { container: 'w-28 h-20', bubbleText: 'text-xs p-2' },
		md: { container: 'w-44 h-32', bubbleText: 'text-sm p-3' },
		lg: { container: 'w-60 h-44', bubbleText: 'text-base p-4' }
	};

	const activeColor = $derived(colorMap[color] ?? colorMap.blue);
</script>

<div
	class="flex flex-col items-center justify-end {position === 'fixed-bottom-right'
		? 'animate-bounce-short fixed right-6 bottom-6 z-50'
		: 'relative'}"
>
	<!-- Comic Speech Bubble (from Page 2 & 5) -->
	{#if speechText}
		<div class="animate-fade-in relative mb-2 max-w-xs">
			<div
				class="rounded-2xl border-2 border-slate-800 bg-white font-sans font-semibold text-slate-800 shadow-md {sizeClasses[
					size
				].bubbleText}"
			>
				{speechText}
			</div>
			<!-- Speech bubble tail pointing down to mascot -->
			<div
				class="absolute -bottom-2.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-slate-800"
			></div>
			<div
				class="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-6 border-t-6 border-x-transparent border-t-white"
			></div>
		</div>
	{/if}

	<!-- Dango Blob SVG -->
	<div class={sizeClasses[size].container}>
		<svg viewBox="0 0 200 140" class="h-full w-full overflow-visible drop-shadow-sm">
			<!-- Base Bottom Shadow -->
			<ellipse cx="100" cy="118" rx="72" ry="14" fill={activeColor.shadow} opacity="0.6" />

			<!-- Main Squishy Oval Body -->
			<ellipse cx="100" cy="78" rx="70" ry="42" fill={activeColor.body} />

			<!-- Bottom Bevel / Curve Line -->
			<path
				d="M 35 88 C 60 118, 140 118, 165 88"
				fill="none"
				stroke={activeColor.shadow}
				stroke-width="3"
				stroke-linecap="round"
			/>

			<!-- Left Cheek Hash Blush (# #) -->
			<g stroke={activeColor.blush} stroke-width="2.5" stroke-linecap="round">
				<line x1="48" y1="72" x2="48" y2="86" />
				<line x1="54" y1="72" x2="54" y2="86" />
				<line x1="44" y1="76" x2="58" y2="76" />
				<line x1="44" y1="82" x2="58" y2="82" />
			</g>

			<!-- Right Cheek Hash Blush (# #) -->
			<g stroke={activeColor.blush} stroke-width="2.5" stroke-linecap="round">
				<line x1="146" y1="72" x2="146" y2="86" />
				<line x1="152" y1="72" x2="152" y2="86" />
				<line x1="142" y1="76" x2="156" y2="76" />
				<line x1="142" y1="82" x2="156" y2="82" />
			</g>

			<!-- Dynamic Eye & Expression Emotes (from Page 6) -->
			{#if emote === 'neutral' || emote === 'idea'}
				<!-- Vertical Line Eyes (| |) -->
				<rect x="82" y="60" width="5" height="18" rx="2.5" fill="#1E293B" />
				<rect x="113" y="60" width="5" height="18" rx="2.5" fill="#1E293B" />
			{:else if emote === 'happy' || emote === 'correct' || emote === 'wrong'}
				<!-- Squeezed Happy Eyes (> <) -->
				<path
					d="M 78 62 L 88 69 L 78 76"
					fill="none"
					stroke="#1E293B"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M 122 62 L 112 69 L 122 76"
					fill="none"
					stroke="#1E293B"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{:else if emote === 'confused'}
				<!-- Spiral Dizzy Eyes (@ @) -->
				<path
					d="M 85 68 A 6 6 0 1 0 81 72 A 10 10 0 1 0 88 60"
					fill="none"
					stroke="#1E293B"
					stroke-width="3"
					stroke-linecap="round"
				/>
				<path
					d="M 115 68 A 6 6 0 1 0 111 72 A 10 10 0 1 0 118 60"
					fill="none"
					stroke="#1E293B"
					stroke-width="3"
					stroke-linecap="round"
				/>
			{:else if emote === 'inspired'}
				<!-- Inspired Vertical Eyes with Sparkle -->
				<rect x="82" y="60" width="5" height="18" rx="2.5" fill="#1E293B" />
				<rect x="113" y="60" width="5" height="18" rx="2.5" fill="#1E293B" />
			{:else if emote === 'gloomy'}
				<!-- Low Droopy Eyes -->
				<rect x="82" y="70" width="5" height="12" rx="2.5" fill="#1E293B" />
				<rect x="113" y="70" width="5" height="12" rx="2.5" fill="#1E293B" />
			{/if}

			<!-- Contextual Accessories & Badges (from Page 5 & 6) -->
			{#if emote === 'idea'}
				<!-- Exclamation Badge (!) -->
				<g transform="translate(42, 10)">
					<path
						d="M 10 5 L 14 30 L 6 30 Z"
						fill="#2563EB"
						stroke="#1E293B"
						stroke-width="2"
						stroke-linejoin="round"
					/>
					<circle cx="10" cy="40" r="4" fill="#2563EB" stroke="#1E293B" stroke-width="2" />
				</g>
			{:else if emote === 'correct'}
				<!-- Checkmark Circle Badge (✓) -->
				<g transform="translate(135, 15)">
					<circle cx="20" cy="20" r="18" fill="#22C55E" stroke="#1E293B" stroke-width="3" />
					<path
						d="M 11 20 L 17 26 L 29 14"
						fill="none"
						stroke="white"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			{:else if emote === 'wrong'}
				<!-- Cross Mark Badge (✕) -->
				<g transform="translate(25, 15)">
					<circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#1E293B" stroke-width="3" />
					<path
						d="M 12 12 L 28 28 M 28 12 L 12 28"
						fill="none"
						stroke="white"
						stroke-width="4"
						stroke-linecap="round"
					/>
				</g>
			{:else if emote === 'confused'}
				<!-- Scribble Cloud above head -->
				<path
					d="M 120 20 C 125 10, 140 10, 145 20 C 155 20, 155 35, 145 40 C 140 45, 125 45, 120 40 C 115 35, 115 20, 120 20 Z"
					fill="none"
					stroke="#64748B"
					stroke-width="2.5"
					stroke-dasharray="3 3"
				/>
			{:else if emote === 'inspired'}
				<!-- Sparkles (✨) -->
				<path
					d="M 145 20 L 148 28 L 156 31 L 148 34 L 145 42 L 142 34 L 134 31 L 142 28 Z"
					fill="#F59E0B"
					stroke="#1E293B"
					stroke-width="1.5"
				/>
			{:else if emote === 'gloomy'}
				<!-- Wavy Gloomy Lines -->
				<path
					d="M 90 20 Q 95 10 100 20 T 110 20 M 115 15 Q 120 5 125 15 T 135 15"
					fill="none"
					stroke="#475569"
					stroke-width="3"
					stroke-linecap="round"
				/>
			{/if}
		</svg>
	</div>
</div>
