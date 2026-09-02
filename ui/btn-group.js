import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-btn-group {
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  font: inherit;
}
.strike-btn-group > .strike-btn {
  border-radius: 0;
  margin-left: -1px;
}
.strike-btn-group > .strike-btn:first-child {
  margin-left: 0;
  border-radius: var(--strike-radius, 6px) 0 0 var(--strike-radius, 6px);
}
.strike-btn-group > .strike-btn:last-child {
  border-radius: 0 var(--strike-radius, 6px) var(--strike-radius, 6px) 0;
}
.strike-btn-group > .strike-btn:only-child {
  border-radius: var(--strike-radius, 6px);
  margin-left: 0;
}
.strike-btn-group[data-state="busy"] { opacity: 0.6; pointer-events: none; }
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
