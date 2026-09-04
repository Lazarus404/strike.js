import { h } from '../index.js';

/** Option display label (falls back to value). */
export function optLabel(o) {
	return o.label != null ? o.label : o.value;
}

/** Label or children wrapped in a span, or null. */
export function slotLabel(label, children, className) {
	return (label || children) && h('span', { class: className }, label || children);
}
