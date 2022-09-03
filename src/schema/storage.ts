import {
  FieldConfig,
  FieldProcessor,
  ProcessorClass,
} from "@app/processors/field.processor";
import { NestedFieldConfiguration } from "@app/fields";

export type ValidatorConfiguration<
  T extends FieldProcessor<FieldConfig, unknown, unknown>
> = {
  processor: T;
};

export type ValidatorClassConfiguration<
  T extends FieldProcessor<FieldConfig, unknown, unknown>
> = {
  registered: boolean;
  properties: { [propertyKey: string]: ValidatorConfiguration<T> };
  nestedValidators: { [propertyKey: string]: any }; //TODO: Update nestedValidators type
};

export class ValidatorFieldsMetadataStorage {
  private static instance: ValidatorFieldsMetadataStorage;
  protected validatorsClasses: {
    [validatorClassName: string]: ValidatorClassConfiguration<
      FieldProcessor<FieldConfig, unknown, unknown>
    >;
  } = {};

  private constructor() {}

  /**
   * Returns the ValidationFieldsMetadataStorage instance
   */
  static get storage(): ValidatorFieldsMetadataStorage {
    if (!this.instance) {
      this.instance = new ValidatorFieldsMetadataStorage();
    }

    return this.instance;
  }

  /**
   * Used to mark the validator class as registered. If a validator class is not
   * registered using this method, it will throw an error when trying to use it for
   * getting the validation fields metadata
   * @param validatorClassName
   */
  addValidatorClass(validatorClassName: string): void {
    this.validatorsClasses[validatorClassName].registered = true;
  }

  /**
   * Add the validator definition metadata for the specified validatorClassName
   *
   * @param validatorClassName - The validator class name for which the validation field is being registered
   * @param propertyKey - The key that the validator field is used on
   * @param configuration - The configuration of the validator
   * @param processorClass - The class used for processing the proeperty
   *
   */
  addClassValidatorDefinition<
    C extends FieldConfig,
    T extends ProcessorClass<FieldProcessor<C, unknown, unknown>>
  >(
    validatorClassName: string,
    propertyKey: string,
    configuration: C,
    processorClass: T
  ): void {
    if (!this.validatorsClasses[validatorClassName]) {
      this.validatorsClasses[validatorClassName] = {
        registered: false,
        properties: {},
        nestedValidators: {},
      };
    }

    this.validatorsClasses[validatorClassName].properties[propertyKey] = {
      processor: new processorClass(configuration || {}),
    };
  }

  /**
   * Add the validator definition metadata for the specified validatorClassName
   *
   * @param validatorClassName - The validator class name for which the validation field is being registered
   * @param validatorName - Specifies the name of the validator field
   * @param propertyKey - The key that the validator field is used on
   * @param configuration - The configuration of the validator
   *
   */
  addClassNestedValidatorDefinition(
    validatorClassName: string,
    validatorName: string,
    propertyKey: string,
    configuration: NestedFieldConfiguration<any>
  ): void {
    if (!this.validatorsClasses[validatorClassName]) {
      this.validatorsClasses[validatorClassName] = {
        registered: false,
        properties: {},
        nestedValidators: {},
      };
    }

    this.validatorsClasses[validatorClassName].nestedValidators[propertyKey] =
      configuration.validator;
  }

  removeValidatorClass(validatorClassName: string): void {
    delete this.validatorsClasses[validatorClassName];
  }

  /**
   * Used for retrieving all the validator class metadata for the specified validator class
   *
   * @param validatorClass
   */
  getValidatorClassMetadata(
    validatorClass: string
  ): ValidatorClassConfiguration<FieldProcessor<unknown, unknown, unknown>> {
    return this.validatorsClasses[validatorClass];
  }
}
