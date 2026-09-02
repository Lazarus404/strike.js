import type { Context, RefObject } from './index.js';

export declare function useState<T>(
	initial: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void];

export declare function useReducer<S, A>(
	reducer: (state: S, action: A) => S,
	initial: S,
	init?: (initial: S) => S
): [S, (action: A) => void];

export declare function useEffect(
	effect: () => void | (() => void),
	deps?: readonly unknown[]
): void;

export declare function useLayoutEffect(
	effect: () => void | (() => void),
	deps?: readonly unknown[]
): void;

export declare function useRef<T>(initial: T): RefObject<T> & { current: T };

export declare function useMemo<T>(
	factory: () => T,
	deps: readonly unknown[]
): T;

export declare function useCallback<T extends (...args: never[]) => unknown>(
	fn: T,
	deps: readonly unknown[]
): T;

export declare function useContext<T>(ctx: Context<T>): T;

export declare function useErrorBoundary(
	onError?: (error: unknown) => void
): [unknown | null, () => void];

export declare function useId(): string;
