import { container } from 'tsyringe';
import type { LlmProvider } from './llm/llm.types.js';
import SchemaValidator from './validations/avj.validator.js';
import ModeConfigurationsService from './mode-configurations/mode-configurations.service.js';
import { ModeConfigurationsController } from './mode-configurations/mode-configurations.controller.js';
import GeminiLlmProvider from './llm/google/llm.gemini.js';

container.registerSingleton('SchemaValidator', SchemaValidator);

// Mode Configuration
container.register<LlmProvider>('ModeConfigurationsLlmProvider', { useClass: GeminiLlmProvider });
container.register(ModeConfigurationsService, {
  useFactory: (c) => new ModeConfigurationsService(c.resolve('ModeConfigurationsLlmProvider')),
});
container.register(ModeConfigurationsController, {
  useFactory: (c) => new ModeConfigurationsController(c.resolve('SchemaValidator'), c.resolve(ModeConfigurationsService)),
});

export default container;
