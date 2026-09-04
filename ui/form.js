import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import './shared-styles.js';

css`
.strike-form {
  display: flex;
  flex-direction: column;
  gap: var(--strike-gap, 0.75rem);
  font: inherit;
}
`;

/** Form shell: preventDefault + optional busy state. */
export function Form({
	class: className,
	state = 'rest',
	onSubmit,
	children,
	...rest
}) {
	return h(
		'form',
		{
			...rest,
			class: cls('strike-form', className),
			'data-state': state,
			onSubmit: e => {
				e.preventDefault();
				if (onSubmit) onSubmit(e);
			}
		},
		children
	);
}
