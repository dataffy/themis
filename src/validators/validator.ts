export abstract class Validator<T> {
  protected constructor(protected readonly errorMessage?: string) {}

  /**
   * Used to validate and throw error if the validation fails
   * @param value
   */
  abstract validate(value: T): void;
}
