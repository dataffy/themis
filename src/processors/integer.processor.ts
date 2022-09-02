import {FieldConfig, FieldProcessor} from "@app/processors/field.processor";
import {ValidateError} from "@app/errors";
import {MaxValueValidator, MinValueValidator} from "@app/validators";

export type IntegerFieldConfig = FieldConfig &
  Partial<{
    minValue: number;
    maxValue: number;
  }>;

export class IntegerFieldProcessor extends FieldProcessor<IntegerFieldConfig, number, number> {
  errorMessage = "Not a valid string";

  toInternalValue(data: number): number {
    if (!(typeof data === "number") || !Number.isInteger(data)) {
      throw new ValidateError(this.errorMessage);
    }

    return data;
  }

  initialiseValidators(): void {
    if (this.configuration.minValue) {
      this.validators.push(new MinValueValidator(this.configuration.minValue));
    }
    if (this.configuration.maxValue) {
      this.validators.push(new MaxValueValidator(this.configuration.maxValue));
    }
  }
}
