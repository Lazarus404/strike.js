import { css } from '../css.js';

/** Shared catalog chrome. Import from each control that needs these rules. */
css`
.strike-field__label,
.strike-select__label,
.strike-number__label,
.strike-autocomplete__label,
.strike-radio-group__label {
  font-size: 0.85rem;
  color: var(--strike-muted, #5c5c5c);
}
.strike-field__input,
.strike-select__control,
.strike-autocomplete__input,
.strike-number__input {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  background: #fff;
}
.strike-field__input:focus-visible,
.strike-select__control:focus-visible,
.strike-autocomplete__input:focus-visible,
.strike-number__input:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-field[data-state="invalid"] .strike-field__input,
.strike-select[data-state="invalid"] .strike-select__control,
.strike-autocomplete[data-state="invalid"] .strike-autocomplete__input,
.strike-number[data-state="invalid"] .strike-number__input {
  border-color: var(--strike-danger, #9b2226);
}
.strike-btn-group > .strike-btn,
.strike-toggle-group--joined > .strike-btn {
  border-radius: 0;
  margin-left: -1px;
}
.strike-btn-group > .strike-btn:first-child,
.strike-toggle-group--joined > .strike-btn:first-child {
  margin-left: 0;
  border-radius: var(--strike-radius, 6px) 0 0 var(--strike-radius, 6px);
}
.strike-btn-group > .strike-btn:last-child,
.strike-toggle-group--joined > .strike-btn:last-child {
  border-radius: 0 var(--strike-radius, 6px) var(--strike-radius, 6px) 0;
}
.strike-btn-group > .strike-btn:only-child,
.strike-toggle-group--joined > .strike-btn:only-child {
  border-radius: var(--strike-radius, 6px);
  margin-left: 0;
}
.strike-btn[data-state="busy"],
.strike-check[data-state="busy"],
.strike-switch[data-state="busy"],
.strike-btn-group[data-state="busy"],
.strike-toggle-group[data-state="busy"],
.strike-number[data-state="busy"],
.strike-autocomplete[data-state="busy"],
.strike-radio-group[data-state="busy"] {
  opacity: 0.6;
  pointer-events: none;
}
.strike-form[data-state="busy"] {
  opacity: 0.7;
  pointer-events: none;
}
`;
