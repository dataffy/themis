import { Validator } from "../validator";
import { ValidateError } from "../../errors";

export class MaxValueValidator extends Validator<number> {
  constructor(
    protected readonly maxValue: number,
    protected readonly errorMessage?: string
  ) {
    super(errorMessage);
  }

  validate(value: number): void {
    if (value > this.maxValue) {
      throw new ValidateError(`max value allowed is ${this.maxValue}`);
    }
  }
}
