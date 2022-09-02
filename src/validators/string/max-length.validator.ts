import {Validator} from "@app/validators/validator";
import {ValidateError} from "@app/errors";

export class MaxLengthValidator extends Validator<string> {
  constructor(protected readonly maxLength: number, protected readonly errorMessage?: string) {
    super(errorMessage);
  }

  validate(value: string): void {
    if (value.length > this.maxLength) {
      throw new ValidateError(`max length allowed is ${this.maxLength}`);
    }
  }
}