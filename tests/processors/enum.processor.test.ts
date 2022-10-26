import { faker } from "@faker-js/faker";
import { ProcessorValidateError } from "../../src";
import { EnumFieldProcessor } from "../../src/processors";
import { EnumMock } from "../fields/mock/enum.mock";

describe("EnumFieldProcessor", () => {
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
        expectedError: true,
      },
      {
        testName: "return string value when value part of enum",
        value: EnumMock.a,
        expectedError: false,
      },
      {
        testName: "return number value when value part of enum",
        value: EnumMock.b,
        expectedError: false,
      },
    ])("Should $testName", ({ value, expectedError }) => {
      const processor = new EnumFieldProcessor({ enum: EnumMock });

      if (expectedError) {
        expect(() => processor.toInternalValue(value as string)).toThrowError(
          new ProcessorValidateError(["Not a valid string"])
        );
      } else {
        expect(processor.toInternalValue(value as string)).toEqual(value);
      }
    });
  });
});
