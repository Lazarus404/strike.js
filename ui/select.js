import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-select { display: flex; flex-direction: column; gap: 0.35rem; font: inherit; }
.strike-select__label { font-size: 0.85rem; color: var(--strike-muted, #5c5c5c); }
.strike-select__control {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  background: #fff;
}
.strike-select__control:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-select[data-state="invalid"] .strike-select__control {
  border-color: var(--strike-danger, #9b2226);
}
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
			h('option', { key: o.value, value: o.value }, o.label != null ? o.label : o.value)
		);
	}
	return h(
		'label',
		{ class: cls('strike-select', className), 'data-state': state },
		label && h('span', { class: 'strike-select__label' }, label),
		h('select', { id, class: 'strike-select__control', ...rest }, opts)
	);
}
