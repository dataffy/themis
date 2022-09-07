import { faker } from "@faker-js/faker";
import { ValidateError } from "@app/errors";
import { EmailValidator } from "@app/validators/string/email.validator";

describe("EmailValidator", () => {
  describe("validate method", function () {
    it("Should throw error when value is not valid email", () => {
      const value = `.${faker.internet.email()}`;
      const validator = new EmailValidator();

      expect(() => validator.validate(value)).toThrowError(ValidateError);
    });

    it("Should not throw error when value is not valid email", () => {
      const value = faker.internet.email();
      const validator = new EmailValidator();

      expect(() => validator.validate(value)).not.toThrowError(ValidateError);
    });
  });
});
