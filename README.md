# dmatch - Elegant Pattern Matching for JS/TS

Introducing `dmatch`, an elegant and tiny utility library designed for intuitive pattern matching in JavaScript and TypeScript.

**Below 2KB for the core functionality without compression.**
**0 runtime dependencies**
![image](https://github.com/eDimka/dmatch/assets/5039029/1d989a90-0302-4023-bb27-90bf0a341934)

## Table of Contents

- [dmatch - Elegant Pattern Matching for JS/TS](#dmatch---elegant-pattern-matching-for-jsts)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [npm:](#npm)
  - [Usage](#usage)
    - [On-the-Fly Matching](#on-the-fly-matching)
    - [Reusable Matching](#reusable-matching)
  - [Advanced Use Cases](#advanced-use-cases)
    - [Dynamic Pricing](#dynamic-pricing)
    - [Custom Logic](#custom-logic)
  - [Behaviors and Edge Cases](#behaviors-and-edge-cases)
    - [No Match and No Default](#no-match-and-no-default)
  - [License](#license)

## Installation

### npm:

```shell
npm install dmatch
```

## Usage

`dmatch` is versatile, allowing you to either match patterns on-the-fly or preconfigure matchers for reusable scenarios.

### On-the-Fly Matching

Directly create and execute a matcher, returning either functions or direct values:

```javascript
import { match, eq } from 'dmatch';

// Using a function
const resultFunction = match<string, string>('apple')
  .with(eq('apple'), () => 'It is an apple!')
  .execute();

console.log(resultFunction); // Outputs: 'It is an apple!'

// Using a direct value
const resultValue = match<string, string>('orange')
  .with(eq('orange'), 'It is an orange!')
  .execute();

console.log(resultValue); // Outputs: 'It is an orange!'
```

### Reusable Matching

Preconfigure matchers for repetitive scenarios:

```javascript
const fruitMatcher = match<string, string>()
  .with(eq('apple'), 'It is an apple!')
  .with(eq('orange'), 'It is an orange!')
  .finalize();

console.log(fruitMatcher('apple'));  // Outputs: 'It is an apple!'
console.log(fruitMatcher('orange')); // Outputs: 'It is an orange!'
```

## Advanced Use Cases

With the flexibility `dmatch` offers, you can cater to a variety of complex scenarios:

### Dynamic Pricing

Construct a dynamic pricing model based on various conditions:

```javascript
import { match, withinRange } from 'dmatch';

const pricingModel = match<number, string>()
  .with(withinRange(0, 50), '$5')
  .with(withinRange(51, 100), '$10')
  .with(
    (val: number) => val > 100,
    (val: number) => `Custom price for ${val}`,
  )
  .finalize();

console.log(pricingModel(25));  // Outputs: '$5'
console.log(pricingModel(75));  // Outputs: '$10'
console.log(pricingModel(125)); // Outputs: 'Custom price for 125'
```

### Custom Logic

Integrate complex logic seamlessly:

```javascript
const customLogic = match<number, string>()
  .with(val => val < 0, 'Negative')
  .with(val => val === 0, 'Neutral')
  .with(val => val > 0, 'Positive')
  .finalize();

console.log(customLogic(-5)); // Outputs: 'Negative'
console.log(customLogic(0));  // Outputs: 'Neutral'
console.log(customLogic(5));  // Outputs: 'Positive'
```

## Behaviors and Edge Cases

### No Match and No Default

`dmatch` has a strict policy to ensure that patterns are matched correctly. If no matching pattern is found, and you haven't provided a default handler, `dmatch` will throw an error:

```javascript
import { match } from 'dmatch';

const result = match<string, string>('hello')
  .with('hi', () => 'world')
  .execute();

// Throws an error: 'No match found and no default provided.'
```

## License

`dmatch` is [MIT licensed](./LICENSE).

Thank you for using and supporting `dmatch`! For issues or suggestions, please open a GitHub issue.
