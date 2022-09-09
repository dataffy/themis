import { FieldConfig, FieldProcessor } from "@app/processors";
import { faker } from "@faker-js/faker";
import { ProcessorValidateError, ValidateError } from "@app/errors";
import { ProcessorMock } from "@tests/processors/mocks/processor.mock";
import { ValidatorMock } from "@tests/validators/mocks/validator.mock";
import { MinLengthValidator } from "@app/validators/string";
import { Validator } from "@app/validators/validator";

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
      ({ config, value, expectedError, expectedResult }) => {
        const processor = new ProcessorMock(config);

        if (expectedError) {
          expect(() => processor.validate(value)).toThrowError(expectedError);
        } else {
          const result = processor.validate(value);
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
      ({ valueFn, value }) => {
        const expectedResult = valueFn(value);
        const processor = new ProcessorMock({});

        jest
          .spyOn(processor, "toInternalValue")
          .mockImplementationOnce(() => valueFn(value));

        const validationResult = processor.validate(value);

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
    ])("Should $testName", ({ validators, expectValidationError }) => {
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
          processor.validate(value);
          expect(true).toEqual(false);
        } catch (error) {
          expect(error).toBeInstanceOf(ProcessorValidateError);
          expect((error as ProcessorValidateError).messages.length).toEqual(1);
          expect((error as ProcessorValidateError).messages[0]).toEqual(
            expectValidationError
          );
        }
      } else {
        const validationResult = processor.validate(value);
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
