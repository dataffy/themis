import { FieldConfig, FieldProcessor, ProcessorClass } from "./field.processor";
import { Options, Schema, SchemaClass } from "../schema";
import {
  ProcessorErrorMessages,
  ProcessorValidateError,
  ValidationError,
} from "../errors";

export type ArrayFieldType<
  C extends FieldConfig = FieldConfig,
  U = unknown,
  K = unknown
> = ProcessorClass<FieldProcessor<C, U, K>>;

export type ArrayChildType<
  C extends FieldConfig = FieldConfig,
  Payload = unknown,
  Context = unknown,
  O extends Options = Options
> =
  | ArrayFieldType<C>
  | SchemaClass<Schema<Payload, Context>, Payload, O, Context>;

export type ArrayFieldConfig<
  T extends FieldConfig,
  Payload = unknown,
  Context = any
> = FieldConfig & {
  /**
   * The processor or schema used for validating the array values
   */
  child: ArrayChildType<T, Payload, Context>;
  /**
   * The configuration for the processor
   */
  childConfig?: T;
};

export class ArrayFieldProcessor<
  T,
  K = unknown,
  U = unknown,
  Context = unknown
> extends FieldProcessor<
  ArrayFieldConfig<T, unknown, Context>,
  K[],
  Promise<U[]>,
  Context
> {
  initialiseValidators(): void {}

  async toInternalValue(data: K[]): Promise<U[]> {
    if (!(data instanceof Array)) {
      throw new ProcessorValidateError(["Not a valid array"]);
    }

    const childType = this.getBaseClass(this.configuration.child);

    if (childType.name === FieldProcessor.name) {
      return await this.processorToInternalValue(data);
    } else if (childType.name === Schema.name) {
      return await this.schemaToInternalValue(data);
    }
  }

  private async processorToInternalValue(data: K[]): Promise<U[]> {
    const processorClass = this.configuration.child as ProcessorClass<
      FieldProcessor<T, K, U>
    >;
    const processor = new processorClass(
      this.configuration.childConfig || {},
      this.context
    );
    const errors: Record<string, ProcessorErrorMessages> = {};
    const processedData: U[] = [];

    for (let index = 0; index < data.length; index++) {
      try {
        const processedValue = await processor.validate(data[index]);
        processedData.push(processedValue);
      } catch (error) {
        if (error instanceof ProcessorValidateError) {
          errors[index] = error.messages;
        } else {
          throw error;
        }
      }
    }

    if (Object.keys(errors).length !== 0) {
      throw new ProcessorValidateError(errors);
    }

    return processedData;
  }

  private async schemaToInternalValue(data: K[]): Promise<U[]> {
    const schemaClass = this.configuration.child as SchemaClass<
      Schema<U, Context>,
      U,
      Options,
      Context
    >;
    const errors: Record<string, ProcessorErrorMessages> = {};
    const processedData: U[] = [];

    for (let index = 0; index < data.length; index++) {
      const schema = new schemaClass(
        data[index] as Record<string, unknown>,
        this.context
      );

      try {
        await schema.validate();
        processedData.push(schema.toData());
      } catch (error) {
        if (error instanceof ValidationError) {
          errors[index] = error.errors;
        } else {
          throw error;
        }
      }
    }

    if (Object.keys(errors).length !== 0) {
      throw new ProcessorValidateError(errors);
    }

    return processedData;
  }

  private getBaseClass(
    child: ArrayChildType<T, unknown, Context>
  ): ArrayChildType<T, unknown, Context> {
    const baseClass = Object.getPrototypeOf(child);

    if (baseClass && baseClass.name) {
      return this.getBaseClass(baseClass);
    }

    return child;
  }
}
