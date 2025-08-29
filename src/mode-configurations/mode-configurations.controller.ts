import type { Request, Response } from 'express';
import ModeConfigurationsService from './mode-configurations.service.js';
import {
  levelConfigurationSchema,
  levelConfigurationSchemaName,
  type LevelConfigurationValidationRequest,
  type LevelConfigurationValidationResponse,
} from './mode-configurations.types.js';
import type SchemaValidator from '../validations/avj.validator.js';
import { llmConfigSchema, llmConfigSchemaName } from '../llm/llm.types.js';

export class ModeConfigurationsController {
  constructor(
    private schemaValidator: SchemaValidator,
    private service: ModeConfigurationsService,
  ) {}

  public validation = async (req: Request, res: Response) => {
    console.log('got request: %s', JSON.stringify(req.body));
    const body: LevelConfigurationValidationRequest = req.body;
    const levelValidationResult = this.schemaValidator.performValidation(levelConfigurationSchemaName, levelConfigurationSchema, body.levelConfig);
    const llmConfigValidationResult = this.schemaValidator.performValidation(llmConfigSchemaName, llmConfigSchema, body.llmConfig);

    const response: LevelConfigurationValidationResponse = {
      schema: {
        isValid: levelValidationResult.isValid && llmConfigValidationResult.isValid,
        errors: levelValidationResult.errors.concat(llmConfigValidationResult.errors),
      },
    };

    if (!response.schema.isValid) {
      res.json(response);
      return;
    }

    const feedback = await this.service.analyseLevel(body.levelConfig, body.llmConfig);
    response.feedback = feedback;

    res.json(response);
  };
}
