/** Published package on jsDelivr / unpkg. Bump when releasing examples against a new version. */
export const STRIKE_FW_VERSION = '0.2.2';
export const STRIKE_FW_CDN =
	'https://cdn.jsdelivr.net/npm/strike-fw@' + STRIKE_FW_VERSION;

/** Map bare strike-fw imports to CDN URLs for browser ESM. */
export function toCdnSpecifier(spec) {
	if (spec === 'strike-fw') return STRIKE_FW_CDN + '/index.js';
	if (spec === 'strike-fw/hooks') return STRIKE_FW_CDN + '/hooks.js';
	if (spec === 'strike-fw/jsx-runtime' || spec === 'strike-fw/jsx-dev-runtime') {
		return STRIKE_FW_CDN + '/jsx-runtime.js';
	}
	if (spec.startsWith('strike-fw/')) {
		return STRIKE_FW_CDN + '/' + spec.slice('strike-fw/'.length);
	}
	return spec;
}

export function rewriteStrikeFwImports(code) {
	return code.replace(
		/from\s*["'](strike-fw(?:\/[^"']*)?)["']/g,
		(_, spec) => 'from "' + toCdnSpecifier(spec) + '"'
	);
}
