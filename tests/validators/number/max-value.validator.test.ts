import {MaxValueValidator} from "@app/validators";
import {faker} from "@faker-js/faker";
import {ValidateError} from "@app/errors";

describe("Test MaxValueValidator", () => {
  describe('Test validate method', () => {
    it('Should throw error when value is higher than max value', () => {
      const maxValue = faker.datatype.number();
      const validator = new MaxValueValidator(maxValue);
      const value = faker.datatype.number({min: maxValue + 1});

      expect(() => validator.validate(value)).toThrowError(ValidateError);
    })

    it('Should not throw error when value is smaller than max value', () => {
      const maxValue = faker.datatype.number();
      const validator = new MaxValueValidator(maxValue);
      const value = faker.datatype.number({max: maxValue + 1});

      expect(() => validator.validate(value)).not.toThrowError(ValidateError);
    })

    it('Should not throw error when value is equal to max value', () => {
      const maxValue = faker.datatype.number();
      const validator = new MaxValueValidator(maxValue);

      expect(() => validator.validate(maxValue)).not.toThrowError(ValidateError);
    })
  })
})