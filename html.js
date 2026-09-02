import { h } from './src/graph.js';

/**
 * Tagged template -> VNodes (htm-class, not lit-html).
 * Attr prefixes: .prop  ?bool  @event  (compiled to DOM props / bool attrs / on*).
 */
export function html(strings, ...values) {
	const src = build(strings, values);
	const parsed = parse(src.s, src.map);
	return parsed.length === 1 ? parsed[0] : h(Fragmentish, null, parsed);
}

function Fragmentish(props) {
	return props.children;
}

function build(strings, values) {
	let s = '';
	const map = [];
	for (let i = 0; i < strings.length; i++) {
		s += strings[i];
		if (i < values.length) {
			map.push({ index: s.length, value: values[i] });
			s += '\0' + (map.length - 1) + '\0';
		}
	}
	return { s, map };
}

function parse(src, map) {
	const out = [];
	const re =
		/<!--[\s\S]*?-->|<\/([^\s>]+)\s*>|<([a-zA-Z\0][^\s>/]*)([^>]*?)(\/?)>|([^<]+)/g;
	const stack = [{ children: out, type: null }];

	let m;
	while ((m = re.exec(src))) {
		if (m[0].startsWith('<!--')) continue;
		if (m[1]) {
			if (stack.length > 1) stack.pop();
			continue;
		}
		if (m[2]) {
			const tag = m[2];
			const attrs = parseAttrs(m[3], map);
			const selfClose = m[4] === '/' || VOID[tag.toLowerCase()];
			const type = resolveType(tag, map);
			const vnode = { type, props: attrs, children: [] };
			stack[stack.length - 1].children.push(vnode);
			if (!selfClose) stack.push(vnode);
			continue;
		}
		if (m[5] != null) {
			const parts = splitText(m[5], map);
			for (let i = 0; i < parts.length; i++) {
				const p = parts[i];
				if (p === '' || p == null || p === false || p === true) continue;
				stack[stack.length - 1].children.push(p);
			}
		}
	}

	return out.map(toVNode);
}

function toVNode(node) {
	if (node == null || typeof node !== 'object' || !('type' in node)) return node;
	const props = {};
	for (const k in node.props) props[k] = node.props[k];
	const kids = [];
	for (let i = 0; i < node.children.length; i++) {
		const c = toVNode(node.children[i]);
		if (c !== '' && c != null && c !== false) kids.push(c);
	}
	if (kids.length === 1) props.children = kids[0];
	else if (kids.length > 1) props.children = kids;
	return h(node.type, props);
}

function resolveType(tag, map) {
	const dyn = tag.match(/^\0(\d+)\0$/);
	if (dyn) return map[+dyn[1]].value;
	return tag;
}

function parseAttrs(raw, map) {
	const props = {};
	if (!raw || !raw.trim()) return props;
	const re =
		/([.?@]?[^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
	let m;
	while ((m = re.exec(raw))) {
		let name = m[1];
		if (!name || name === '/') continue;
		let value =
			m[2] !== undefined
				? m[2]
				: m[3] !== undefined
					? m[3]
					: m[4] !== undefined
						? m[4]
						: true;

		if (typeof value === 'string' && value.includes('\0')) {
			value = expand(value, map);
		}
		if (name.includes('\0')) continue;

		const prefix = name[0];
		if (prefix === '.' || prefix === '?' || prefix === '@') {
			name = name.slice(1);
			if (!name) continue;
			if (prefix === '@') {
				props['on' + name[0].toUpperCase() + name.slice(1)] = value;
			} else if (prefix === '?') {
				if (value) props[name] = true;
			} else {
				// .prop - DOM property; Strike setProperty already prefers props on the element
				props[name] = value;
			}
			continue;
		}

		if (name === 'class') props.class = value;
		else props[name] = value;
	}
	return props;
}

function expand(str, map) {
	const only = str.match(/^\0(\d+)\0$/);
	if (only) return map[+only[1]].value;
	return str.replace(/\0(\d+)\0/g, (_, i) => {
		const v = map[+i].value;
		return v == null ? '' : '' + v;
	});
}

function splitText(text, map) {
	if (!text.includes('\0')) {
		return text.trim() === '' ? [] : [text];
	}
	const parts = [];
	const re = /\0(\d+)\0/g;
	let last = 0;
	let m;
	while ((m = re.exec(text))) {
		if (m.index > last) parts.push(text.slice(last, m.index));
		parts.push(map[+m[1]].value);
		last = m.index + m[0].length;
	}
	if (last < text.length) parts.push(text.slice(last));
	return parts.filter(p => {
		if (typeof p === 'string') return p.trim() !== '';
		return p != null && p !== false;
	});
}

const VOID = {
	area: 1,
	base: 1,
	br: 1,
	col: 1,
	embed: 1,
	hr: 1,
	img: 1,
	input: 1,
	link: 1,
	meta: 1,
	param: 1,
	source: 1,
	track: 1,
	wbr: 1
};
