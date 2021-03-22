import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-btn {
  font: inherit;
  cursor: pointer;
  border: 1px solid var(--strike-line, #ccc);
  background: #fff;
  color: inherit;
  border-radius: var(--strike-radius, 6px);
  padding: 0.4rem 0.85rem;
}
.strike-btn:hover { border-color: var(--strike-muted, #666); }
.strike-btn:focus-visible { outline: 2px solid var(--strike-accent, #0b6e4f); outline-offset: 2px; }
.strike-btn:active { transform: translateY(1px); }
.strike-btn--primary {
  background: var(--strike-accent, #0b6e4f);
  border-color: transparent;
  color: #fff;
}
.strike-btn--ghost { background: transparent; }
.strike-btn--default { background: #fff; }
.strike-btn[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;

export function Btn({
	variant = 'primary',
	state = 'rest',
	class: className,
	type = 'button',
	children,
	...rest
}) {
	return h(
		'button',
		{
			...rest,
			type,
			class: cls('strike-btn', 'strike-btn--' + variant, className),
			'data-state': state
		},
		children
	);
}
