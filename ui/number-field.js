import { h } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import { Btn } from './btn.js';

css`
.strike-number {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font: inherit;
}
.strike-number__label {
  font-size: 0.85rem;
  color: var(--strike-muted, #5c5c5c);
}
.strike-number__row {
  display: inline-flex;
  align-items: stretch;
  gap: 0;
}
.strike-number__input {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: 0;
  background: #fff;
  width: 4.5rem;
  text-align: center;
  -moz-appearance: textfield;
}
.strike-number__input::-webkit-outer-spin-button,
.strike-number__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.strike-number__input:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
  z-index: 1;
}
.strike-number__row .strike-btn {
  border-radius: 0;
  padding: 0.4rem 0.65rem;
  min-width: 2.25rem;
}
.strike-number__row .strike-btn:first-child {
  border-radius: var(--strike-radius, 6px) 0 0 var(--strike-radius, 6px);
}
.strike-number__row .strike-btn:last-child {
  border-radius: 0 var(--strike-radius, 6px) var(--strike-radius, 6px) 0;
}
.strike-number__row .strike-btn + .strike-number__input {
  margin-left: -1px;
}
.strike-number__row .strike-number__input + .strike-btn {
  margin-left: -1px;
}
.strike-number[data-state="invalid"] .strike-number__input {
  border-color: var(--strike-danger, #9b2226);
}
.strike-number[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;

function clamp(n, min, max) {
	if (min != null && n < min) return min;
	if (max != null && n > max) return max;
	return n;
}

function toNum(v, fallback) {
	const n = typeof v === 'number' ? v : parseFloat(v);
	return Number.isFinite(n) ? n : fallback;
}

/** Number input with +/- steppers. */
export function NumberField({
	label,
	id,
	class: className,
	state = 'rest',
	value,
	min,
	max,
	step = 1,
	onInput,
	onChange,
	...rest
}) {
	const stepN = toNum(step, 1);
	const minN = min == null ? null : toNum(min, null);
	const maxN = max == null ? null : toNum(max, null);

	function emit(next, e) {
		const clamped = clamp(next, minN, maxN);
		if (onInput) {
			onInput({
				...e,
				target: { ...e.target, value: String(clamped), valueAsNumber: clamped }
			});
		}
		if (onChange) {
			onChange({
				...e,
				target: { ...e.target, value: String(clamped), valueAsNumber: clamped }
			});
		}
	}

	function bump(dir, e) {
		e.preventDefault();
		const cur = toNum(value, 0);
		emit(cur + dir * stepN, e);
	}

	return h(
		'div',
		{ class: cls('strike-number', className), 'data-state': state },
		label && h('span', { class: 'strike-number__label' }, label),
		h(
			'div',
			{ class: 'strike-number__row' },
			h(
				Btn,
				{
					type: 'button',
					variant: 'default',
					'aria-label': 'Decrease',
					onClick: e => bump(-1, e)
				},
				'-'
			),
			h('input', {
				...rest,
				id,
				type: 'number',
				class: 'strike-number__input',
				value,
				min: minN,
				max: maxN,
				step: stepN,
				onInput: e => {
					const n = toNum(e.target.value, 0);
					emit(n, e);
				}
			}),
			h(
				Btn,
				{
					type: 'button',
					variant: 'default',
					'aria-label': 'Increase',
					onClick: e => bump(1, e)
				},
				'+'
			)
		)
	);
}
