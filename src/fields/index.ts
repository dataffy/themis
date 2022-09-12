import {
  EmailFieldConfig,
  EmailFieldProcessor,
  FieldConfig,
} from "../processors";
import {
  BooleanFieldConfig,
  BooleanFieldProcessor,
  FloatFieldConfig,
  FloatFieldProcessor,
  IntegerFieldConfig,
  IntegerFieldProcessor,
  StringFieldConfig,
  StringFieldProcessor,
} from "../processors";
import { registerField, registerNestedSchemaField } from "./utils";
import { Schema, SchemaClass } from "../schema";
import { DateFieldConfig, DateFieldProcessor } from "../processors";

export * from "./utils";

export type ValidationField<T extends FieldConfig> = (
  configuration?: DecoratorFieldConfig<T>
) => (target: object, propertyKey: string) => void;

export type DecoratorConfig = Partial<{
  fromField: string;
}>;

export type DecoratorFieldConfig<T extends FieldConfig> = DecoratorConfig & T;

export const decoratorFields: (keyof DecoratorConfig)[] = ["fromField"];

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
  (configuration?: DecoratorFieldConfig<StringFieldConfig>) =>
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
  (configuration?: DecoratorFieldConfig<IntegerFieldConfig>) =>
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
  (configuration?: DecoratorFieldConfig<BooleanFieldConfig>) =>
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
  (configuration?: DecoratorFieldConfig<FloatFieldConfig>) =>
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
  (configuration?: DecoratorFieldConfig<DateFieldConfig>) =>
  (target: object, propertyKey: string): void => {
    registerField(target, propertyKey, configuration, DateFieldProcessor);
  };

/**
 * Used to register the class property as an email field
 * @param configuration
 * @constructor
 * @example
 * export class UserSchema {
 *   @EmailField()
 *   email: string
 * }
 */
export const EmailField: ValidationField<EmailFieldConfig> =
  (configuration?: DecoratorFieldConfig<EmailFieldConfig>) =>
  (target: object, propertyKey: string): void => {
    registerField(target, propertyKey, configuration, EmailFieldProcessor);
  };

export type NestedFieldConfiguration<T extends Schema<U>, U> = {
  validator: SchemaClass<T, U>;
} & DecoratorConfig &
  FieldConfig;

/**
 * Nested field that registers the field as nested
 * @param configuration
 * @constructor
 */
export const NestedField =
  <U extends Schema<K>, K>(configuration: NestedFieldConfiguration<U, K>) =>
  (target: object, propertyKey: string): void => {
    registerNestedSchemaField(target, propertyKey, configuration);
  };
