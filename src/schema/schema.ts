import { SchemaClassConfiguration, SchemaMetadataStorage } from "./storage";
import { FieldConfig, FieldProcessor } from "../processors";
import { ValidationError } from "../errors";

export type SchemaClass<
  T extends Schema<U>,
  U,
  O extends Options = Options
> = new (obj: U, options: O) => T;

export type ValidationErrors = { [key: string]: ValidationErrors | string[] };
export type Options = {
  partialValidation: boolean;
};

export class Schema<T, Context = unknown> {
  protected initialData: T;
  protected options: Options;
  protected validatedFields: Record<string, unknown>;

  constructor(obj: T, options: Options) {
    SchemaMetadataStorage.storage.registerSchemaClass(this.constructor.name);
    this.initialData = obj;
    this.validatedFields = {};
    this.options = options;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(ctx: Context): Promise<void> {
    this.processValidation();
  }

  private validateFields(): ValidationErrors {
    const validateClassMetadata =
      SchemaMetadataStorage.storage.getSchemaClassMetadata(
        this.constructor.name
      );

    const errors: ValidationErrors = {};

    Object.keys(validateClassMetadata.properties).forEach(
      (validatorProperty: string) => {
        const propertyConfiguration =
          validateClassMetadata.properties[validatorProperty];
        const fromField = (propertyConfiguration.configuration.fromField ||
          validatorProperty) as keyof T;

        if (this.initialData[fromField] === undefined) {
          if (this.options.partialValidation) {
            return;
          }
          errors[validatorProperty] = [`Missing field ${validatorProperty}`];
        }

        try {
          const attribute = this.initialData[fromField];
          this.validatedFields[validatorProperty] =
            propertyConfiguration.processor.validate(attribute);
        } catch ({ message }) {
          errors[validatorProperty] = [message as string];
        }
      }
    );
    const nestedErrors = this.nestedFields(validateClassMetadata);

    return {
      ...errors,
      ...nestedErrors,
    };
  }

  private nestedFields(
    validateClassMetadata: SchemaClassConfiguration<
      FieldProcessor<FieldConfig, unknown, unknown>
    >
  ): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(validateClassMetadata.nestedValidators).forEach(
      (validatorProperty: string) => {
        const validatorConfig =
          validateClassMetadata.nestedValidators[validatorProperty];
        const fromField = (validatorConfig.fromField ||
          validatorProperty) as keyof T;

        if (this.initialData[fromField] === undefined) {
          if (this.options.partialValidation) {
            return;
          }
          errors[validatorProperty] = [`Missing field ${validatorProperty}`];
        }

        const validator = new validatorConfig.validator(
          this.initialData[fromField],
          this.options
        );

        const validatorErrors = validator.validateFields();

        if (Object.keys(errors).length !== 0) {
          errors[validatorProperty] = validatorErrors;
          return;
        }

        this.validatedFields[validatorProperty] = validator.toData();
      }
    );

    return errors;
  }

  private processValidation(): void {
    const validationErrors: ValidationErrors = this.validateFields();

    if (Object.keys(validationErrors).length !== 0) {
      throw new ValidationError(validationErrors);
    }

    Object.assign(this, this.validatedFields);
  }

  toData(): T {
    return this.validatedFields as T;
  }
}
