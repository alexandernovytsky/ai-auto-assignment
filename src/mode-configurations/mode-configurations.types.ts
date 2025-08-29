import type { ValidationResult } from '../validations/validation.types.js';
import type { JSONSchemaType } from 'ajv';
import { modeConfigurationDefaults } from './mode-configuration.consts.js';
import { type LlmConfig } from '../llm/llm.types.js';
import type { Feedback } from '../analysis/analysis.types.js';

export enum Difficulty {
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
}

export interface LevelConfigurationValidationRequest {
  llmConfig: LlmConfig;
  levelConfig: LevelConfiguration;
}

export interface LevelConfiguration {
  level: number;
  difficulty: Difficulty;
  reward: number;
  timeLimit: number;
}

export interface LevelConfigurationValidationResponse {
  schema: ValidationResult;
  feedback?: Feedback;
}

export const levelConfigurationSchemaName = 'LevelConfiguration';
export const levelConfigurationSchema: JSONSchemaType<LevelConfiguration> = {
  type: 'object',
  properties: {
    level: {
      type: 'integer',
      description: `The level number. [${modeConfigurationDefaults.minLevel}-${modeConfigurationDefaults.maxLevel}]`,
      minimum: modeConfigurationDefaults.minLevel,
      maximum: modeConfigurationDefaults.maxLevel,
    },
    difficulty: {
      type: 'string',
      enum: Object.values(Difficulty),
      description: `The level difficulty. (${Object.values(Difficulty).join(' | ')})`,
    },
    reward: {
      type: 'integer',
      description: `Amount of the reward for completing the level. [${modeConfigurationDefaults.minReward}-${modeConfigurationDefaults.maxReward}]`,
      minimum: modeConfigurationDefaults.minReward,
      maximum: modeConfigurationDefaults.maxReward,
    },
    timeLimit: {
      type: 'integer',
      description: `Time limit for the level in seconds [${modeConfigurationDefaults.minTimer}-${modeConfigurationDefaults.maxTimer}]`,
      minimum: modeConfigurationDefaults.minTimer,
      maximum: modeConfigurationDefaults.maxTimer,
    },
  },
  required: ['level', 'difficulty', 'reward', 'timeLimit'],
  additionalProperties: false,
};
