import { Validator } from "../validator";
import { ValidateError } from "../../errors";

export class MaxLengthValidator extends Validator<string> {
  constructor(
    protected readonly maxLength: number,
    protected readonly errorMessage?: string
  ) {
    super(errorMessage);
  }

  validate(value: string): void {
    if (value.length > this.maxLength) {
      throw new ValidateError(`max length allowed is ${this.maxLength}`);
    }
  }
}
