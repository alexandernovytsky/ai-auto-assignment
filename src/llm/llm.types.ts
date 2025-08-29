import type { JSONSchemaType } from 'ajv';

export interface LlmProvider {
  invoke<T extends object>(request: LlmRequest): Promise<LlmResponse<T>>;
}

export enum StopReason {
  Unknown = 'Unknown',
  EndTurn = 'End of turn',
  MaxTokens = 'Max tokens reached',
  StopSequence = 'Stop sequence triggered',
}

export interface LlmRequest {
  system: string;
  message: string;
  config: LlmConfig;
}

export interface LlmResponse<T> {
  content: T;
}

export interface LlmConfig {
  modelId: string;
}

export const llmConfigSchemaName = 'llmConfig';
export const llmConfigSchema: JSONSchemaType<LlmConfig> = {
  type: 'object',
  properties: {
    modelId: {
      type: 'string',
      enum: ['gemini-2.0-flash', 'gemini-2.5-flash'],
    },
  },
  required: ['modelId'],
  additionalProperties: false,
};
