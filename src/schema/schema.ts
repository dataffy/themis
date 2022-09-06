import {
  ValidatorClassConfiguration,
  ValidatorFieldsMetadataStorage,
} from "@app/schema/storage";
import { FieldConfig, FieldProcessor } from "@app/processors/field.processor";
import { ValidationError } from "@app/errors/validation.error";

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
    ValidatorFieldsMetadataStorage.storage.addValidatorClass(
      this.constructor.name
    );
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
      ValidatorFieldsMetadataStorage.storage.getValidatorClassMetadata(
        this.constructor.name
      );

    const errors: ValidationErrors = {};

    Object.keys(validateClassMetadata.properties).forEach(
      (validatorProperty: string) => {
        const typedValidatorProperty = validatorProperty as keyof T;
        const propertyConfiguration =
          validateClassMetadata.properties[validatorProperty];

        if (this.initialData[typedValidatorProperty] === undefined) {
          if (this.options.partialValidation) {
            return;
          }
          errors[validatorProperty] = [`Missing field ${validatorProperty}`];
        }

        try {
          const attribute = this.initialData[typedValidatorProperty];
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
    validateClassMetadata: ValidatorClassConfiguration<
      FieldProcessor<FieldConfig, unknown, unknown>,
      SchemaClass<Schema<unknown>, unknown>
    >
  ): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(validateClassMetadata.nestedValidators).forEach(
      (validatorProperty: string) => {
        const typedValidatorProperty = validatorProperty as keyof T;
        const validatorClass =
          validateClassMetadata.nestedValidators[validatorProperty].validator;

        if (this.initialData[typedValidatorProperty] === undefined) {
          if (this.options.partialValidation) {
            return;
          }
          errors[validatorProperty] = [`Missing field ${validatorProperty}`];
        }

        const validator = new validatorClass(
          this.initialData[typedValidatorProperty],
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
