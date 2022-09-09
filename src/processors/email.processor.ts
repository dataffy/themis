import { EmailValidator } from "../validators";
import { StringFieldConfig, StringFieldProcessor } from "./string.processor";

export type EmailFieldConfig = StringFieldConfig;

export class EmailFieldProcessor extends StringFieldProcessor<EmailFieldConfig> {
  initialiseValidators(): void {
    super.initialiseValidators();

    this.validators.push(new EmailValidator());
  }
}
