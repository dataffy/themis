import {
  ArrayFieldProcessor,
  StringFieldProcessor,
  ProcessorValidateError,
} from "../../src";
import { SimpleSchema } from "../schemas/mocks/schema.mock";

describe("ArrayProcessor", () => {
  describe("toInternalValue method", () => {
    it.each([
      {
        testName:
          "return processed data when child is field processor and values are valid",
        expectedError: undefined,
        values: ["first", "second"],
        expectedValues: ["first", "second"],
        child: StringFieldProcessor,
      },
      {
        testName:
          "throw processor error when child is field processor and one of the values is invalid",
        expectedError: {
          "1": ["Not a valid string"],
        },
        values: ["first", 1],
        child: StringFieldProcessor,
      },
      {
        testName: "throw processor error when values type is not array",
        expectedError: ["Not a valid array"],
        values: 1,
        child: StringFieldProcessor,
      },
      {
        testName:
          "throw error when child is field processor and error is not ProcessorValidateError",
        unexpectedError: "Unexpected Error",
        child: StringFieldProcessor,
        values: ["value"],
      },
      {
        testName:
          "return processed data when child is schema and values are valid",
        expectedError: undefined,
        values: [
          { firstName: "Schema", age: 10, active: "TRUE" },
          { firstName: "Nested Schema", age: 1, active: 0 },
        ],
        expectedValues: [
          { firstName: "Schema", age: 10, active: true },
          { firstName: "Nested Schema", age: 1, active: false },
        ],
        child: SimpleSchema,
      },
      {
        testName:
          "throw processor error when child is schema and one of the values is invalid",
        expectedError: {
          "0": {
            active: ["Not a valid boolean"],
          },
          "1": {
            firstName: ["Not a valid string"],
            age: ["Value is required"],
          },
        },
        values: [
          { firstName: "Schema", age: 10, active: 100 },
          { firstName: 1, active: 0 },
        ],
        child: SimpleSchema,
      },
      {
        testName:
          "throw error when child is field schema and error is not ValidationError",
        unexpectedError: "Unexpected Error",
        child: SimpleSchema,
        values: [{ firstName: "value" }],
      },
    ])(
      "Should $testName",
      async ({
        child,
        values,
        expectedValues,
        expectedError,
        unexpectedError,
      }) => {
        const processor = new ArrayFieldProcessor({ child });

        if (expectedError) {
          try {
            await processor.toInternalValue(values as unknown[]);
            expect(true).toEqual(false);
          } catch (error) {
            expect(error).toBeInstanceOf(ProcessorValidateError);
            expect((error as ProcessorValidateError).messages).toEqual(
              expectedError
            );
          }
        } else if (unexpectedError) {
          jest.spyOn(child.prototype, "validate").mockImplementationOnce(() => {
            throw new Error(unexpectedError);
          });
          await expect(() =>
            processor.toInternalValue(values as unknown[])
          ).rejects.toThrowError(unexpectedError);
        } else {
          const processedValues = await processor.toInternalValue(
            values as unknown[]
          );
          expect(processedValues).toEqual(expectedValues);
        }
      }
    );
  });
});
