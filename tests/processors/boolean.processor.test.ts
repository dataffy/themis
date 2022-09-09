import { faker } from "@faker-js/faker";
import { BooleanFieldProcessor } from "../../src/processors";

describe("BooleanProcessor", () => {
  describe("toInternalValue method", () => {
    it.each([
      {
        testName: "throw error when value is a random string",
        value: faker.datatype.string(10),
        expectedError: true,
      },
      {
        testName: "throw error when value is a number different than 0 and 1",
        value: faker.datatype.number({ min: 2 }),
        expectedError: true,
      },
      {
        testName: "throw error when value is a float number",
        value: faker.datatype.number({ precision: 0.1 }),
        expectedError: true,
      },
      {
        testName: "return false when value is 0",
        value: 0,
        expectedError: false,
        expectedValue: false,
      },
      {
        testName: "return false when value is FALSE",
        value: "FALSE",
        expectedError: false,
        expectedValue: false,
      },
      {
        testName: "return false when value is false",
        value: "false",
        expectedError: false,
        expectedValue: false,
      },
      {
        testName: "return false when value is false",
        value: false,
        expectedError: false,
        expectedValue: false,
      },
      {
        testName: "return false when value is 0",
        value: "0",
        expectedError: false,
        expectedValue: false,
      },
      {
        testName: "return true when value is 1",
        value: 1,
        expectedError: false,
        expectedValue: true,
      },
      {
        testName: "return false when value is TRUE",
        value: "TRUE",
        expectedError: false,
        expectedValue: true,
      },
      {
        testName: "return false when value is true",
        value: "true",
        expectedError: false,
        expectedValue: true,
      },
      {
        testName: "return false when value is true",
        value: true,
        expectedError: false,
        expectedValue: true,
      },
      {
        testName: "return false when value is 1",
        value: "1",
        expectedError: false,
        expectedValue: true,
      },
    ])("Should $testName", ({ value, expectedError, expectedValue }) => {
      const processor = new BooleanFieldProcessor({});

      if (expectedError) {
        expect(() => processor.toInternalValue(value)).toThrowError(
          "Not a valid boolean"
        );
      } else {
        expect(processor.toInternalValue(value as number)).toEqual(
          expectedValue
        );
      }
    });
  });
});
