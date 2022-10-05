import { FieldConfig, FieldProcessor } from "./field.processor";
import { ProcessorValidateError } from "../errors";
import { MaxLengthValidator, MinLengthValidator } from "../validators";

export type StringFieldConfig = FieldConfig<string> &
  Partial<{
    /**
     * The max length allowed for the field
     */
    maxLength: number;
    /**
     * The min length allowed for the field
     */
    minLength: number;
  }>;

export class StringFieldProcessor<
  T extends StringFieldConfig = StringFieldConfig
> extends FieldProcessor<T, string, string> {
  toInternalValue(data: string): string {
    if (!(typeof data === "string")) {
      throw new ProcessorValidateError(["Not a valid string"]);
    }

    return data;
  }

  initialiseValidators(): void {
    if (this.configuration.maxLength) {
      this.validators.push(
        new MaxLengthValidator(this.configuration.maxLength)
      );
    }
    if (this.configuration.minLength) {
      this.validators.push(
        new MinLengthValidator(this.configuration.minLength)
      );
    }
  }
}
