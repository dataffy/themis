import { ValidationErrors } from "../schema";

export type ProcessorErrorMessages =
  | string[]
  | { [key: string]: string[] | ValidationErrors | ProcessorErrorMessages };

export class ProcessorValidateError extends Error {
  messages: ProcessorErrorMessages;

  constructor(messages: ProcessorErrorMessages) {
    super();
    this.messages = messages;
  }
}
