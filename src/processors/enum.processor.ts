import { FieldConfig, FieldProcessor } from "./field.processor";
import { ProcessorValidateError } from "../errors";

type EnumAbstract = {
  [key: string]: number | string;
};

export type EnumFieldConfig<T extends EnumAbstract = EnumAbstract> =
  FieldConfig<T[keyof T]> &
    Partial<{
      /**
       * The enum which will be validated against
       */
      enum: T;
    }>;

export class EnumFieldProcessor<T extends EnumAbstract> extends FieldProcessor<
  EnumFieldConfig<T>,
  unknown,
  T[keyof T]
> {
  toInternalValue(data: unknown): T[keyof T] {
    if (typeof data !== "string" && typeof data !== "number") {
      throw new ProcessorValidateError(["Not a valid date"]);
    }

    if (!Object.values(this.configuration.enum).includes(data)) {
      throw new ProcessorValidateError(["Not a valid enum value"]);
    }

    return data as T[keyof T];
  }

  initialiseValidators(): void {}
}
