import { Validator } from "@app/validators/validator";

export class ValidatorMock extends Validator<string> {
  constructor() {
    super();
  }

  validate(): void {
    console.log("validate");
  }
}
