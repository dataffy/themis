import {FieldConfig} from "@app/processors/field.processor";
import {
  BooleanFieldConfig,
  BooleanFieldProcessor, FloatFieldConfig,
  FloatFieldProcessor,
  IntegerFieldConfig, IntegerFieldProcessor,
  StringFieldConfig,
  StringFieldProcessor
} from "@app/processors";
import {registerField, registerNestedValidatorField} from "@app/fields/utils";

export type ValidationField<T extends FieldConfig> = (
  configuration?: T,
) => (target: object, propertyKey: string) => void;

/**
 * Used to register the class property as a string field
 * @param configuration
 * @constructor
 * @example
 * export class UserSchema {
 *   @StringField()
 *   firstName: string
 * }
 */
export const StringField: ValidationField<StringFieldConfig> =
  (configuration?: StringFieldConfig) =>
    (target: object, propertyKey: string): void => {
      registerField(target, propertyKey, configuration, StringFieldProcessor);
    };

/**
 * Used to register the class property as an integer field
 * @param configuration
 * @constructor
 * @example
 * export class UserSchema {
 *   @IntegerField()
 *   followers: number
 * }
 */
export const IntegerField: ValidationField<IntegerFieldConfig> =
  (configuration?: IntegerFieldConfig) =>
    (target: object, propertyKey: string): void => {
      registerField(target, propertyKey, configuration, IntegerFieldProcessor);
    };

/**
 * Used to register the class property as a boolean field
 * @param configuration
 * @constructor
 * @example
 * export class UserSchema {
 *   @StringField()
 *   admin: boolean
 * }
 */
export const BooleanField: ValidationField<BooleanFieldConfig> =
  (configuration?: BooleanFieldConfig) =>
    (target: object, propertyKey: string): void => {
      registerField(target, propertyKey, configuration, BooleanFieldProcessor);
    };

/**
 * Used to register the class property as a boolean field
 * @param configuration
 * @constructor
 * @example
 * export class EventSchema {
 *   @FloatField()
 *   price: number
 * }
 */
export const FloatField: ValidationField<FloatFieldConfig> =
  (configuration?: FloatFieldConfig) =>
    (target: object, propertyKey: string): void => {
      registerField(target, propertyKey, configuration, FloatFieldProcessor);
    };

export type NestedFieldConfiguration<T> = {
  validator: any; //TODO: Update type
};

/**
 * Nested field that registers the field as nested
 * @param configuration
 * @constructor
 */
export const NestedField =
  <T>(configuration: NestedFieldConfiguration<T>) =>
    (target: object, propertyKey: string): void => {
      registerNestedValidatorField(target, "NestedField", propertyKey, configuration);
    };
