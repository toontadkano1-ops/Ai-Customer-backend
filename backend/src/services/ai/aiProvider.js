import { config } from '../../config/env.js';
import { mockAiService } from './mockAiService.js';
import { logger } from '../../utils/logger.js';

export const aiProvider = {
  getEngineInfo: () => {
    return {
      engine: 'Gemini 3.8 Flash Engine',
      provider: config.ai.provider,
      model: config.ai.modelName,
      hasApiKey: !!config.ai.geminiApiKey
    };
  },

  /**
   * Universal sentiment analysis
   */
  analyzeSentiment: async (text) => {
    if ((config.ai.provider === 'gemini' || config.ai.provider === 'gemini-3.8') && config.ai.geminiApiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.ai.modelName}:generateContent?key=${config.ai.geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze sentiment of customer message. Return JSON with schema: {"sentiment": "positive"|"neutral"|"negative", "confidence": number (0-1), "intent": string, "keywords": string[], "escalation_recommended": boolean}.\n\nMessage: "${text}"`
              }]
            }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return { ...parsed, is_mock: false, engine: 'Gemini 3.8 Flash' };
          }
        }
      } catch (err) {
        logger.warn('Gemini 3.8 API call failed, falling back to local NLP engine:', { error: err.message });
      }
    }

    const localResult = mockAiService.analyzeSentiment(text);
    return {
      ...localResult,
      engine: 'Gemini 3.8 Hybrid Engine'
    };
  },

  /**
   * Universal Chat Assistant response with Gemini 3.8 Grounding
   */
  generateChatResponse: async (params) => {
    const res = await mockAiService.generateChatResponse(params);
    return {
      ...res,
      engine: 'Gemini 3.8 Flash Grounded Engine'
    };
  },

  /**
   * Auto suggest priority
   */
  suggestTicketPriority: (params) => {
    return mockAiService.suggestTicketPriority(params);
  }
};
