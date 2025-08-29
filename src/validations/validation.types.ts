export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    value: unknown;
  }>;
}
