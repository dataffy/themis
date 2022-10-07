import { SchemaMetadataStorage } from "../schema";
import { FieldConfig, FieldProcessor, ProcessorClass } from "../processors";
import { DecoratorFieldConfig, NestedFieldConfiguration } from ".";
import { Schema } from "../schema";

/**
 * Registers a nested validator decorator
 * @param schemaClass - The validator field target class
 * @param propertyKey - The property key for which the validator is added
 * @param configuration - The validator field configuration
 */
export const registerNestedSchemaField = <U extends Schema<K>, K>(
  schemaClass: object,
  propertyKey: string,
  configuration: NestedFieldConfiguration<U, K>
): void => {
  SchemaMetadataStorage.storage.addNestedSchemaDefinition(
    schemaClass.constructor.name,
    propertyKey,
    configuration
  );
};

/**
 *  Registers a validator decorator
 * @param schemaClass - The validator field target class
 * @param propertyKey - The property key for which the validator is added
 * @param configuration - The validator field configuration
 * @param processorClass - The class used for processing the property
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
  T extends ProcessorClass<FieldProcessor<C, unknown, unknown, Context>, C>,
  Context = unknown
>(
  schemaClass: object,
  propertyKey: string,
  configuration: DecoratorFieldConfig<C>,
  processorClass: T
): void => {
  SchemaMetadataStorage.storage.addSchemaDefinition(
    schemaClass.constructor.name,
    propertyKey,
    configuration,
    processorClass
  );
};
