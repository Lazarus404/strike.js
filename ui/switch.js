import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import { slotLabel } from './helpers.js';
import './shared-styles.js';

css`
.strike-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  cursor: pointer;
  position: relative;
}
.strike-switch__track {
  position: relative;
  width: 2.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: var(--strike-line, #ccc);
  transition: background 0.15s ease;
  flex-shrink: 0;
}
.strike-switch__track::after {
  content: "";
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: transform 0.15s ease;
}
.strike-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.strike-switch__input:focus-visible + .strike-switch__track {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 2px;
}
.strike-switch__input:checked + .strike-switch__track {
  background: var(--strike-accent, #0b6e4f);
}
.strike-switch__input:checked + .strike-switch__track::after {
  transform: translateX(1rem);
}
`;

/** Accessible switch built on a checkbox. */
export function Switch({
	label,
	class: className,
	state = 'rest',
	children,
	...rest
}) {
	return h(
		'label',
		{ class: cls('strike-switch', className), 'data-state': state },
		h('input', {
			type: 'checkbox',
			role: 'switch',
			class: 'strike-switch__input',
			...rest
		}),
		h('span', { class: 'strike-switch__track', 'aria-hidden': 'true' }),
		slotLabel(label, children, 'strike-switch__label')
	);
}
