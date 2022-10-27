import { FieldConfig, FieldProcessor } from "./field.processor";
import { ProcessorValidateError } from "../errors";

export type JsonFieldConfig = FieldConfig;

export type JsonObject = {
  [key: string]: JsonArray | Json | string | number | boolean;
};

export type JsonArray = Json[] | string[] | number[] | boolean[];

export type Json = JsonObject | JsonArray;

export class JsonFieldProcessor extends FieldProcessor<
  JsonFieldConfig,
  Json,
  Json
> {
  errorMessage = "Not a valid json";

  toInternalValue(data: Json): Json {
    if (typeof data === "bigint") {
      throw new ProcessorValidateError([this.errorMessage]);
    }

    if (typeof data === "number") {
      throw new ProcessorValidateError([this.errorMessage]);
    }

    if (typeof data === "boolean") {
      throw new ProcessorValidateError([this.errorMessage]);
    }

    if (data instanceof Date) {
      throw new ProcessorValidateError([this.errorMessage]);
    }

    try {
      if (typeof data === "string") {
        return JSON.parse(data) as Json;
      } else {
        return JSON.parse(JSON.stringify(data)) as Json;
      }
    } catch {
      throw new ProcessorValidateError([this.errorMessage]);
    }
  }

  initialiseValidators(): void {}
}
