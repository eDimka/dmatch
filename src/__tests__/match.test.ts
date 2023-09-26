import { match } from '../match';

describe('match function', () => {
  describe('simple value matching', () => {
    it('should match simple values', () => {
      const result = match<string, string>('hello')
        .with('hello', () => 'world')
        .execute();

      expect(result).toEqual('world');
    });

    it('should fall back to default if no match found', () => {
      const result = match<string, string>('hello')
        .with('hi', () => 'world')
        .default(() => 'default')
        .execute();

      expect(result).toEqual('default');
    });

    it('should throw an error if no match found and no default provided', () => {
      expect(() => {
        match<string, string>('hello')
          .with('hi', () => 'world')
          .execute();
      }).toThrowError('No match found and no default provided.');
    });
  });

  describe('function-based matching', () => {
    it('should support function patterns', () => {
      const result = match<number, string>(5)
        .with(
          (val) => val > 3,
          () => 'greater than three',
        )
        .execute();

      expect(result).toEqual('greater than three');
    });

    it('should support mixing simple and function patterns', () => {
      const result = match<number, string>(2)
        .with(1, () => 'one')
        .with(
          (val) => val > 1,
          () => 'greater than one',
        )
        .execute();

      expect(result).toEqual('greater than one');
    });
  });

  describe('matcher composition', () => {
    it('should support matcher composition', () => {
      const composedMatcher = match<number, string>()
        .with(1, () => 'one')
        .with(
          (val) => val > 1,
          () => 'greater than one',
        );

      expect(composedMatcher.execute(1)).toEqual('one');
      expect(composedMatcher.execute(3)).toEqual('greater than one');
    });
  });

  describe('match with lock functionality', () => {
    it('should lock and match with primitives', () => {
      const lockedMatcher = match<number, string>()
        .with(1, () => 'one')
        .finalize();

      expect(lockedMatcher(1)).toEqual('one');
      expect(() => lockedMatcher(2)).toThrowError(
        'No match found and no default provided.',
      );
    });

    it('should lock and handle dynamic checks', () => {
      const lockedMatcher = match<number, string>()
        .with(
          (val) => val > 1,
          () => 'greater than one',
        )
        .finalize();

      expect(lockedMatcher(3)).toEqual('greater than one');
      expect(() => lockedMatcher(1)).toThrowError(
        'No match found and no default provided.',
      );
    });

    it('should lock and go through multiple matchers', () => {
      const lockedMatcher = match<number, string>()
        .with(1, () => 'one')
        .with(
          (val) => val > 1,
          () => 'greater than one',
        )
        .finalize();

      expect(lockedMatcher(1)).toEqual('one');
      expect(lockedMatcher(2)).toEqual('greater than one');
    });

    it('should lock and use default handler', () => {
      const lockedMatcher = match<number, string>()
        .with(1, () => 'one')
        .default(() => 'none matched')
        .finalize();

      expect(lockedMatcher(5)).toEqual('none matched');
      expect(lockedMatcher(1)).toEqual('one');
    });

    it('should lock and handle complex return types', () => {
      enum Days {
        Monday,
        Tuesday,
        Wednesday,
      }

      const lockedMatcher = match<number, Days>()
        .with(1, () => Days.Monday)
        .finalize();

      expect(lockedMatcher(1)).toEqual(Days.Monday);
      expect(() => lockedMatcher(2)).toThrowError(
        'No match found and no default provided.',
      );
    });

    it('should lock and return functions', () => {
      const lockedMatcher = match<number, () => string>()
        .with(1, () => () => 'Function for one')
        .finalize();
      expect(lockedMatcher(1)()).toEqual('Function for one');
      expect(() => lockedMatcher(3)).toThrowError(
        'No match found and no default provided.',
      );
    });

    describe('array patterns', () => {
      it('should match multiple patterns using array', () => {
        const result = match<number, string>()
          .with([1, 2], () => 'one or two')
          .execute(2);

        expect(result).toEqual('one or two');
      });

      it('should match the first pattern in the array', () => {
        const result = match<number, string>()
          .with([1, 2], () => 'one or two')
          .with(2, () => 'two')
          .execute(2);

        expect(result).toEqual('one or two');
      });
    });

    describe('object pattern matching', () => {
      type User = { name: string; age: number };
      it('should match using object patterns', () => {
        const user: User = { name: 'John', age: 25 };

        const result = match<User, string>()
          .with({ name: 'John' }, () => 'name is John')
          .execute(user);

        expect(result).toEqual('name is John');
      });

      it('should not match incorrect object patterns', () => {
        const user: User = { name: 'John', age: 25 };

        expect(() => {
          match<User, string>()
            .with({ name: 'Doe' }, () => 'name is Doe')
            .execute(user);
        }).toThrowError('No match found and no default provided.');
      });
    });

    describe('dynamic input', () => {
      it('should match using input given during execute', () => {
        const matcher = match<number, string>().with(1, () => 'one');

        expect(matcher.execute(1)).toEqual('one');
      });

      it('should prioritize input from execute over initial input', () => {
        const matcher = match<number, string>(1)
          .with(1, () => 'one')
          .with(2, () => 'two');

        expect(matcher.execute(2)).toEqual('two');
      });
    });

    describe('edge cases', () => {
      it('should handle null', () => {
        const result = match<null, string>(null)
          .with(null, 'null value')
          .execute();

        expect(result).toEqual('null value');
      });

      it('should handle undefined', () => {
        const result = match<number | undefined, string>()
          .with(undefined, 'undefined value')
          .default(() => 'default')
          .execute(undefined);

        expect(result).toEqual('undefined value');
      });
    });
  });
});
