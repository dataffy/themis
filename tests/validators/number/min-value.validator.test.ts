import { MinValueValidator } from "@app/validators/number";
import { faker } from "@faker-js/faker";
import { ValidateError } from "@app/errors";

describe("MinValueValidator", () => {
  describe("validate method", () => {
    it("Should throw error when value is smaller than min value", () => {
      const minValue = faker.datatype.number();
      const validator = new MinValueValidator(minValue);
      const value = faker.datatype.number({ max: minValue - 1 });

      expect(() => validator.validate(value)).toThrowError(ValidateError);
    });

    it("Should not throw error when value is higher than min value", () => {
      const minValue = faker.datatype.number();
      const validator = new MinValueValidator(minValue);
      const value = faker.datatype.number({ min: minValue + 1 });

      expect(() => validator.validate(value)).not.toThrowError(ValidateError);
    });

    it("Should not throw error when value is equal to max value", () => {
      const minValue = faker.datatype.number();
      const validator = new MinValueValidator(minValue);

      expect(() => validator.validate(minValue)).not.toThrowError(
        ValidateError
      );
    });
  });
});
