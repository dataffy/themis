import { FieldConfig, FieldProcessor } from "./field.processor";
import { ProcessorValidateError } from "../errors";
import { MaxValueValidator, MinValueValidator } from "../validators";

export type IntegerFieldConfig = FieldConfig &
  Partial<{
    minValue: number;
    maxValue: number;
  }>;

export class IntegerFieldProcessor extends FieldProcessor<
  IntegerFieldConfig,
  number,
  number
> {
  errorMessage = "Not a valid integer number";

  toInternalValue(data: number): number {
    if (!(typeof data === "number") && !(typeof data === "string")) {
      throw new ProcessorValidateError([this.errorMessage]);
    }

    if (!Number.isInteger(+data)) {
      throw new ProcessorValidateError([this.errorMessage]);
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
