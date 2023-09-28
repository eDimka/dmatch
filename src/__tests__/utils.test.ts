import {
    eq,
    gt,
    gte,
    isFunction,
    isIn,
    isPatternMatch,
    lt,
    lte,
    neq,
    notIn,
    withinRange,
} from '../utils';

describe('Comparators Suite', () => {
    describe('gt', () => {
        it('should return true if value is greater than threshold', () => {
            expect(gt(5)(6)).toBe(true);
        });

        it('should return false if value is not greater than threshold', () => {
            expect(gt(5)(5)).toBe(false);
        });
    });

    describe('gte', () => {
        it('should return true if value is greater than or equal to threshold', () => {
            expect(gte(5)(5)).toBe(true);
            expect(gte(5)(6)).toBe(true);
        });

        it('should return false if value is less than threshold', () => {
            expect(gte(5)(4)).toBe(false);
        });
    });

    describe('lt', () => {
        it('should return true if value is less than threshold', () => {
            expect(lt(5)(4)).toBe(true);
        });

        it('should return false if value is not less than threshold', () => {
            expect(lt(5)(5)).toBe(false);
        });
    });

    describe('lte', () => {
        it('should return true if value is less than or equal to threshold', () => {
            expect(lte(5)(5)).toBe(true);
            expect(lte(5)(4)).toBe(true);
        });

        it('should return false if value is greater than threshold', () => {
            expect(lte(5)(6)).toBe(false);
        });
    });

    describe('withinRange', () => {
        it('should return true if value is within range', () => {
            expect(withinRange(5, 7)(6)).toBe(true);
            expect(withinRange(5, 7)(5)).toBe(true);
            expect(withinRange(5, 7)(7)).toBe(true);
        });

        it('should return false if value is outside range', () => {
            expect(withinRange(5, 7)(8)).toBe(false);
            expect(withinRange(5, 7)(4)).toBe(false);
        });
    });

    describe('eq', () => {
        it('should return true if value is equal to comparedValue', () => {
            expect(eq(5)(5)).toBe(true);
        });

        it('should return false if value is not equal to comparedValue', () => {
            expect(eq(5)(6)).toBe(false);
        });
    });

    describe('neq', () => {
        it('should return true if value is not equal to comparedValue', () => {
            expect(neq(5)(6)).toBe(true);
        });

        it('should return false if value is equal to comparedValue', () => {
            expect(neq(5)(5)).toBe(false);
        });
    });

    describe('isIn', () => {
        it('should return true if value is in list', () => {
            expect(isIn([1, 2, 3, 4, 5])(5)).toBe(true);
        });

        it('should return false if value is not in list', () => {
            expect(isIn([1, 2, 3, 4, 5])(6)).toBe(false);
        });
    });

    describe('notIn', () => {
        it('should return true if value is not in list', () => {
            expect(notIn([1, 2, 3, 4, 5])(6)).toBe(true);
        });

        it('should return false if value is in list', () => {
            expect(notIn([1, 2, 3, 4, 5])(5)).toBe(false);
        });
    });

    describe('isFunction', () => {
        it('should return true if value is a function', () => {
            const fn = () => {
                return true;
            };
            expect(isFunction(fn)).toBe(true);
        });

        it('should return false if value is not a function', () => {
            const notFn = 5;
            expect(isFunction(notFn)).toBe(false);
        });
    });

    describe('isPatternMatch', () => {
        it('should return true if input matches pattern', () => {
            const input = { a: 1, b: 2, c: 3 };
            const pattern = { a: 1, b: 2 };
            expect(isPatternMatch(input, pattern)).toBe(true);
        });

        it('should return true if input matches pattern using comparator', () => {
            const input = { a: 1, b: 2, c: 3 };
            const pattern = { a: eq(1), c: isIn([3, 4]) } as any;
            expect(isPatternMatch(input, pattern)).toBe(true);
        });

        it('should return false if input does not match pattern', () => {
            const input = { a: 1, b: 2, c: 3 };
            const pattern = { a: 2, b: 2 };
            expect(isPatternMatch(input, pattern)).toBe(false);
        });

        it('should return false if input does not match pattern using comparator', () => {
            const input = { a: 1, b: 2, c: 3 };
            const pattern = { a: eq(2), c: isIn([4, 5]) } as any;
            expect(isPatternMatch(input, pattern)).toBe(false);
        });
    });
});
