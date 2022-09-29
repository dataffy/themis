<h1 align="center">Dataffy Themis - The advanced validation library</h1>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <p align="center">
    <i>Themis is a validation and processing library that helps you always make sure your data is correct.</i>
    <br/> 
    ·
    <a href="https://www.dataffy.com/">Dataffy</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Themis is a flexible validation library built on 3 layers used for validation. Each upper layer is based on the previous layer and adds extra functionality.

Layers from top to bottom:

- `Schema + Fields` - Used to validate and transform an entire object.
- `Processors` - Used to validate and transform a value. Uses validators behind the scene
- `Validators` - Used to validate a value against some requirements (e.g: max value, max length, etc.)

<!-- GETTING STARTED -->

## Getting Started

#### NPM

```bash
npm install @dataffy/themis
```

#### Yarn

```bash
yarn add @dataffy/themis
```

<!-- USAGE EXAMPLES -->

## Usage

### Schemas

Schemas are used to validate and transform an object to the desired representation

```typescript
import {
  DateField,
  IntegerField,
  FloatField,
  Schema,
  StringField,
} from "@dataffy/themis";

export type CreateEventPayload = {
  name: string;
  price: number;
  date: Date;
  maxCapacity: number;
};

export class CreateEventSchema extends Schema<CreateEventPayload> {
  @StringField({
    maxLength: 100,
  })
  name: string;

  @FloatField({
    minValue: 5.5,
  })
  price: number;

  @DateField({
    formats: ["dd/MM/yyyy"],
  })
  date: Date;

  @IntegerField({
    required: false,
    nullable: true,
    fromField: "max_capacity",
  })
  maxCapacity: number;
}

const payload = {
  name: "Dataffy Themis",
  price: 0,
  date: "01/01/2022",
  max_capacity: 40,
};
const createUserSchema = new CreateUserSchema(payload);

createUserSchema
  .validate()
  .then(() =>
    console.log(
      "Validation was successful. Use .toData() to get the validated data"
    )
  )
  .catch((error) => console.log("Validation failed"));

const validatedData = createUserSchema.toData();
```

### Fields

Fields are decorators used on Schema properties to annotate how the field needs to be processed. Behind the scenes, the fields specify which Processor is used for the field type.

Field Decorator Configuration:

- `fromField` - Specifies from which field the value will be taken, processed and placed in the property name. e.g: Using a decorator with fromField: `first_name` on a property `firstName` will process the value and place it in the `firstName` property on the validated data

Example implementation of a Decorator. This example can be used for creating custom decorators:

```typescript
export const StringField: ValidationField<StringFieldConfig> =
  (configuration?: DecoratorFieldConfig<StringFieldConfig>) =>
  (target: object, propertyKey: string): void => {
    registerField(target, propertyKey, configuration, StringFieldProcessor);
  };
```

### Nested Fields

Nested fields allow specifying a Schema that is used for validating and transforming the nested object.

```typescript
@NestedField({ schema: FileSchema })
profileImage: FileSchema;
```

### Processors

Processors are used to validate and transform a specific value into the desired one.

Generic Field Configurations:

- `required` - Specifies if the field is required. Default value is true
- `nullable` - Specifies if the field is nullable. Default value is true
- `validators` - Extra validators against which the value is checked

Each field can have extra field configurations.

| Field             | Processor          | Configuration                                                                                                                     |
|-------------------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `@StringField()`  | `StringProcessor`  | <ul><li>`maxLength` - The max length allowed for the field </li> <li>`minLength` - The min length allowed for the field</li></ul> |
| `@BooleanField()` | `BooleanProcessor` |                                                                                                                                   |
| `@DateField()`    | `DateProcessor`    | <ul><li>`formats` - Array with the accepted string formats for the date </li></ul>                                                |
| `@IntegerField()` | `IntegerProcessor` | <ul><li>`maxValue` - The max value allowed for the field </li> <li>`minValue` - The min value allowed for the field</li></ul>     |
| `@FloatField()`   | `FloatProcessor`   | <ul><li>`maxValue` - The max value allowed for the field </li> <li>`minValue` - The min value allowed for the field</li></ul>     |
| `@EmailField()`   | `EmailProcessor`   |                                                                                                                                   |
| `@JsonField()`    | `JsonProcessor`    |                                                                                                                                   |

Creating a custom processor:

```typescript
import { FieldProcessor, MinValueValidator } from "@dataffy/themis";

export type CustomFieldConfig = FieldConfig &
  Partial<{
    // Your field config
  }>;

export class CustomProcessor extends FieldProcessor<
  CustomFieldConfig,
  number,
  number
> {
  toInternalValue(data: number): number {
    // Validate value and transform it to expected response
  }

  initialiseValidators(): void {
    // Push validators into the validators property based on the configuration properties
    if (this.configuration.minValue) {
      this.validators.push(new MinValueValidator(this.configuration.minValue));
    }
  }
}
```

### Validators

Validators are the basic unit for the library. They are used for checking if a value matches the expected requirements.

```typescript
const maxLength = 50;
const validator = new MaxValueValidator(maxLength);
validator.validate(30);
```

<!-- LICENSE -->

## License

Distributed under the ISC License. See `LICENSE` for more information.

