export type Comparator<T> = (value: T) => boolean;

export type ComparatorFunction<T> = (value: T) => boolean;

export const gt =
    (threshold: number): Comparator<number> =>
    (value) =>
        value > threshold;

export const gte =
    (threshold: number): Comparator<number> =>
    (value) =>
        value >= threshold;

export const lt =
    (threshold: number): Comparator<number> =>
    (value) =>
        value < threshold;

export const lte =
    (threshold: number): Comparator<number> =>
    (value) =>
        value <= threshold;

export const withinRange =
    (min: number, max: number): Comparator<number> =>
    (value) =>
        value >= min && value <= max;

export const eq =
    <T>(comparedValue: T): Comparator<T> =>
    (value) =>
        value === comparedValue;

export const neq =
    <T>(comparedValue: T): Comparator<T> =>
    (value) =>
        value !== comparedValue;

export const isIn =
    <T>(list: T[]): Comparator<T> =>
    (value) =>
        list.includes(value);

export const notIn =
    <T>(list: T[]): Comparator<T> =>
    (value) =>
        !list.includes(value);

export const isFunction = <T extends (...args: never[]) => unknown>(
    val: unknown,
): val is T => {
    return typeof val === 'function';
};

export const isPatternMatch = <T>(input: T, pattern: Partial<T>): boolean => {
    for (const key in pattern) {
        const inputValue = input[key as keyof T];
        const patternValue = pattern[key as keyof T];
        if (typeof patternValue === 'function') {
            const comparator = patternValue as ComparatorFunction<
                typeof inputValue
            >;
            if (!comparator(inputValue)) {
                return false;
            }
        } else if (inputValue !== patternValue) {
            return false;
        }
    }
    return true;
};
