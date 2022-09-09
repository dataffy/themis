import { FieldConfig, FieldProcessor, ProcessorClass } from "../processors";
import {
  DecoratorConfig,
  DecoratorFieldConfig,
  decoratorFields,
  NestedFieldConfiguration,
} from "../fields";
import { Schema } from "./schema";

export type PropertyConfiguration<
  T extends FieldProcessor<FieldConfig, unknown, unknown>
> = {
  processor: T;
  configuration: DecoratorConfig;
};

export type SchemaClassConfiguration<
  T extends FieldProcessor<FieldConfig, unknown, unknown>
> = {
  registered: boolean;
  properties: { [propertyKey: string]: PropertyConfiguration<T> };
  nestedValidators: {
    [propertyKey: string]: NestedFieldConfiguration<Schema<unknown>, unknown>;
  };
};

type Configs<T> = {
  fieldConfig: T;
  decoratorConfig: DecoratorConfig;
};

export class SchemaMetadataStorage {
  private static instance: SchemaMetadataStorage;
  protected schemaClasses: {
    [schemaClassName: string]: SchemaClassConfiguration<
      FieldProcessor<FieldConfig, unknown, unknown>
    >;
  } = {};

  private constructor() {}

  /**
   * Returns the ValidationFieldsMetadataStorage instance
   */
  static get storage(): SchemaMetadataStorage {
    if (!this.instance) {
      this.instance = new SchemaMetadataStorage();
    }

    return this.instance;
  }

  /**
   * Used to mark the validator class as registered. If a validator class is not
   * registered using this method, it will throw an error when trying to use it for
   * getting the validation fields metadata
   * @param schemaClassName
   */
  registerSchemaClass(schemaClassName: string): void {
    if (!this.schemaClasses[schemaClassName]) {
      throw new Error(
        `${schemaClassName} is not configured in storage. Use addSchemaDefinition method to add the configuration`
      );
    }

    this.schemaClasses[schemaClassName].registered = true;
  }

  /**
   * Add the validator definition metadata for the specified schemaClassName
   *
   * @param schemaClassName - The validator class name for which the validation field is being registered
   * @param propertyKey - The key that the validator field is used on
   * @param configuration - The configuration of the validator
   * @param processorClass - The class used for processing the property
   *
   */
  addSchemaDefinition<
    C extends FieldConfig,
    T extends ProcessorClass<FieldProcessor<C, unknown, unknown>>
  >(
    schemaClassName: string,
    propertyKey: string,
    configuration: DecoratorFieldConfig<C>,
    processorClass: T
  ): void {
    if (!this.schemaClasses[schemaClassName]) {
      this.schemaClasses[schemaClassName] = {
        registered: false,
        properties: {},
        nestedValidators: {},
      };
    }

    const configs: Configs<C> = this.getDecoratorAndFieldConfig(configuration);

    this.schemaClasses[schemaClassName].properties[propertyKey] = {
      processor: new processorClass(configs.fieldConfig || {}),
      configuration: configs.decoratorConfig,
    };
  }

  /**
   * Add the validator definition metadata for the specified schemaClassName
   *
   * @param schemaClassName - The validator class name for which the validation field is being registered
   * @param propertyKey - The key that the validator field is used on
   * @param configuration - The configuration of the validator
   *
   */
  addNestedSchemaDefinition<
    T extends NestedFieldConfiguration<Schema<unknown>, unknown>
  >(schemaClassName: string, propertyKey: string, configuration: T): void {
    if (!this.schemaClasses[schemaClassName]) {
      this.schemaClasses[schemaClassName] = {
        registered: false,
        properties: {},
        nestedValidators: {},
      };
    }

    this.schemaClasses[schemaClassName].nestedValidators[propertyKey] =
      configuration;
  }

  /**
   * Used for retrieving all the validator class metadata for the specified validator class
   *
   * @param schemaClass
   */
  getSchemaClassMetadata(
    schemaClass: string
  ): SchemaClassConfiguration<FieldProcessor<unknown, unknown, unknown>> {
    return this.schemaClasses[schemaClass];
  }

  private getDecoratorAndFieldConfig<T>(
    decoratorFieldConfig: DecoratorFieldConfig<T>
  ): Configs<T> {
    if (!decoratorFieldConfig) {
      return {
        fieldConfig: null,
        decoratorConfig: null,
      };
    }

    const decoratorConfig: DecoratorConfig = {};
    const config: DecoratorFieldConfig<T> = { ...decoratorFieldConfig };

    decoratorFields.forEach((field: keyof DecoratorConfig) => {
      decoratorConfig[field] = decoratorFieldConfig[field];
      delete config[field];
    });

    return {
      fieldConfig: config,
      decoratorConfig,
    };
  }
}
