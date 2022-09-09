import { Validator } from "../validator";
import { ValidateError } from "../../errors";

export class MinLengthValidator extends Validator<string> {
  constructor(
    protected readonly minLength: number,
    protected readonly errorMessage?: string
  ) {
    super(errorMessage);
  }

  validate(value: string): void {
    if (value.length < this.minLength) {
      throw new ValidateError(`min length allowed is ${this.minLength}`);
    }
  }
}
