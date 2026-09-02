import { h, createPortal } from '../index.js';
import { css } from '../css.js';
import { cls } from './cls.js';

css`
.strike-dialog-root {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.4);
}
.strike-dialog {
  max-width: 24rem;
  width: 100%;
  max-height: min(90vh, 32rem);
  overflow: auto;
  background: #fff;
  color: var(--strike-ink, #1a1a1a);
  border-radius: var(--strike-radius, 6px);
  border: 1px solid var(--strike-line, #ccc);
  padding: 1rem 1.1rem;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
}
.strike-dialog__title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}
`;

/**
 * Modal via createPortal. Pass open=false to render nothing.
 * onClose fires on backdrop click (not panel clicks).
 */
export function Dialog({
	open,
	title,
	onClose,
	class: className,
	children,
	...rest
}) {
	if (!open) return null;
	const portalTarget =
		typeof document !== 'undefined' ? document.body : null;
	if (!portalTarget) return null;

	return createPortal(
		h(
			'div',
			{
				class: 'strike-dialog-root',
				role: 'presentation',
				onClick: e => {
					if (e.target === e.currentTarget && onClose) onClose(e);
				}
			},
			h(
				'div',
				{
					...rest,
					role: 'dialog',
					'aria-modal': 'true',
					class: cls('strike-dialog', className),
					onClick: e => e.stopPropagation()
				},
				title && h('h2', { class: 'strike-dialog__title' }, title),
				children
			)
		),
		portalTarget
	);
}
