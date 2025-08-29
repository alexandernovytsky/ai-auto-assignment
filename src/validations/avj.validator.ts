import avj from 'ajv';
import type { Ajv, JSONSchemaType, ValidateFunction } from 'ajv';
import type { ValidationResult } from './validation.types.js';

export default class SchemaValidator {
  private ajv: Ajv;
  private validators: Map<string, ValidateFunction> = new Map();

  public constructor() {
    this.ajv = new avj({
      allErrors: true,
      removeAdditional: true,
      // useDefaults: true,
      coerceTypes: true,
    });
  }

  public getOrCompileSchema<T>(schemaName: string, schema: JSONSchemaType<T>): ValidateFunction<T> {
    if (this.validators.has(schemaName)) {
      return this.validators.get(schemaName) as ValidateFunction<T>;
    }

    const validator = this.ajv.compile(schema);
    this.validators.set(schemaName, validator);
    return validator;
  }

  public getValidator<T>(schemaName: string): ValidateFunction<T> | undefined {
    return this.validators.get(schemaName) as ValidateFunction<T>;
  }

  public performValidation<T>(schemaName: string, schema: JSONSchemaType<T>, object: T): ValidationResult {
    const validator = this.getOrCompileSchema(schemaName, schema);
    const isValid = validator(object);

    if (isValid) {
      return { isValid: true, errors: [] };
    }

    const errors =
      validator.errors?.map((error) => ({
        field: error.instancePath || error.schemaPath.replace('#/', ''),
        message: error.message || 'Validation error',
        value: error.data,
      })) || [];

    return {
      isValid: false,
      errors,
    };
  }
}
