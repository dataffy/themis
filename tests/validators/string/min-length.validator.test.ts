import { MinLengthValidator } from "@app/validators/string";
import { faker } from "@faker-js/faker";
import { ValidateError } from "@app/errors";

describe("MinLengthValidator", () => {
  describe("validate method", () => {
    it("Should throw error when value has a smaller length than min value", () => {
      const minLength = faker.datatype.number();
      const validator = new MinLengthValidator(minLength);
      const value = faker.datatype.string(
        minLength - faker.datatype.number({ min: 1 })
      );

      expect(() => validator.validate(value)).toThrowError(ValidateError);
    });

    it("Should not throw error when value has a longer length than min value", () => {
      const minLength = faker.datatype.number();
      const validator = new MinLengthValidator(minLength);
      const value = faker.datatype.string(
        minLength + faker.datatype.number({ min: 1 })
      );

      expect(() => validator.validate(value)).not.toThrowError(ValidateError);
    });

    it("Should not throw error when value has the same length as min value", () => {
      const minLength = faker.datatype.number();
      const validator = new MinLengthValidator(minLength);
      const value = faker.datatype.string(minLength);

      expect(() => validator.validate(value)).not.toThrowError(ValidateError);
    });
  });
});
