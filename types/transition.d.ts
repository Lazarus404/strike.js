export type TransitionPreset =
	| 'fade'
	| 'slide-up'
	| 'slide-down'
	| 'slide-start'
	| 'slide-end'
	| 'none';

export type TransitionPhase = 'enter' | 'in' | 'exit';

export type TransitionInput =
	| false
	| TransitionPreset
	| {
			enter?: TransitionPreset | false;
			exit?: TransitionPreset | false;
			move?: 'flip' | 'none' | false;
			ms?: number;
			ease?: string;
			distance?: string;
	  };

export type ResolvedTransition = {
	enter: string;
	exit: string;
	move: string;
	ms: number;
	ease: string;
	distance: string;
	disabled: boolean;
};

export declare function resolveTransition(
	input?: TransitionInput,
	defaults?: TransitionInput | Record<string, unknown>
): ResolvedTransition;

export declare function transitionClass(
	name: string | false | null | undefined,
	phase?: TransitionPhase
): string;

export declare function transitionVars(opts?: {
	ms?: number;
	ease?: string;
	distance?: string;
}): Record<string, string>;

export declare function waitMs(ms: number): Promise<void>;

export declare function flipLayout(
	elements: ArrayLike<Element | null | undefined> | null | undefined,
	opts?: { ms?: number; ease?: string; disabled?: boolean }
): () => void;

export declare function useTransition(opts?: {
	name?: TransitionPreset | false;
	ms?: number;
	ease?: string;
	distance?: string;
	open?: boolean;
	onExited?: () => void;
}): {
	phase: TransitionPhase;
	className: string;
	style: Record<string, string>;
	requestExit: () => void;
};
