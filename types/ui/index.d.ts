import type { ComponentChildren } from '../index.js';

export type ControlState = 'rest' | 'busy' | 'invalid' | string;

export interface Option {
	value: string;
	label?: string;
}

export declare function cls(...parts: unknown[]): string;

export declare function Btn(props: {
	variant?: 'primary' | 'ghost' | 'default' | string;
	state?: ControlState;
	type?: string;
	class?: string;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function Field(props: {
	label?: ComponentChildren;
	id?: string;
	class?: string;
	state?: ControlState;
	[key: string]: unknown;
}): unknown;

export declare function Stack(props: {
	gap?: number | string;
	row?: boolean;
	class?: string;
	style?: Record<string, unknown>;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function Text(props: {
	as?: string;
	tone?: 'muted' | 'danger' | 'title' | string;
	class?: string;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function Check(props: {
	label?: ComponentChildren;
	class?: string;
	state?: ControlState;
	indeterminate?: boolean;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function Select(props: {
	label?: ComponentChildren;
	id?: string;
	options?: Option[];
	class?: string;
	state?: ControlState;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function Image(props: {
	alt?: string;
	class?: string;
	round?: boolean;
	circle?: boolean;
	[key: string]: unknown;
}): unknown;

export declare function Form(props: {
	class?: string;
	state?: ControlState;
	onSubmit?: (e: Event) => void;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function Switch(props: {
	label?: ComponentChildren;
	class?: string;
	state?: ControlState;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function Dialog(props: {
	open?: boolean;
	title?: ComponentChildren;
	onClose?: (e: Event) => void;
	class?: string;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function RadioGroup(props: {
	label?: ComponentChildren;
	name?: string;
	options?: Option[];
	value?: string;
	defaultValue?: string;
	onChange?: (e: Event) => void;
	row?: boolean;
	class?: string;
	state?: ControlState;
	[key: string]: unknown;
}): unknown;

export declare function NumberField(props: {
	label?: ComponentChildren;
	id?: string;
	class?: string;
	state?: ControlState;
	value?: number | string;
	min?: number | string;
	max?: number | string;
	step?: number | string;
	onInput?: (e: { target: { value: string; valueAsNumber: number } }) => void;
	onChange?: (e: { target: { value: string; valueAsNumber: number } }) => void;
	[key: string]: unknown;
}): unknown;

export declare function BtnGroup(props: {
	class?: string;
	state?: ControlState;
	children?: ComponentChildren;
	[key: string]: unknown;
}): unknown;

export declare function ToggleGroup(props: {
	options?: Option[];
	value?: string | string[];
	exclusive?: boolean;
	joined?: boolean;
	onChange?: (value: string | string[], e: Event) => void;
	class?: string;
	state?: ControlState;
	[key: string]: unknown;
}): unknown;

export declare function Autocomplete(props: {
	label?: ComponentChildren;
	id?: string;
	class?: string;
	state?: ControlState;
	value?: string;
	options?: Option[];
	onInput?: (e: Event) => void;
	onSelect?: (option: Option, e: Event) => void;
	[key: string]: unknown;
}): unknown;
