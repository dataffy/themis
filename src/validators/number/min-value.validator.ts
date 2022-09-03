import { Validator } from "@app/validators/validator";
import { ValidateError } from "@app/errors";

export class MinValueValidator extends Validator<number> {
  constructor(
    protected readonly minValue: number,
    protected readonly errorMessage?: string
  ) {
    super(errorMessage);
  }

  validate(value: number): void {
    if (value < this.minValue) {
      throw new ValidateError(`min length allowed is ${this.minValue}`);
    }
  }
}
