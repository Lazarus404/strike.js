import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

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
.strike-check[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;

export function Check({
	label,
	class: className,
	state = 'rest',
	children,
	...rest
}) {
	return h(
		'label',
		{ class: cls('strike-check', className), 'data-state': state },
		h('input', { type: 'checkbox', class: 'strike-check__input', ...rest }),
		(label || children) &&
			h('span', { class: 'strike-check__label' }, label || children)
	);
}
