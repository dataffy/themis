import { EmailFieldProcessor } from "../../src/processors";
import { Validator } from "../../src/validators";
import { EmailValidator } from "../../src/validators";
import { StringFieldProcessor } from "../../src/processors";

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
