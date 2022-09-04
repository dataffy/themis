export type ValidationErrors = { [key: string]: ValidationErrors | string[] };

export class ValidationError extends Error {
  errors: ValidationErrors;

  constructor(errors: ValidationErrors) {
    super();
    this.errors = errors;
  }
}
