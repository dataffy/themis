import { ValidatorFieldsMetadataStorage } from "@app/schema/storage";
import {
  FieldConfig,
  FieldProcessor,
  ProcessorClass,
} from "@app/processors/field.processor";
import { NestedFieldConfiguration } from "@app/fields";

// export type Constructable<T, O extends Options = Options> = new (obj: T, options: O) => ValidatorClass<T>;

/**
 * Registers a nested validator decorator
 * @param validatorClass - The validator field target class
 * @param validatorName - The validator field class name
 * @param propertyKey - The property key for which the validator is added
 * @param configuration - The validator field configuration
 */
export const registerNestedValidatorField = (
  validatorClass: object,
  validatorName: string,
  propertyKey: string,
  configuration: NestedFieldConfiguration<any>
): void => {
  ValidatorFieldsMetadataStorage.storage.addClassNestedValidatorDefinition(
    validatorClass.constructor.name,
    validatorName,
    propertyKey,
    configuration
  );
};

/**
 *  Registers a validator decorator
 * @param validatorClass - The validator field target class
 * @param propertyKey - The property key for which the validator is added
 * @param configuration - The validator field configuration
 * @param processorClass - The class used for processing the proeperty
 * @example
 * registerValidationField(
 *  UserValidator,
 *  'BooleanField',
 *  'disabled',
 *  {field: 'isDisabled'},
 *  (value: string | string[]): boolean => {...}
 * )
 */
export const registerField = <
  C extends FieldConfig,
  T extends ProcessorClass<FieldProcessor<C, unknown, unknown>>
>(
  validatorClass: object,
  propertyKey: string,
  configuration: C,
  processorClass: T
): void => {
  ValidatorFieldsMetadataStorage.storage.addClassValidatorDefinition(
    validatorClass.constructor.name,
    propertyKey,
    configuration,
    processorClass
  );
};
