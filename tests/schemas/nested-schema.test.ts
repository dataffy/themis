import { NestedSchema, SimpleSchema } from "./mocks/schema.mock";
import { faker } from "@faker-js/faker";
import { ValidationError } from "../../src";

describe("Schema", () => {
  describe("Nested Schema", () => {
    it("should throw error missing nested field and required field", async () => {
      const data = {
        firstName: faker.datatype.string(),
        simpleSchema: {
          firstName: faker.datatype.string(),
          active: faker.datatype.boolean(),
        },
      };
      jest
        .spyOn(SimpleSchema.prototype, "validateFunc")
        .mockImplementation(async (): Promise<void> => {});

      const schema = new NestedSchema(data, {}, { partialValidation: false });
      try {
        await schema.validate();
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect((e as ValidationError).errors).toEqual({
          simpleSchema: { age: ["Value is required"] },
        });
      }
    });
    it("should throw error missing nested schema if required", async () => {
      const data = {
        firstName: faker.datatype.string(),
        otherSimpleSchema: {
          firstName: faker.datatype.string(),
          age: faker.datatype.number(),
          active: faker.datatype.boolean(),
        },
      };
      jest
        .spyOn(SimpleSchema.prototype, "validateFunc")
        .mockImplementation(async (): Promise<void> => {});

      const schema = new NestedSchema(data, {}, { partialValidation: false });
      try {
        await schema.validate();
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect((e as ValidationError).errors).toEqual({
          simpleSchema: ["Missing field simpleSchema"],
        });
      }
    });

    it("should throw error missing nested field and not required field", async () => {
      const data = {
        firstName: faker.datatype.string(),
        simpleSchema: {
          firstName: faker.datatype.string(),
          age: faker.datatype.number(),
          active: faker.datatype.boolean(),
        },
        otherSimpleSchema: {
          firstName: faker.datatype.string(),
          active: faker.datatype.boolean(),
        },
      };

      jest
        .spyOn(SimpleSchema.prototype, "validateFunc")
        .mockImplementation(async (): Promise<void> => {});

      const schema = new NestedSchema(data, {}, { partialValidation: false });
      try {
        await schema.validate();
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect((e as ValidationError).errors).toEqual({
          otherSimpleSchema: { age: ["Value is required"] },
        });
      }
    });

    it("should throw error missing nested field and not required field", async () => {
      const data = {
        firstName: faker.datatype.string(),
        simpleSchema: {
          firstName: faker.datatype.string(),
          age: faker.datatype.number(),
          active: faker.datatype.boolean(),
        },
        otherSimpleSchema: {
          firstName: faker.datatype.string(),
          active: faker.datatype.boolean(),
          age: faker.datatype.number(),
        },
      };

      jest
        .spyOn(SimpleSchema.prototype, "validateFunc")
        .mockImplementation(async (): Promise<void> => {
          throw new Error("Failed!");
        });

      const schema = new NestedSchema(data, {}, { partialValidation: false });
      try {
        await schema.validate();
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toEqual(new Error("Failed!"));
      }
    });
  });
});
