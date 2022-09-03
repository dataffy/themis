import { FieldConfig, FieldProcessor } from "@app/processors/field.processor";
import { ValidateError } from "@app/errors";
import { MaxValueValidator, MinValueValidator } from "@app/validators";

export type FloatFieldConfig = FieldConfig &
  Partial<{
    minValue: number;
    maxValue: number;
  }>;

export class FloatFieldProcessor extends FieldProcessor<
  FloatFieldConfig,
  number,
  number
> {
  errorMessage = "Not a valid float number";

  toInternalValue(data: number): number {
    if (!(typeof data === "number")) {
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
