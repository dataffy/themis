import { FieldConfig, FieldProcessor } from "../../src/processors";
import { faker } from "@faker-js/faker";
import { ProcessorValidateError, ValidateError } from "../../src/errors";
import { ProcessorMock } from "./mocks/processor.mock";
import { ValidatorMock } from "../validators/mocks/validator.mock";
import { MinLengthValidator } from "../../src/validators";
import { Validator } from "../../src/validators";

describe("FieldProcessor", () => {
  describe("validate method", () => {
    it.each([
      {
        testName:
          "throw required error when default config and value is undefined",
        config: {},
        value: undefined,
        expectedError: "Value is required",
        expectedResult: undefined,
      },
      {
        testName: "throw nullable error when nullable false and value is null",
        config: { nullable: false },
        value: null,
        expectedError: "Value cannot be null",
        expectedResult: undefined,
      },
      {
        testName: "return undefined when required false and value is undefined",
        config: { required: false },
        value: undefined,
        expectedError: undefined,
        expectedResult: undefined,
      },
      {
        testName: "return null when nullable true and value is null",
        config: { nullable: true },
        value: null,
        expectedError: undefined,
        expectedResult: null,
      },
    ])(
      "Should check empty values and $testName",
      async ({ config, value, expectedError, expectedResult }) => {
        const processor = new ProcessorMock(config);

        if (expectedError) {
          await expect(processor.validate(value)).rejects.toThrowError(
            new ProcessorValidateError([expectedError])
          );
        } else {
          const result = await processor.validate(value);
          expect(result).toEqual(expectedResult);
        }
      }
    );

    it.each([
      {
        name: "another string",
        valueFn: (): string => "Another string",
        value: "String",
      },
      {
        name: "string from number",
        valueFn: (value: string | number): string => value.toString(),
        value: faker.datatype.number(),
      },
    ])(
      "Should use internally the result when toInternalValue returns: $name",
      async ({ valueFn, value }) => {
        const expectedResult = valueFn(value);
        const processor = new ProcessorMock({});

        jest
          .spyOn(processor, "toInternalValue")
          .mockImplementationOnce(() => valueFn(value));

        const validationResult = await processor.validate(value);

        expect(validationResult).toEqual(expectedResult);
      }
    );

    it.each([
      {
        testName: "throw error when validation passed successfully",
        validators: [],
        expectValidationError: "Validation error",
      },
      {
        testName: "not throw error when validation passed successfully",
        validators: [],
        expectValidationError: false,
      },
      {
        testName: "not throw error when validation passed successfully",
        validators: [new MinLengthValidator(3)],
        expectValidationError: false,
      },
    ])("Should $testName", async ({ validators, expectValidationError }) => {
      const validator = new ValidatorMock();
      class DummyFieldProcessor extends FieldProcessor<
        FieldConfig,
        string,
        string
      > {
        initialiseValidators(): void {
          this.validators.push(validator);
        }

        toInternalValue(data: string): string {
          return data;
        }
      }

      const validateSpy = jest
        .spyOn(validator, "validate")
        .mockImplementationOnce(() => {
          if (expectValidationError) {
            throw new ValidateError(expectValidationError as string);
          }
        });
      const processor = new DummyFieldProcessor({ validators });
      const value = faker.datatype.string();

      if (expectValidationError) {
        try {
          await processor.validate(value);
          expect(true).toEqual(false);
        } catch (error) {
          expect(error).toBeInstanceOf(ProcessorValidateError);
          expect((error as ProcessorValidateError).messages.length).toEqual(1);
          expect(
            ((error as ProcessorValidateError).messages as string[])[0]
          ).toEqual(expectValidationError);
        }
      } else {
        const validationResult = await processor.validate(value);
        expect(validationResult).toEqual(value);
        expect(
          (
            processor as ProcessorMock & {
              validators: Validator<unknown>[];
            }
          ).validators
        ).toMatchObject([...validators, validator]);
      }

      expect(validateSpy).toBeCalledTimes(1);
      expect(validateSpy).toBeCalledWith(value);
    });
  });
});
