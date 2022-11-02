import { NestedField, Schema } from "../../../src";
import { StringField, IntegerField, BooleanField } from "../../../src";

export class SchemaMock extends Schema<unknown> {}

export type SimplePayload = {
  firstName: string;
  age: number;
  active: boolean;
};

export class SimpleSchema extends Schema<SimplePayload> {
  @StringField()
  firstName: string;

  @IntegerField()
  age: number;

  @BooleanField()
  active: boolean;
}

export type NestedPayload = {
  firstName: string;
  simpleSchema: SimplePayload;
  otherSimpleSchema: SimplePayload;
};

export class NestedSchema extends Schema<NestedPayload> {
  @StringField()
  firstName: string;

  @NestedField({ schema: SimpleSchema, required: true })
  simpleSchema: SimplePayload;

  @NestedField({ schema: SimpleSchema, required: false })
  otherSimpleSchema: SimplePayload;
}
