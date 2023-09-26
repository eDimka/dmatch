import { match, withinRange } from 'dmatch';

const pricingModel = match<number, string>()
  .with(withinRange(0, 50), '$5')
  .with(withinRange(51, 100), '$10')
  .with(
    (val: number) => val > 100,
    (val: number) => `Custom price for ${val}`,
  )
  .finalize();

console.log(pricingModel(25)); // Outputs: '$5'
console.log(pricingModel(75)); // Outputs: '$10'
console.log(pricingModel(125)); // Outputs: 'Custom price for 125'
