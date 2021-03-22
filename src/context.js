import { Component, enqueue } from './host.js';

let ctxId = 0;

export function createContext(defaultValue) {
	const id = '_c' + ctxId++;

	class Provider extends Component {
		constructor(props, context) {
			super(props, context);
			this.subs = new Set();
		}

		getChildContext() {
			return { [id]: this };
		}

		componentDidUpdate(prevProps) {
			if (prevProps.value !== this.props.value) {
				for (const c of this.subs) enqueue(c);
			}
		}

		sub(c) {
			this.subs.add(c);
			const prev = c.componentWillUnmount;
			c.componentWillUnmount = () => {
				this.subs.delete(c);
				if (prev) prev.call(c);
			};
		}

		render(props) {
			return props.children;
		}
	}

	function Consumer(props, context) {
		const p = context[id];
		return props.children(p ? p.props.value : defaultValue);
	}

	return {
		_id: id,
		_defaultValue: defaultValue,
		Provider,
		Consumer
	};
}
