import { ComparatorFunction, isPatternMatch } from './utils';

type Pattern<T> = T | ComparatorFunction<T> | Partial<T>;
type MatcherFunction<T, R> = (value: T) => R;
type MatcherHandler<T, R> = MatcherFunction<T, R> | R;

interface Matcher<T, R> {
  pattern: Pattern<T>;
  handler: MatcherFunction<T, R>;
}

const isComparatorFunction = <T>(
  fn: Pattern<T>,
): fn is ComparatorFunction<T> => {
  return typeof fn === 'function';
};

interface Matcher<T, R> {
  pattern: Pattern<T>;
  handler: MatcherFunction<T, R>;
}

export const match = <T, R>(value?: T) => {
  type Matcher = {
    pattern: Pattern<T>;
    handler: MatcherFunction<T, R>;
  };

  const matchers: Matcher[] = [];
  let defaultValue: MatcherFunction<T, R> | undefined;

  return {
    with(patterns: Pattern<T> | Pattern<T>[], handler: MatcherHandler<T, R>) {
      const isFunc = (func: any): func is MatcherFunction<T, R> =>
        typeof func === 'function';

      const resolvedHandler: MatcherFunction<T, R> = isFunc(handler)
        ? handler
        : () => handler;

      if (Array.isArray(patterns)) {
        for (const pattern of patterns) {
          matchers.push({ pattern, handler: resolvedHandler });
        }
      } else {
        matchers.push({ pattern: patterns, handler: resolvedHandler });
      }
      return this;
    },
    default(handler: MatcherFunction<T, R>) {
      defaultValue = handler;
      return this;
    },
    execute(inputValue?: T): R | never {
      const finalValue = inputValue !== undefined ? inputValue : (value as T);
      for (const matcher of matchers) {
        if (isComparatorFunction(matcher.pattern)) {
          if (matcher.pattern(finalValue)) {
            return matcher.handler(finalValue);
          }
        } else if (typeof matcher.pattern === 'object') {
          if (isPatternMatch(finalValue, matcher.pattern)) {
            return matcher.handler(finalValue);
          }
        } else if (matcher.pattern === finalValue) {
          return matcher.handler(finalValue);
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
