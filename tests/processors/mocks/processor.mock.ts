import { FieldConfig, FieldProcessor } from "../../../src/processors";

export class ProcessorMock extends FieldProcessor<
  FieldConfig,
  unknown,
  unknown
> {
  initialiseValidators(): void {}

  toInternalValue(data: unknown): unknown {
    return data;
  }
}
