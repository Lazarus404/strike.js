import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import './shared-styles.js';

css`
.strike-field { display: flex; flex-direction: column; gap: 0.35rem; font: inherit; }
`;

export function Field({ label, id, class: className, state = 'rest', ...rest }) {
	return h(
		'label',
		{ class: cls('strike-field', className), 'data-state': state },
		label && h('span', { class: 'strike-field__label' }, label),
		h('input', { id, class: 'strike-field__input', ...rest })
	);
}
