export type Key = string | number | bigint;

export interface RefObject<T = unknown> {
	current: T | null;
}

export type RefCallback<T = unknown> = (value: T | null) => void | (() => void);

export type Ref<T = unknown> = RefObject<T> | RefCallback<T>;

export type ComponentChild =
	| VNode
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined
	| ComponentChildren;

export type ComponentChildren = ComponentChild[] | ComponentChild;

export interface VNode<P = Record<string, unknown>> {
	type: string | ComponentType<P> | null;
	props: P & { children?: ComponentChildren };
	key: Key | null;
	ref: Ref | null;
}

export type FunctionComponent<P = Record<string, unknown>> = (
	props: P,
	context?: unknown
) => ComponentChild;

export interface ComponentClass<P = Record<string, unknown>, S = Record<string, unknown>> {
	new (props: P, context?: unknown): Component<P, S>;
	contextType?: Context<unknown>;
}

export type ComponentType<P = Record<string, unknown>> =
	| FunctionComponent<P>
	| ComponentClass<P>;

export interface Attributes {
	key?: Key;
	ref?: Ref;
}

export type RenderableProps<P> = P &
	Attributes & {
		children?: ComponentChildren;
	};

export declare class Component<
	P = Record<string, unknown>,
	S = Record<string, unknown>
> {
	constructor(props: P, context?: unknown);
	props: RenderableProps<P>;
	state: S;
	context: unknown;
	setState(
		update: Partial<S> | ((state: S, props: RenderableProps<P>) => Partial<S> | null),
		callback?: () => void
	): void;
	forceUpdate(callback?: () => void): void;
	render(props: RenderableProps<P>, state?: S, context?: unknown): ComponentChild;
	componentWillMount?(): void;
	componentDidMount?(): void;
	componentWillUnmount?(): void;
	componentWillUpdate?(nextProps: RenderableProps<P>, nextState: S): void;
	componentDidUpdate?(prevProps: RenderableProps<P>, prevState: S): void;
	shouldComponentUpdate?(nextProps: RenderableProps<P>, nextState: S): boolean;
	getChildContext?(): object;
	static getDerivedStateFromProps?(
		props: Record<string, unknown>,
		state: Record<string, unknown>
	): object | null;
	static getDerivedStateFromError?(error: unknown): object | null;
	static contextType?: Context<unknown>;
}

export interface Context<T> {
	Provider: ComponentType<{ value: T; children?: ComponentChildren }>;
	Consumer: ComponentType<{
		children: (value: T) => ComponentChild;
	}>;
	_id?: string;
	_defaultValue?: T;
}

export declare function createElement(
	type: null,
	props: string | number | bigint
): VNode;
export declare function createElement<P>(
	type: string | ComponentType<P>,
	props: (Attributes & P) | null,
	...children: ComponentChildren[]
): VNode<P>;

export declare const h: typeof createElement;

export declare function Fragment(props: {
	children?: ComponentChildren;
}): ComponentChildren;

export declare function createRef<T = unknown>(): RefObject<T>;

export declare function cloneElement<P>(
	vnode: VNode<P>,
	props?: Partial<P> & Attributes | null,
	...children: ComponentChildren[]
): VNode<P>;

export declare function isValidElement(value: unknown): value is VNode;

export declare function toChildArray(
	children: ComponentChildren,
	out?: ComponentChild[]
): ComponentChild[];

export declare const options: {
	vnode?: (node: VNode) => void;
	unmount?: (node: VNode) => void;
	diffed?: (node: VNode) => void;
	event?: (e: Event) => Event;
	debounceRendering?: (fn: () => void) => void;
	requestAnimationFrame?: (fn: () => void) => void;
	[key: string]: unknown;
};

export declare function render(
	vnode: ComponentChild,
	parent: Element | Document | DocumentFragment | ShadowRoot,
	replaceNode?: Element | Text
): void;

export declare function hydrate(
	vnode: ComponentChild,
	parent: Element | Document | DocumentFragment | ShadowRoot
): void;

export declare function enqueueRender(component: Component): void;

export declare function createPortal(
	child: ComponentChild,
	container: Element | DocumentFragment
): VNode;

export declare function createContext<T>(defaultValue: T): Context<T>;

export interface MountOptions {
	hydrate?: boolean;
}

export declare function mount(
	target: string | Element,
	component: ComponentType | string,
	props?: Record<string, unknown> | null,
	opts?: MountOptions
): Element | Element[];

export declare function unmount(
	target: string | Element,
	keepHost?: boolean
): void;

export declare function register(
	name: string,
	component: ComponentType
): void;
