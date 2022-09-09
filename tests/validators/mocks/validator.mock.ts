import { Validator } from "../../../src/validators";

export class ValidatorMock extends Validator<string> {
  constructor() {
    super();
  }

  validate(): void {
    console.log("validate");
  }
}
