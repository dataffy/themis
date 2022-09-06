import { ValidatorFieldsMetadataStorage } from "@app/schema/storage";
import { SchemaMock } from "@tests/schemas/mocks/schema.mock";
import { NestedFieldConfiguration } from "@app/fields";
import { registerField, registerNestedSchemaField } from "@app/fields/utils";
import { FieldConfig } from "@app/processors";
import { ProcessorMock } from "@tests/processors/mocks/processor.mock";

describe("Fields Utils", () => {
  describe("registerNestedSchemaField", () => {
    it("should register nested field successfully", () => {
      const schemaClass = SchemaMock;
      const propertyKey = "field";
      const configuration = {
        validator: SchemaMock,
      } as NestedFieldConfiguration<SchemaMock, unknown>;

      const addClassNestedValidatorDefinitionMock = jest
        .spyOn(
          ValidatorFieldsMetadataStorage.prototype,
          "addClassNestedValidatorDefinition"
        )
        .mockImplementationOnce(() => {});

      registerNestedSchemaField(schemaClass, propertyKey, configuration);

      expect(addClassNestedValidatorDefinitionMock.mock.calls.length).toEqual(
        1
      );

      const [callSchemaClass, callPropertyKey, callConfiguration] =
        addClassNestedValidatorDefinitionMock.mock.calls[0];

      expect(schemaClass.constructor.name).toEqual(callSchemaClass);
      expect(propertyKey).toEqual(callPropertyKey);
      expect(configuration).toEqual(callConfiguration);
    });
  });
  describe("registerField", () => {
    it("should register field successfully", () => {
      const schemaClass = SchemaMock;
      const propertyKey = "field";
      const configuration = {
        nullable: true,
      } as FieldConfig;
      const processorClass = ProcessorMock;

      const addClassValidatorDefinitionMock = jest
        .spyOn(
          ValidatorFieldsMetadataStorage.prototype,
          "addClassValidatorDefinition"
        )
        .mockImplementationOnce(() => {});

      registerField(schemaClass, propertyKey, configuration, processorClass);

      expect(addClassValidatorDefinitionMock.mock.calls.length).toEqual(1);

      const [
        callSchemaClass,
        callPropertyKey,
        callConfiguration,
        callProcessorClass,
      ] = addClassValidatorDefinitionMock.mock.calls[0];

      expect(schemaClass.constructor.name).toEqual(callSchemaClass);
      expect(propertyKey).toEqual(callPropertyKey);
      expect(configuration).toEqual(callConfiguration);
      expect(processorClass).toEqual(callProcessorClass);
    });
  });
});
