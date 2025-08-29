import type { LlmProvider, LlmRequest, LlmResponse } from '../llm.types.js';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';

export default class GeminiLlmProvider implements LlmProvider {
  private _ai: GoogleGenAI;

  constructor() {
    this._ai = new GoogleGenAI({});
  }
  async invoke<T>(req: LlmRequest): Promise<LlmResponse<T>> {
    let res: GenerateContentResponse;
    try {
      res = await this._ai.models.generateContent({
        model: req.config.modelId,
        contents: req.message,
        config: {
          systemInstruction: [req.system],
        },
      });

      if (!res.text) {
        throw new Error('Empty text in LLM response');
      }
      console.debug('LLM Response text: %s', res.text);
    } catch (e) {
      console.error(e);
      throw new Error('Failed call to Google LLM provider');
    }

    let llmRes: LlmResponse<T>;
    // remove ```json and \n from text response
    const startJson = res.text.indexOf('{');
    const endJson = res.text.lastIndexOf('}');
    const rawJson = res.text.substring(startJson, endJson + 1);
    console.debug(rawJson);
    try {
      const resJson: T = JSON.parse(rawJson);
      llmRes = { content: resJson };
    } catch (e) {
      throw new Error('Failed parsing LLM response text to JSON');
    }

    return llmRes;
  }
}
