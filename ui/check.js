import { h } from '../index.js';
import { useLayoutEffect, useRef } from '../hooks.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import { slotLabel } from './helpers.js';
import './shared-styles.js';

css`
.strike-check {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  cursor: pointer;
}
.strike-check__input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--strike-accent, #0b6e4f);
}
`;

export function Check({
	label,
	class: className,
	state = 'rest',
	indeterminate = false,
	children,
	...rest
}) {
	const inputRef = useRef(null);
	useLayoutEffect(() => {
		if (inputRef.current) inputRef.current.indeterminate = !!indeterminate;
	}, [indeterminate]);
	return h(
		'label',
		{ class: cls('strike-check', className), 'data-state': state },
		h('input', {
			...rest,
			ref: inputRef,
			type: 'checkbox',
			class: 'strike-check__input'
		}),
		slotLabel(label, children, 'strike-check__label')
	);
}
