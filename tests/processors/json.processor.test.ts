import { faker } from "@faker-js/faker";
import { Json, JsonFieldProcessor } from "../../src";

describe("JsonProcessor", () => {
  describe("toInternalValue method", () => {
    it.each([
      {
        testName: "throw error when value is a string",
        value: faker.datatype.string(),
        parsedValue: null,
        expectedError: true,
        parsingNeeded: false,
      },
      {
        testName: "throw error when value is a boolean",
        value: faker.datatype.boolean(),
        expectedError: true,
        parsingNeeded: false,
      },
      {
        testName: "throw error when value is infinity",
        value: Infinity,
        expectedError: true,
        parsingNeeded: false,
      },
      {
        testName: "throw error when value is a float number",
        value: faker.datatype.number({ precision: 0.1 }) + 0.01,
        expectedError: true,
        parsingNeeded: false,
      },
      {
        testName: "throw error when value is a big int",
        value: faker.datatype.bigInt(),
        expectedError: true,
        parsingNeeded: false,
      },
      {
        testName: "throw error when value is a date time",
        value: faker.datatype.datetime(),
        expectedError: true,
        parsingNeeded: false,
      },
      {
        testName: "throw error when value is a integer number",
        value: faker.datatype.number(),
        expectedError: true,
        parsingNeeded: false,
      },
      {
        testName: "return the json object when value is json",
        value: faker.datatype.json(),
        expectedError: false,
        parsingNeeded: true,
      },
      {
        testName:
          "return the json object when value is valid json in string format",
        value: JSON.parse(faker.datatype.json()),
        expectedError: false,
        parsingNeeded: false,
      },
    ])("Should $testName", ({ value, expectedError, parsingNeeded }) => {
      const processor = new JsonFieldProcessor({});

      if (expectedError) {
        expect(() =>
          processor.toInternalValue(value as unknown as Json)
        ).toThrowError(processor.errorMessage);
      } else if (parsingNeeded) {
        expect(processor.toInternalValue(value as unknown as Json)).toEqual(
          JSON.parse(value)
        );
      } else {
        expect(processor.toInternalValue(value as unknown as Json)).toEqual(
          value
        );
      }
    });
  });
});
