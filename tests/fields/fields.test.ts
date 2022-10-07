import {
  ArrayField,
  BooleanField,
  DateField,
  FloatField,
  IntegerField,
  JsonField,
  NestedField,
  NestedFieldConfiguration,
  StringField,
} from "../../src/fields";
import * as fieldsUtils from "../../src/fields/utils";
import { SchemaMock } from "../schemas/mocks/schema.mock";
import {
  ArrayFieldProcessor,
  BooleanFieldConfig,
  BooleanFieldProcessor,
  FloatFieldConfig,
  FloatFieldProcessor,
  IntegerFieldConfig,
  IntegerFieldProcessor,
  JsonFieldConfig,
  JsonFieldProcessor,
  StringFieldConfig,
  StringFieldProcessor,
} from "../../src/processors";
import { DateFieldConfig, DateFieldProcessor } from "../../src/processors";
import { faker } from "@faker-js/faker";
import { EmailFieldConfig, EmailFieldProcessor } from "../../src/processors";
import { EmailField } from "../../src/fields";

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
        formats: ["MM/dd/yyyy"],
      } as DateFieldConfig,
      processor: DateFieldProcessor,
    },
    {
      fieldName: "EmailField",
      field: EmailField,
      configuration: {
        maxLength: faker.datatype.number({ max: 5 }),
      } as EmailFieldConfig,
      processor: EmailFieldProcessor,
    },
    {
      fieldName: "JsonField",
      field: JsonField,
      configuration: {
        nullable: true,
      } as JsonFieldConfig,
      processor: JsonFieldProcessor,
    },
    {
      fieldName: "ArrayField",
      field: ArrayField,
      configuration: {
        child: StringFieldProcessor,
      },
      processor: ArrayFieldProcessor,
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

      expect(registerFieldMock).toBeCalledTimes(1);

      expect(registerFieldMock).toBeCalledWith(
        target,
        propertyKey,
        configuration,
        processor
      );
    }
  );
  it("Should register nested field successfully for NestedField", () => {
    const field = NestedField;
    const propertyKey = "field";
    const configuration = {
      schema: SchemaMock,
    } as NestedFieldConfiguration<SchemaMock, unknown>;
    const target = SchemaMock;

    const registerNestedSchemaField = jest
      .spyOn(fieldsUtils, "registerNestedSchemaField")
      .mockImplementationOnce(() => {});

    field(configuration)(target, propertyKey);

    expect(registerNestedSchemaField).toBeCalledTimes(1);
    expect(registerNestedSchemaField).toBeCalledWith(
      target,
      propertyKey,
      configuration
    );
  });
});
