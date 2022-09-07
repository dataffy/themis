import { EmailValidator } from "@app/validators/string/email.validator";
import {
  StringFieldConfig,
  StringFieldProcessor,
} from "@app/processors/string.processor";

export type EmailFieldConfig = StringFieldConfig;

export class EmailFieldProcessor extends StringFieldProcessor<EmailFieldConfig> {
  initialiseValidators(): void {
    super.initialiseValidators();

    this.validators.push(new EmailValidator());
  }
}
