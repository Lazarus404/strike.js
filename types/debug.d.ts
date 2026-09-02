export interface DebugOptions {
	log?: (...args: unknown[]) => void;
	diff?: boolean;
	vnode?: (node: unknown) => void;
}

/** Install verbose diff / hydrate logs. Returns uninstall(). */
export declare function installDebug(opts?: DebugOptions): () => void;
