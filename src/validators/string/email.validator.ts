import { Validator } from "../validator";
import { ValidateError } from "../../errors";

export class EmailValidator extends Validator<string> {
  emailRegex = new RegExp(
    "^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\\.[a-zA-Z](-?[a-zA-Z0-9])*)+$"
  );
  constructor(protected readonly errorMessage?: string) {
    super(errorMessage);
  }

  validate(value: string): void {
    if (!this.emailRegex.test(value)) {
      throw new ValidateError("Email is not of valid format");
    }
  }
}
