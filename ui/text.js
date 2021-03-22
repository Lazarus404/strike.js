import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-text { margin: 0; font: inherit; color: inherit; }
.strike-text--muted { color: var(--strike-muted, #5c5c5c); }
.strike-text--danger { color: var(--strike-danger, #9b2226); }
.strike-text--title { font-size: 1.25rem; font-weight: 600; }
`;

const ALLOWED = { p: 1, span: 1, h1: 1, h2: 1, h3: 1, label: 1, strong: 1, em: 1 };

export function Text({ as = 'p', tone, class: className, children, ...rest }) {
	const tag = ALLOWED[as] ? as : 'p';
	return h(
		tag,
		{
			...rest,
			class: cls(
				'strike-text',
				tone && 'strike-text--' + tone,
				className
			)
		},
		children
	);
}
