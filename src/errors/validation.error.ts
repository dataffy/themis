import { ValidationErrors } from "../schema";

export class ValidationError extends Error {
  errors: ValidationErrors;

  constructor(errors: ValidationErrors) {
    super();
    this.errors = errors;
  }
}
