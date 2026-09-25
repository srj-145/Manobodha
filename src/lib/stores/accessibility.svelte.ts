class AccessibilityStore {
	reducedMotion = $state(false);
	highContrast = $state(false);
	fontScale = $state<'normal' | 'large' | 'xlarge'>('normal');

	toggleReducedMotion() {
		this.reducedMotion = !this.reducedMotion;
	}

	toggleHighContrast() {
		this.highContrast = !this.highContrast;
	}

	setFontScale(scale: 'normal' | 'large' | 'xlarge') {
		this.fontScale = scale;
	}
}

export const accessibility = new AccessibilityStore();