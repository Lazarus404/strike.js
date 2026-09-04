import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import { optLabel } from './helpers.js';
import './shared-styles.js';

css`
.strike-radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font: inherit;
}
.strike-radio-group__options {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.strike-radio-group__options--row {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.strike-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  cursor: pointer;
}
.strike-radio__input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--strike-accent, #0b6e4f);
}
`;

/** Native radio group. options: [{ value, label }]. */
export function RadioGroup({
	label,
	name,
	options = [],
	value,
	defaultValue,
	onChange,
	row,
	class: className,
	state = 'rest',
	...rest
}) {
	const controlled = value !== undefined;
	return h(
		'div',
		{
			...rest,
			role: 'radiogroup',
			'aria-label': typeof label === 'string' ? label : rest['aria-label'],
			class: cls('strike-radio-group', className),
			'data-state': state
		},
		label && h('span', { class: 'strike-radio-group__label' }, label),
		h(
			'div',
			{
				class: cls(
					'strike-radio-group__options',
					row && 'strike-radio-group__options--row'
				)
			},
			options.map(o => {
				const v = o.value;
				const checked = controlled
					? value === v
					: defaultValue !== undefined
						? defaultValue === v
						: undefined;
				return h(
					'label',
					{ key: String(v), class: 'strike-radio' },
					h('input', {
						type: 'radio',
						class: 'strike-radio__input',
						name,
						value: v,
						checked,
						onChange: e => {
							if (onChange) onChange(e);
						}
					}),
					h('span', { class: 'strike-radio__label' }, optLabel(o))
				);
			})
		)
	);
}
