import { aiProvider } from '../ai/aiProvider.js';
import { db } from '../../database/db.js';

export const sentimentService = {
  analyzeText: async (text) => {
    return aiProvider.analyzeSentiment(text);
  },

  analyzeAndRecordMessage: async (messageId, content) => {
    const analysis = await aiProvider.analyzeSentiment(content);

    const record = await db.insert('ai_analysis', {
      message_id: messageId,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      intent: analysis.intent,
      keywords: analysis.keywords
    });

    // Update message sentiment and intent directly
    await db.update('messages', messageId, {
      sentiment: analysis.sentiment,
      intent: analysis.intent
    });

    return { ...analysis, id: record.id };
  },

  getAnalysisForMessage: async (messageId) => {
    return db.findOne('ai_analysis', { message_id: messageId });
  }
};
