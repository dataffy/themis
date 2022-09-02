import {Validator} from "@app/validators/validator";
import {ValidateError} from "@app/errors";

export type FieldConfig = Partial<{
  nullable: boolean;
  required: boolean;
}>;

export type ProcessorClass<
  T extends FieldProcessor<C, U, K>,
  C extends FieldConfig = FieldConfig,
  U = unknown,
  K = unknown,
> = new (configuration: C) => T;

export abstract class FieldProcessor<T extends FieldConfig, U, K> {
  protected validators: Validator<K>[] = [];

  constructor(protected readonly configuration: T) {
    this.initialiseValidators();
  }

  /**
   * Transforms the incoming data into the value used internally
   * @param data
   */
  abstract toInternalValue(data: U): K;

  /**
   * Used to initialise the validators based on the field options
   */
  abstract initialiseValidators(): void;

  /**
   *
   * @param data
   */
  validate(data: U): K {
    const isEmpty = this.checkEmptyValues(data);

    if (isEmpty) {
      return data as undefined | null;
    }

    const value = this.toInternalValue(data);

    this.runValidators(value);

    return value;
  }

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
      // TODO: modify thrown error
      throw new ValidateError(errors.toString());
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
