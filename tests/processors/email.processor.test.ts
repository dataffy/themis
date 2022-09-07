import { EmailFieldProcessor } from "@app/processors/email.processor";
import { Validator } from "@app/validators/validator";
import { EmailValidator } from "@app/validators/string/email.validator";
import { StringFieldProcessor } from "@app/processors";

describe("EmailFieldProcessor", () => {
  describe("initialiseValidators method", () => {
    it.each([
      {
        testName: "add email validator and check inherited method is called",
        config: {},
        expectedValidators: [new EmailValidator()],
      },
    ])("Should $testName", ({ config, expectedValidators }) => {
      const initialiseValidatorsMock = jest
        .spyOn(StringFieldProcessor.prototype, "initialiseValidators")
        .mockImplementationOnce(() => {});

      const processor = new EmailFieldProcessor(config);

      expect(initialiseValidatorsMock).toBeCalledTimes(1);
      expect(
        (
          processor as EmailFieldProcessor & {
            validators: Validator<unknown>[];
          }
        ).validators
      ).toMatchObject(expectedValidators);
    });
  });
});
