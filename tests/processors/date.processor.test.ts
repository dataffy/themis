import { faker } from "@faker-js/faker";
import { DateFieldProcessor } from "../../src/processors";
import { parse } from "date-fns";
import { ProcessorValidateError } from "../../src";

describe("DateProcessor", () => {
  describe("toInternalValue method", () => {
    const currentDate = new Date();

    it.each([
      {
        testName: "throw error when value is a number",
        value: faker.datatype.number(),
        expectedError: true,
        errorMessage: "Not a valid date",
        formats: [],
        expectedResult: undefined,
      },
      {
        testName: "throw error when value is a string but not a date format",
        value: faker.datatype.string(),
        expectedError: true,
        errorMessage: "Date must have ISO 8601 format",
        formats: [],
        expectedResult: undefined,
      },
      {
        testName: "throw error when value is a boolean",
        value: faker.datatype.boolean(),
        expectedError: true,
        errorMessage: "Not a valid date",
        formats: [],
        expectedResult: undefined,
      },
      {
        testName:
          "return the date when value is a iso date string and no formats specified",
        value: currentDate.toISOString(),
        expectedError: false,
        errorMessage: "",
        formats: [],
        expectedResult: currentDate,
      },
      {
        testName:
          "throw error when date is not in iso format and no formats specified",
        value: "03/29/2022",
        expectedError: true,
        errorMessage: "Date must have ISO 8601 format",
        formats: [],
        expectedResult: currentDate,
      },
      {
        testName: "return the date when value is date already",
        value: currentDate,
        expectedError: false,
        errorMessage: "",
        formats: [],
        expectedResult: currentDate,
      },
      {
        testName:
          "throw error when value is a date string and does not follow specified format",
        value: currentDate.toISOString(),
        expectedError: true,
        errorMessage: "Date must have format MM/dd/yyyy",
        formats: ["MM/dd/yyyy"],
        expectedResult: currentDate,
      },
      {
        testName:
          "return the date when value is a date string and follows only specified format",
        value: "03/29/2022",
        expectedError: false,
        errorMessage: "",
        formats: ["MM/dd/yyyy"],
        expectedResult: parse("03/29/2022", "MM/dd/yyyy", currentDate),
      },
      {
        testName:
          "return the date when value is a date string and follows one of the specified format",
        value: "01-10-2025",
        expectedError: false,
        errorMessage: "",
        formats: ["MM/dd/yyyy", "dd-MM-yyyy"],
        expectedResult: parse("01-10-2025", "dd-MM-yyyy", currentDate),
      },
      {
        testName:
          "throw error when value is a date string  and does not follow specified format",
        value: "01/10/2025",
        expectedError: true,
        errorMessage: "Date must have format MM dd yyyy, dd-MM-yyyy",
        formats: ["MM dd yyyy", "dd-MM-yyyy"],
        expectedResult: new Date(2025, 10, 1),
      },
    ])(
      "Should $testName",
      ({ value, expectedError, errorMessage, formats, expectedResult }) => {
        jest.useFakeTimers({ now: new Date() });

        const processor = new DateFieldProcessor({ formats });

        if (expectedError) {
          expect(() => processor.toInternalValue(value as string)).toThrowError(
            new ProcessorValidateError([errorMessage])
          );
        } else {
          expect(processor.toInternalValue(value as string)).toEqual(
            expectedResult
          );
        }

        jest.useRealTimers();
      }
    );
  });
});
