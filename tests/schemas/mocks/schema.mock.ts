import { Schema } from "../../../src";
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
