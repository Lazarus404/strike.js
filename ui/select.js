import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import { optLabel } from './helpers.js';
import './shared-styles.js';

css`
.strike-select { display: flex; flex-direction: column; gap: 0.35rem; font: inherit; }
`;

export function Select({
	label,
	id,
	options,
	class: className,
	state = 'rest',
	children,
	...rest
}) {
	let opts = children;
	if (options) {
		opts = options.map(o =>
			h('option', { key: o.value, value: o.value }, optLabel(o))
		);
	}
	return h(
		'label',
		{ class: cls('strike-select', className), 'data-state': state },
		label && h('span', { class: 'strike-select__label' }, label),
		h('select', { id, class: 'strike-select__control', ...rest }, opts)
	);
}
