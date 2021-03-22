import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-image {
  display: block;
  max-width: 100%;
  height: auto;
}
.strike-image--round { border-radius: var(--strike-radius, 6px); }
.strike-image--circle { border-radius: 50%; }
`;

export function Image({
	alt = '',
	class: className,
	round,
	circle,
	...rest
}) {
	return h('img', {
		...rest,
		alt,
		class: cls(
			'strike-image',
			round && 'strike-image--round',
			circle && 'strike-image--circle',
			className
		)
	});
}
