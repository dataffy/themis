import { SchemaMetadataStorage } from "../../src/schema";
import { SchemaMock } from "../schemas/mocks/schema.mock";
import { NestedFieldConfiguration } from "../../src/fields";
import { registerField, registerNestedSchemaField } from "../../src/fields";
import { FieldConfig } from "../../src/processors";
import { ProcessorMock } from "../processors/mocks/processor.mock";

describe("Fields Utils", () => {
  describe("registerNestedSchemaField", () => {
    it("should register nested field successfully", () => {
      const schemaClass = SchemaMock;
      const propertyKey = "field";
      const configuration = {
        schema: SchemaMock,
      } as NestedFieldConfiguration<SchemaMock, unknown>;

      const addClassNestedValidatorDefinitionMock = jest
        .spyOn(SchemaMetadataStorage.prototype, "addNestedSchemaDefinition")
        .mockImplementationOnce(() => {});

      registerNestedSchemaField(schemaClass, propertyKey, configuration);

      expect(addClassNestedValidatorDefinitionMock).toBeCalledTimes(1);

      expect(addClassNestedValidatorDefinitionMock).toBeCalledWith(
        schemaClass.constructor.name,
        propertyKey,
        configuration
      );
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
        .spyOn(SchemaMetadataStorage.prototype, "addSchemaDefinition")
        .mockImplementationOnce(() => {});

      registerField(schemaClass, propertyKey, configuration, processorClass);

      expect(addClassValidatorDefinitionMock).toBeCalledTimes(1);
      expect(addClassValidatorDefinitionMock).toBeCalledWith(
        schemaClass.constructor.name,
        propertyKey,
        configuration,
        processorClass
      );
    });
  });
});
