import { MaxLengthValidator } from "@app/validators/string";
import { faker } from "@faker-js/faker";
import { ValidateError } from "@app/errors";

describe("MaxLengthValidator", () => {
  describe("validate method", () => {
    it("Should throw error when value has a longer length than max value", () => {
      const maxLength = faker.datatype.number();
      const validator = new MaxLengthValidator(maxLength);
      const value = faker.datatype.string(
        maxLength + faker.datatype.number({ min: 1 })
      );

      expect(() => validator.validate(value)).toThrowError(ValidateError);
    });

    it("Should not throw error when value has a smaller length than max value", () => {
      const maxLength = faker.datatype.number();
      const validator = new MaxLengthValidator(maxLength);
      const value = faker.datatype.string(
        maxLength - faker.datatype.number({ min: 1 })
      );

      expect(() => validator.validate(value)).not.toThrowError(ValidateError);
    });

    it("Should not throw error when value has the same length as max value", () => {
      const maxLength = faker.datatype.number();
      const validator = new MaxLengthValidator(maxLength);
      const value = faker.datatype.string(maxLength);

      expect(() => validator.validate(value)).not.toThrowError(ValidateError);
    });
  });
});
