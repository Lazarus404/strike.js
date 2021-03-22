export {
	h,
	createElement,
	Fragment,
	createRef,
	cloneElement,
	isValidElement,
	toChildArray
} from './src/graph.js';

export { default as options } from './src/options.js';

export {
	Component,
	render,
	hydrate,
	enqueue as enqueueRender
} from './src/host.js';

export { createPortal } from './src/patch.js';
export { createContext } from './src/context.js';
export { mount, unmount, register } from './mount.js';

import './src/patch.js';
