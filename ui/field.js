import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-field { display: flex; flex-direction: column; gap: 0.35rem; font: inherit; }
.strike-field__label { font-size: 0.85rem; color: var(--strike-muted, #5c5c5c); }
.strike-field__input {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  background: #fff;
}
.strike-field__input:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-field[data-state="invalid"] .strike-field__input {
  border-color: var(--strike-danger, #9b2226);
}
`;

export function Field({ label, id, class: className, state = 'rest', ...rest }) {
	return h(
		'label',
		{ class: cls('strike-field', className), 'data-state': state },
		label && h('span', { class: 'strike-field__label' }, label),
		h('input', { id, class: 'strike-field__input', ...rest })
	);
}
