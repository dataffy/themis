import { Validator } from "@app/validators/validator";
import { ValidateError } from "@app/errors";

export class EmailValidator extends Validator<string> {
  emailRegex = new RegExp(
    "^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\\.[a-zA-Z](-?[a-zA-Z0-9])*)+$"
  );
  constructor(protected readonly errorMessage?: string) {
    super(errorMessage);
  }

  validate(value: string): void {
    if (!this.emailRegex.test(value)) {
      throw new ValidateError("email is not of valid format");
    }
  }
}
