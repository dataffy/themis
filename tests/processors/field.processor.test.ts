import { FieldConfig, FieldProcessor } from "@app/processors";
import { faker } from "@faker-js/faker";
import { Validator } from "@app/validators/validator";
import { ValidateError } from "@app/errors";

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
        class DummyFieldProcessor extends FieldProcessor<
          FieldConfig,
          string,
          string
        > {
          initialiseValidators(): void {}

          toInternalValue(data: string): string {
            return data;
          }
        }

        const processor = new DummyFieldProcessor(config);

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
        valueFn: (value: string | number) => "Another string",
        value: "String",
      },
      {
        name: "string from number",
        valueFn: (value: string | number) => value.toString(),
        value: faker.datatype.number(),
      },
    ])(
      "Should use internally the result when toInternalValue returns: $name",
      ({ valueFn, value }) => {
        class DummyFieldProcessor extends FieldProcessor<
          FieldConfig,
          string | number,
          string
        > {
          initialiseValidators(): void {}

          toInternalValue(data: string | number): string {
            return valueFn(data);
          }
        }

        const expectedResult = valueFn(value);
        const processor = new DummyFieldProcessor({});

        const validationResult = processor.validate(value);

        expect(validationResult).toEqual(expectedResult);
      }
    );

    it.each([
      {
        testName: "not throw error when validation passed successfully",
        expectValidationError: "Validation error",
      },
      {
        testName: "throw error when validation passed successfully",
        expectValidationError: false,
      },
    ])("Should", ({ expectValidationError }) => {
      class DummyValidator extends Validator<string> {
        constructor() {
          super();
        }

        validate(value: string): void {}
      }

      class DummyFieldProcessor extends FieldProcessor<
        FieldConfig,
        string,
        string
      > {
        initialiseValidators(): void {
          this.validators.push(new DummyValidator());
        }

        toInternalValue(data: string): string {
          return data;
        }
      }

      const validateSpy = jest
        .spyOn(DummyValidator.prototype, "validate")
        .mockImplementationOnce(() => {
          if (expectValidationError) {
            throw new ValidateError(expectValidationError as string);
          }
        });
      const processor = new DummyFieldProcessor({});
      const value = faker.datatype.string();

      if (expectValidationError) {
        expect(() => processor.validate(value)).toThrowError(
          expectValidationError as string
        );
      } else {
        const validationResult = processor.validate(value);
        expect(validationResult).toEqual(value);
      }

      expect(validateSpy).toBeCalledTimes(1);
      expect(validateSpy).toBeCalledWith(value);
    });
  });
});
