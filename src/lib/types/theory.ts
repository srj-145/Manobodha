export type ControlType = 'slider' | 'dropdown' | 'toggle';

export interface ControlOption {
	label: string;
	value: string;
}

export interface ControlSchema {
	id: string;
	label: string;
	type: ControlType;
	min?: number;
	max?: number;
	step?: number;
	defaultValue: number | string | boolean;
	options?: ControlOption[];
	tooltip?: string;
}

export interface GraphDataPoint {
	x: number;
	y: number;
}

export interface GraphConfig {
	title: string;
	xAxisLabel: string;
	yAxisLabel: string;
	chartType?: 'line' | 'bar';
}
