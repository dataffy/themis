import { FieldConfig, FieldProcessor } from "./field.processor";
import { ValidateError } from "../errors";

export type BooleanFieldConfig = FieldConfig;

export class BooleanFieldProcessor extends FieldProcessor<
  BooleanFieldConfig,
  string | boolean | number,
  boolean
> {
  trueValues = [true, "true", "TRUE", "1", 1];
  falseValue = [false, "false", "FALSE", "0", 0];

  toInternalValue(data: string | boolean | number): boolean {
    if (this.trueValues.includes(data)) {
      return true;
    } else if (this.falseValue.includes(data)) {
      return false;
    }

    throw new ValidateError("Not a valid boolean");
  }

  initialiseValidators(): void {}
}
