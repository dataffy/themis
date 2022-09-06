import { FieldConfig } from "@app/processors/field.processor";
import {
  BooleanFieldConfig,
  BooleanFieldProcessor,
  FloatFieldConfig,
  FloatFieldProcessor,
  IntegerFieldConfig,
  IntegerFieldProcessor,
  StringFieldConfig,
  StringFieldProcessor,
} from "@app/processors";
import { registerField, registerNestedSchemaField } from "@app/fields/utils";
import { Schema, SchemaClass } from "@app/schema/schema";
import {
  DateFieldConfig,
  DateFieldProcessor,
} from "@app/processors/date.processor";

export type ValidationField<T extends FieldConfig> = (
  configuration?: T
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

/**
 * Used to register the class property as a date field
 * @param configuration
 * @constructor
 * @example
 * export class EventSchema {
 *   @DateField()
 *   startDate: Date
 * }
 */
export const DateField: ValidationField<DateFieldConfig> =
  (configuration?: DateFieldConfig) =>
  (target: object, propertyKey: string): void => {
    registerField(target, propertyKey, configuration, DateFieldProcessor);
  };

export type NestedFieldConfiguration<T extends Schema<U>, U> = {
  validator: SchemaClass<T, U>;
};

/**
 * Nested field that registers the field as nested
 * @param configuration
 * @constructor
 */
export const NestedField =
  <U extends Schema<unknown>, T extends NestedFieldConfiguration<U, unknown>>(
    configuration: T
  ) =>
  (target: object, propertyKey: string): void => {
    registerNestedSchemaField(target, propertyKey, configuration);
  };
