import {
  BooleanField, DateField,
  FloatField,
  IntegerField,
  NestedField,
  NestedFieldConfiguration,
  StringField,
} from "@app/fields";
import * as fieldsUtils from "@app/fields/utils";
import { SchemaMock } from "@tests/schemas/mocks/schema.mock";
import {
  BooleanFieldConfig,
  BooleanFieldProcessor,
  FloatFieldConfig,
  FloatFieldProcessor,
  IntegerFieldConfig,
  IntegerFieldProcessor,
  StringFieldConfig,
  StringFieldProcessor,
} from "@app/processors";
import {DateFieldConfig, DateFieldProcessor} from "@app/processors/date.processor";

describe("Fields", () => {
  it.each([
    {
      fieldName: "StringField",
      field: StringField,
      configuration: {
        maxLength: 10,
      } as StringFieldConfig,
      processor: StringFieldProcessor,
    },
    {
      fieldName: "IntegerField",
      field: IntegerField,
      configuration: {
        minValue: 10,
      } as IntegerFieldConfig,
      processor: IntegerFieldProcessor,
    },
    {
      fieldName: "BooleanField",
      field: BooleanField,
      configuration: {
        nullable: true,
      } as BooleanFieldConfig,
      processor: BooleanFieldProcessor,
    },
    {
      fieldName: "FloatField",
      field: FloatField,
      configuration: {
        minValue: 10,
      } as FloatFieldConfig,
      processor: FloatFieldProcessor,
    },
    {
      fieldName: "DateField",
      field: DateField,
      configuration: {
        formats: ["MM/dd/yyyy",],
      } as DateFieldConfig,
      processor: DateFieldProcessor,
    },
  ])(
    "Should register field successfully for $fieldName",
    ({ field, configuration, processor }) => {
      const propertyKey = "field";
      const target = SchemaMock;
      const registerFieldMock = jest
        .spyOn(fieldsUtils, "registerField")
        .mockImplementationOnce(() => {});

      field(configuration)(target, propertyKey);

      expect(registerFieldMock.mock.calls.length).toEqual(1);

      const [callTarget, callPropertyKey, callConfiguration, callProcessor] =
        registerFieldMock.mock.calls[0];

      expect(target).toEqual(callTarget);
      expect(propertyKey).toEqual(callPropertyKey);
      expect(configuration).toEqual(callConfiguration);
      expect(processor).toEqual(callProcessor);
    }
  );
  it("Should register nested field successfully for NestedField", () => {
    const field = NestedField;
    const propertyKey = "field";
    const configuration = {
      validator: SchemaMock,
    } as NestedFieldConfiguration<SchemaMock, unknown>;
    const target = SchemaMock;

    const registerFieldMock = jest
      .spyOn(fieldsUtils, "registerNestedSchemaField")
      .mockImplementationOnce(() => {});

    field(configuration)(target, propertyKey);

    expect(registerFieldMock.mock.calls.length).toEqual(1);

    const [callTarget, callPropertyKey, callConfiguration] =
      registerFieldMock.mock.calls[0];

    expect(target).toEqual(callTarget);
    expect(propertyKey).toEqual(callPropertyKey);
    expect(configuration).toEqual(callConfiguration);
  });
});
