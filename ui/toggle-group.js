import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import { Btn } from './btn.js';

css`
.strike-toggle-group {
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.35rem;
  font: inherit;
}
.strike-toggle-group--joined {
  gap: 0;
}
.strike-toggle-group--joined > .strike-btn {
  border-radius: 0;
  margin-left: -1px;
}
.strike-toggle-group--joined > .strike-btn:first-child {
  margin-left: 0;
  border-radius: var(--strike-radius, 6px) 0 0 var(--strike-radius, 6px);
}
.strike-toggle-group--joined > .strike-btn:last-child {
  border-radius: 0 var(--strike-radius, 6px) var(--strike-radius, 6px) 0;
}
.strike-toggle-group--joined > .strike-btn:only-child {
  border-radius: var(--strike-radius, 6px);
  margin-left: 0;
}
.strike-toggle-group[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;

function isSelected(value, v, exclusive) {
	if (exclusive) return value === v;
	return Array.isArray(value) && value.indexOf(v) !== -1;
}

/** Segmented toggles. exclusive (default) = single value; else string[]. */
export function ToggleGroup({
	options = [],
	value,
	exclusive = true,
	joined = true,
	onChange,
	class: className,
	state = 'rest',
	...rest
}) {
	return h(
		'div',
		{
			...rest,
			role: exclusive ? 'radiogroup' : 'group',
			class: cls(
				'strike-toggle-group',
				joined && 'strike-toggle-group--joined',
				className
			),
			'data-state': state
		},
		options.map(o => {
			const v = o.value;
			const selected = isSelected(value, v, exclusive);
			return h(
				Btn,
				{
					key: String(v),
					type: 'button',
					variant: selected ? 'primary' : 'ghost',
					role: exclusive ? 'radio' : 'button',
					'aria-checked': exclusive ? (selected ? 'true' : 'false') : undefined,
					'aria-pressed': exclusive ? undefined : selected ? 'true' : 'false',
					onClick: e => {
						if (!onChange) return;
						if (exclusive) {
							onChange(v, e);
							return;
						}
						const cur = Array.isArray(value) ? value.slice() : [];
						const i = cur.indexOf(v);
						if (i === -1) cur.push(v);
						else cur.splice(i, 1);
						onChange(cur, e);
					}
				},
				o.label != null ? o.label : v
			);
		})
	);
}
