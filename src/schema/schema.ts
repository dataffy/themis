import { SchemaClassConfiguration, SchemaMetadataStorage } from "./storage";
import { FieldConfig, FieldProcessor, ProcessorClass } from "../processors";
import { ProcessorValidateError, ValidationError } from "../errors";

export type SchemaClass<
  T extends Schema<U>,
  U,
  O extends Options = Options,
  Context = unknown
> = new (obj: Record<string, unknown>, context?: Context, options?: O) => T;

export type ValidationErrors = { [key: string]: ValidationErrors | string[] };
export type Options = {
  partialValidation: boolean;
};

export class Schema<T, Context = unknown> {
  protected initialData: Record<string, unknown>;
  protected options: Options;
  protected validatedFields: T;
  protected readonly context?: Context;

  constructor(
    obj: Record<string, unknown>,
    context?: Context,
    options?: Options
  ) {
    SchemaMetadataStorage.storage.registerSchemaClass(this.constructor.name);
    this.initialData = obj;
    this.validatedFields = {} as T;
    this.options = options;
    this.context = context;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(): Promise<void> {
    await this.processValidation();
  }

  private async validateFields(): Promise<ValidationErrors> {
    const validateClassMetadata =
      SchemaMetadataStorage.storage.getSchemaClassMetadata(
        this.constructor.name
      );

    const errors: ValidationErrors = {};

    for (const validatorProperty of Object.keys(
      validateClassMetadata.properties
    )) {
      const propertyConfiguration =
        validateClassMetadata.properties[validatorProperty];
      const fromField =
        propertyConfiguration.configuration.fromField || validatorProperty;

      if (this.options.partialValidation) {
        return;
      }

      try {
        const attribute = this.initialData[fromField];
        const processor = new propertyConfiguration.processorClass(
          propertyConfiguration.fieldConfig || {},
          this.context
        );
        this.validatedFields[validatorProperty as keyof T] =
          (await processor.validate(attribute)) as T[keyof T];
      } catch (error) {
        if (error instanceof ProcessorValidateError) {
          errors[validatorProperty] = error.messages;
        }
      }
    }
    const nestedErrors = await this.nestedFields(validateClassMetadata);

    return {
      ...errors,
      ...nestedErrors,
    };
  }

  private async nestedFields(
    validateClassMetadata: SchemaClassConfiguration<
      FieldConfig,
      ProcessorClass<FieldProcessor<FieldConfig, unknown, unknown>>
    >
  ): Promise<ValidationErrors> {
    const errors: ValidationErrors = {};

    for (const validatorProperty of Object.keys(
      validateClassMetadata.nestedValidators
    )) {
      const validatorConfig =
        validateClassMetadata.nestedValidators[validatorProperty];
      const fromField = validatorConfig.fromField || validatorProperty;

      if (this.initialData[fromField] === undefined) {
        if (
          this.options.partialValidation ||
          validatorConfig.required === false
        ) {
          return;
        }
        errors[validatorProperty] = [`Missing field ${validatorProperty}`];
      }

      const validator = new validatorConfig.schema(
        this.initialData[fromField] as Record<string, unknown>,
        this.options
      );

      const validatorErrors = await validator.validateFields();

      if (Object.keys(errors).length !== 0) {
        errors[validatorProperty] = validatorErrors;
        return;
      }

      this.validatedFields[validatorProperty as keyof T] = validator.toData();
    }

    return errors;
  }

  private async processValidation(): Promise<void> {
    const validationErrors: ValidationErrors = await this.validateFields();

    if (Object.keys(validationErrors).length !== 0) {
      throw new ValidationError(validationErrors);
    }
  }

  toData(): T {
    return this.validatedFields as T;
  }
}
