import type { LlmConfig, LlmProvider, LlmRequest } from '../llm/llm.types.js';
import type { LevelConfiguration } from './mode-configurations.types.js';
import type { Feedback } from '../analysis/analysis.types.js';
import { levelModeConfigurationsSystemPromptTemplate, levelModeConfigurationsUserPromptTemplate } from '../mode-configurations/mode-configurations.prompts.js';
import Mustache from 'mustache';
import { modeConfigurationsConfig } from './mode-configuration.consts.js';

export default class ModeConfigurationsService {
  constructor(private llmProvider: LlmProvider) {}

  public async analyseLevel(levelConfig: LevelConfiguration, llmConfig: LlmConfig): Promise<Feedback> {
    const msg = this.populateLevelConfigurationUserPrompt(levelConfig);
    const sys = this.populateLevelConfigurationSystemPrompt();

    const llmReq: LlmRequest = {
      config: llmConfig,
      system: sys,
      message: msg,
    };

    const llmRes = await this.llmProvider.invoke<Feedback>(llmReq);

    return llmRes.content;
  }

  private populateLevelConfigurationUserPrompt(levelConfig: LevelConfiguration): string {
    const prompt = Mustache.render(levelModeConfigurationsUserPromptTemplate, levelConfig);

    return prompt;
  }
  private populateLevelConfigurationSystemPrompt(): string {
    const systemPrompt = Mustache.render(levelModeConfigurationsSystemPromptTemplate, modeConfigurationsConfig);

    return systemPrompt;
  }
}
