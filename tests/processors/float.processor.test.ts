import { faker } from "@faker-js/faker";
import { FloatFieldProcessor } from "../../src/processors";
import { MaxValueValidator, MinValueValidator } from "../../src/validators";
import { Validator } from "../../src/validators";
import { ProcessorValidateError } from "../../src";

describe("FloatProcessor", () => {
  describe("toInternalValue method", () => {
    it.each([
      {
        testName: "throw error when value is a string",
        value: faker.datatype.string(),
        expectedError: true,
      },
      {
        testName: "throw error when value is a boolean",
        value: faker.datatype.boolean(),
        expectedError: true,
      },
      {
        testName: "return the number when value is an integer number",
        value: faker.datatype.number({ precision: 1 }),
        expectedError: false,
      },
      {
        testName: "return infinity when value is infinity",
        value: Infinity,
        expectedError: false,
      },
      {
        testName: "return the float number when the value is float",
        value: faker.datatype.number({ precision: 0.1 }),
        expectedError: false,
      },
      {
        testName: "return the integer number when value is string",
        value: `${faker.datatype.number()}`,
        expectedError: false,
      },
      {
        testName: "return the float number when value is string",
        value: `${faker.datatype.number({ precision: 0.01 })}`,
        expectedError: false,
      },
    ])("Should $testName", ({ value, expectedError }) => {
      const processor = new FloatFieldProcessor({});

      if (expectedError) {
        expect(() => processor.toInternalValue(value as number)).toThrowError(
          new ProcessorValidateError([processor.errorMessage])
        );
      } else {
        expect(processor.toInternalValue(value as number)).toEqual(+value);
      }
    });
  });

  describe("initialiseValidators method", () => {
    const maxValue = faker.datatype.number();
    const minValue = faker.datatype.number();

    it.each([
      {
        testName: "not add any validators when config is empty",
        config: {},
        expectedValidators: [],
      },
      {
        testName: "add max value validator when config has maxValue value",
        config: { maxValue },
        expectedValidators: [new MaxValueValidator(maxValue)],
      },
      {
        testName: "add min value validator when config has minValue value",
        config: { minValue },
        expectedValidators: [new MinValueValidator(minValue)],
      },
      {
        testName:
          "add min value and max value validators when config has minValue and maxValue values",
        config: { minValue, maxValue },
        expectedValidators: [
          new MinValueValidator(minValue),
          new MaxValueValidator(maxValue),
        ],
      },
    ])("Should $testName", ({ config, expectedValidators }) => {
      const processor = new FloatFieldProcessor(config);

      expect(
        (
          processor as FloatFieldProcessor & {
            validators: Validator<unknown>[];
          }
        ).validators
      ).toMatchObject(expectedValidators);
    });
  });
});
