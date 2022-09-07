import { SchemaMetadataStorage } from "@app/schema/storage";
import { SchemaMock } from "@tests/schemas/mocks/schema.mock";
import { ProcessorMock } from "@tests/processors/mocks/processor.mock";
import { DecoratorConfig, DecoratorFieldConfig } from "@app/fields";
import { FieldConfig } from "@app/processors";

describe("SchemaMetadataStorage", () => {
  beforeEach(() => {
    (
      SchemaMetadataStorage as unknown as SchemaMetadataStorage & {
        instance: SchemaMetadataStorage;
      }
    ).instance = null;
  });

  describe("registerSchemaClass method", () => {
    it("Should mark the class as registered when the function is called", () => {
      const schemaStorage = SchemaMetadataStorage.storage;

      schemaStorage.addSchemaDefinition(
        SchemaMock.name,
        "property",
        {},
        ProcessorMock
      );

      expect(() =>
        schemaStorage.registerSchemaClass(SchemaMock.name)
      ).not.toThrowError();
    });

    it("Should throw error when the class is not configured before calling the function", () => {
      const schemaStorage = SchemaMetadataStorage.storage;

      expect(() =>
        schemaStorage.registerSchemaClass(SchemaMock.name)
      ).toThrowError(
        `${SchemaMock.name} is not configured in storage. Use addSchemaDefinition method to add the configuration`
      );
    });
  });

  describe("addSchemaDefinition method", () => {
    it("Should add default config for schema and configure field when there is no existing config for the schemaClassName", () => {
      const schemaStorage = SchemaMetadataStorage.storage;
      const schemaClassName = SchemaMock.constructor.name;
      const fieldConfig: FieldConfig = {
        nullable: false,
        required: true,
      };
      const decoratorConfig: DecoratorConfig = {
        fromField: "field1",
      };
      const configuration: DecoratorFieldConfig<FieldConfig> = {
        ...decoratorConfig,
        ...fieldConfig,
      };

      const propertyKey = "property";

      schemaStorage.addSchemaDefinition(
        schemaClassName,
        propertyKey,
        configuration,
        ProcessorMock
      );

      const schemaClassMetadata =
        schemaStorage.getSchemaClassMetadata(schemaClassName);

      expect(schemaClassMetadata.nestedValidators).toEqual({});
      expect(schemaClassMetadata.registered).toEqual(false);
      expect(schemaClassMetadata.properties).toEqual({
        [propertyKey]: {
          processor: new ProcessorMock(fieldConfig),
          configuration: decoratorConfig,
        },
      });
    });
  });
});
