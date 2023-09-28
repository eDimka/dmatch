import { ComparatorFunction, isFunction, isPatternMatch } from './utils';

type PatternValue<T> = T | Partial<T>;
type Pattern<T> = PatternValue<T> | PatternValue<T>[] | ComparatorFunction<T>;

type MatcherFunction<T, R> = (value: T) => R | R[];

type MatcherHandler<T, R> = MatcherFunction<T, R> | R;

const isComparatorFunction = <T>(fn: Pattern<T>): fn is ComparatorFunction<T> =>
    typeof fn === 'function';

export const match = <T, R>(value?: T) => {
    type Matcher = {
        pattern: Pattern<T>;
        handler: MatcherFunction<T, R>;
    };

    const matchers: Matcher[] = [];
    let defaultValue: MatcherFunction<T, R> | undefined;

    const resolveHandler = (
        handler: R | MatcherFunction<T, R>,
    ): MatcherFunction<T, R> =>
        isFunction<MatcherFunction<T, R>>(handler)
            ? handler
            : () => handler as R;

    const addMatcher = (pattern: Pattern<T>, handler: MatcherHandler<T, R>) => {
        matchers.push({ pattern, handler: resolveHandler(handler) });
    };

    return {
        with(
            patterns: Pattern<T> | Pattern<T>[],
            handler: MatcherHandler<T, R>,
        ) {
            (Array.isArray(patterns) ? patterns : [patterns]).forEach(
                (pattern) => addMatcher(pattern, handler),
            );
            return this;
        },

        default(handler: MatcherHandler<T, R>) {
            if (Array.isArray(handler)) {
                defaultValue = () => [...handler] as R[];
            } else {
                defaultValue = resolveHandler(handler);
            }
            return this;
        },

        execute(inputValue?: T): R | R[] | never {
            const finalValue = inputValue ?? (value as T);
            for (const { pattern, handler } of matchers) {
                if (pattern === finalValue) {
                    return handler(finalValue);
                }

                if (isComparatorFunction(pattern) && pattern(finalValue)) {
                    return handler(finalValue);
                }

                if (typeof pattern === 'object' && pattern !== null) {
                    if (isPatternMatch(finalValue, pattern as Partial<T>)) {
                        return handler(finalValue);
                    }
                }
            }

            if (defaultValue) {
                return defaultValue(finalValue);
            }

            throw new Error('No match found and no default provided.');
        },

        finalize() {
            return this.execute;
        },
    };
};
