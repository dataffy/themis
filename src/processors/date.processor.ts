import { FieldConfig, FieldProcessor } from "./field.processor";
import { ProcessorValidateError } from "../errors";
import { parse, parseISO } from "date-fns";

export type DateFieldConfig = Partial<{
  formats: string[];
}> &
  FieldConfig;

export class DateFieldProcessor extends FieldProcessor<
  DateFieldConfig,
  string | Date,
  Date
> {
  initialiseValidators(): void {}

  toInternalValue(data: string | Date): Date {
    if (data instanceof Date) {
      return data;
    }

    if (typeof data !== "string") {
      throw new ProcessorValidateError(["Not a valid date"]);
    }

    if (
      !this.configuration.formats ||
      this.configuration.formats.length === 0
    ) {
      return this.parseIsoDate(data);
    }

    return this.parseDateFormat(data);
  }

  private parseDateFormat(value: string): Date {
    for (const format of this.configuration.formats) {
      const date = parse(value, format, new Date());

      if (date instanceof Date && !isNaN(date.valueOf())) {
        return date;
      }
    }

    throw new ProcessorValidateError([
      `Date must have format ${this.configuration.formats.join(", ")}`,
    ]);
  }

  private parseIsoDate(value: string): Date {
    const date = parseISO(value);

    if (date instanceof Date && isNaN(date.valueOf())) {
      throw new ProcessorValidateError(["Date must have ISO 8601 format"]);
    }

    return date;
  }
}
