import { faker } from "@faker-js/faker";
import { StringFieldProcessor } from "../../src/processors";
import { MaxLengthValidator, MinLengthValidator } from "../../src/validators";
import { Validator } from "../../src/validators";

describe("StringProcessor", () => {
  describe("toInternalValue method", () => {
    it.each([
      {
        testName: "throw error when value is a number",
        value: faker.datatype.number(),
        expectedError: true,
      },
      {
        testName: "throw error when value is a boolean",
        value: faker.datatype.boolean(),
        expectedError: true,
      },
      {
        testName: "return the string when value is a string",
        value: faker.datatype.string(),
        expectedError: false,
      },
    ])("Should $testName", ({ value, expectedError }) => {
      const processor = new StringFieldProcessor({});

      if (expectedError) {
        expect(() => processor.toInternalValue(value as string)).toThrowError(
          "Not a valid string"
        );
      } else {
        expect(processor.toInternalValue(value as string)).toEqual(value);
      }
    });
  });

  describe("initialiseValidators method", () => {
    const maxLength = faker.datatype.number();
    const minLength = faker.datatype.number();

    it.each([
      {
        testName: "not add any validators when config is empty",
        config: {},
        expectedValidators: [],
      },
      {
        testName: "add max length validator when config has maxLength value",
        config: { maxLength },
        expectedValidators: [new MaxLengthValidator(maxLength)],
      },
      {
        testName: "add min length validator when config has minLength value",
        config: { minLength },
        expectedValidators: [new MinLengthValidator(minLength)],
      },
      {
        testName:
          "add min length and max length validators when config has minLength and maxLength values",
        config: { minLength, maxLength },
        expectedValidators: [
          new MaxLengthValidator(maxLength),
          new MinLengthValidator(minLength),
        ],
      },
    ])("Should $testName", ({ config, expectedValidators }) => {
      const processor = new StringFieldProcessor(config);

      expect(
        (
          processor as StringFieldProcessor & {
            validators: Validator<unknown>[];
          }
        ).validators
      ).toMatchObject(expectedValidators);
    });
  });
});
