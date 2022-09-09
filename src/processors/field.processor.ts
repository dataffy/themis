import { Validator } from "../validators";
import { ProcessorValidateError, ValidateError } from "../errors";

export type FieldConfig<T = unknown> = Partial<{
  /**
   * Specifies if the field is nullable. Default value is true
   */
  nullable: boolean;
  /**
   * Specifies if the field is required. Default value is true
   */
  required: boolean;
  /**
   * Validators against which the value is checked
   */
  validators: Validator<T>[];
}>;

export type ProcessorClass<
  T extends FieldProcessor<C, U, K>,
  C extends FieldConfig<K> = FieldConfig,
  U = unknown,
  K = unknown
> = new (configuration: C) => T;

export abstract class FieldProcessor<T extends FieldConfig<K>, U, K> {
  protected validators: Validator<K>[] = [];

  constructor(protected readonly configuration: T) {
    if (this.configuration.validators) {
      this.validators = [...this.configuration.validators];
    }
    this.initialiseValidators();
  }

  /**
   * Transforms the incoming data into the value used internally
   * @abstract
   * @param data
   */
  abstract toInternalValue(data: U): K;

  /**
   * Used to initialise the validators based on the field configuration
   */
  abstract initialiseValidators(): void;

  validate(data: U): K {
    const isEmpty = this.checkEmptyValues(data);

    if (isEmpty) {
      return data as undefined | null;
    }

    const value = this.toInternalValue(data);

    this.runValidators(value);

    return value;
  }

  /**
   * Runs all the validators configured on the field and throws an error containing all the
   * validation errors
   * @param data
   * @private
   */
  private runValidators(data: K): void {
    const errors: string[] = [];

    this.validators.forEach((validator: Validator<K>) => {
      try {
        validator.validate(data);
      } catch (error) {
        errors.push((error as Error).message);
      }
    });

    if (errors.length !== 0) {
      throw new ProcessorValidateError(errors);
    }
  }

  /**
   * Checks the data for empty values and throws error if data is not valid.
   *
   * @param data
   * @private
   * @returns True if value is empty and valid; False if value is not empty
   */
  private checkEmptyValues(data: U): boolean {
    if (data === undefined && !(this.configuration.required === false)) {
      throw new ValidateError("Value is required");
    } else if (data === null && this.configuration.nullable === false) {
      throw new ValidateError("Value cannot be null");
    }

    return data === undefined || data === null;
  }
}
