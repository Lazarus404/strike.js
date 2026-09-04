import { h } from '../index.js';
import { useState } from '../hooks.js';
import { css } from '../css.js';
import { cls } from './cls.js';
import { optLabel } from './helpers.js';
import './shared-styles.js';

css`
.strike-autocomplete {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font: inherit;
  position: relative;
}
.strike-autocomplete__input {
  width: 100%;
  box-sizing: border-box;
}
.strike-autocomplete__list {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 20;
  margin: 0.2rem 0 0;
  padding: 0.25rem 0;
  list-style: none;
  background: #fff;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  max-height: 12rem;
  overflow: auto;
}
.strike-autocomplete__option {
  padding: 0.4rem 0.65rem;
  cursor: pointer;
}
.strike-autocomplete__option[aria-selected="true"],
.strike-autocomplete__option:hover {
  background: color-mix(in srgb, var(--strike-accent, #0b6e4f) 12%, #fff);
}
`;

/**
 * Controlled combobox. Parent owns options (and filtering).
 * onInput(e) for typing; onSelect(option, e) when an option is chosen.
 */
export function Autocomplete({
	label,
	id,
	class: className,
	state = 'rest',
	value = '',
	options = [],
	onInput,
	onSelect,
	...rest
}) {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);
	const listId = id ? id + '-list' : undefined;

	function pick(opt, e) {
		setOpen(false);
		if (onSelect) onSelect(opt, e);
	}

	function move(delta, e) {
		e.preventDefault();
		setOpen(true);
		setActive(i => (i + delta + options.length) % options.length);
	}

	function onKeyDown(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			setOpen(false);
			return;
		}
		if (!options.length) return;
		if (e.key === 'ArrowDown') return move(1, e);
		if (e.key === 'ArrowUp') return move(-1, e);
		if (e.key === 'Enter' && open) {
			e.preventDefault();
			const opt = options[active];
			if (opt) pick(opt, e);
		}
	}

	return h(
		'div',
		{ class: cls('strike-autocomplete', className), 'data-state': state },
		label && h('span', { class: 'strike-autocomplete__label' }, label),
		h('input', {
			...rest,
			id,
			type: 'text',
			role: 'combobox',
			class: 'strike-autocomplete__input',
			value,
			autocomplete: 'off',
			'aria-expanded': open && options.length > 0,
			'aria-controls': listId,
			'aria-autocomplete': 'list',
			onInput: e => {
				setOpen(true);
				setActive(0);
				if (onInput) onInput(e);
			},
			onFocus: e => {
				setOpen(true);
				if (rest.onFocus) rest.onFocus(e);
			},
			onBlur: e => {
				setTimeout(() => setOpen(false), 0);
				if (rest.onBlur) rest.onBlur(e);
			},
			onKeyDown
		}),
		open && options.length
			? h(
					'ul',
					{
						id: listId,
						role: 'listbox',
						class: 'strike-autocomplete__list'
					},
					options.map((o, i) =>
						h(
							'li',
							{
								key: String(o.value),
								role: 'option',
								class: 'strike-autocomplete__option',
								'aria-selected': i === active,
								onMouseDown: e => {
									e.preventDefault();
									pick(o, e);
								}
							},
							optLabel(o)
						)
					)
				)
			: null
	);
}
