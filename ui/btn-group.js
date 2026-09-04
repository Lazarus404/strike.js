import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import './shared-styles.js';

css`
.strike-btn-group {
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  font: inherit;
}
`;

/** Joined row of Btn children. role=group. */
export function BtnGroup({
	class: className,
	state = 'rest',
	children,
	...rest
}) {
	return h(
		'div',
		{
			...rest,
			role: 'group',
			class: cls('strike-btn-group', className),
			'data-state': state
		},
		children
	);
}
