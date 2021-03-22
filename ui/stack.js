import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-stack { display: flex; flex-direction: column; }
.strike-stack--row { flex-direction: row; align-items: center; }
`;

export function Stack({ gap = 8, row, class: className, children, style, ...rest }) {
	return h(
		'div',
		{
			...rest,
			class: cls('strike-stack', row && 'strike-stack--row', className),
			style: { gap, ...(style || {}) }
		},
		children
	);
}
