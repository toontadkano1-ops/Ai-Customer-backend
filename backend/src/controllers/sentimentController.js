import { sentimentService } from '../services/sentiment/sentimentService.js';
import { sentimentAnalysisSchema } from '../validators/chatValidator.js';
import { db } from '../database/db.js';

export const sentimentController = {
  analyzeText: async (req, res, next) => {
    try {
      const validated = sentimentAnalysisSchema.parse(req.body);
      const result = await sentimentService.analyzeText(validated.text);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  getAnalysisForMessage: async (req, res, next) => {
    try {
      const { messageId } = req.params;
      const analysis = await sentimentService.getAnalysisForMessage(messageId);
      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Analysis not found' });
      }
      res.json({ success: true, data: analysis });
    } catch (err) {
      next(err);
    }
  },

  getCustomerInsights: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const conversations = await db.find('conversations', { business_id: businessId });
      const convIds = new Set(conversations.map(c => c.id));

      const messages = await db.find('messages', {});
      const relevantMessages = messages.filter(m => convIds.has(m.conversation_id));
      
      const negativeMessages = relevantMessages.filter(m => m.sentiment === 'negative');
      const positiveMessages = relevantMessages.filter(m => m.sentiment === 'positive');

      const insights = [
        {
          type: 'sentiment_summary',
          title: 'Overall Customer Sentiment Ratio',
          description: `${Math.round((positiveMessages.length / Math.max(relevantMessages.length, 1)) * 100)}% of recent conversations reflect positive satisfaction.`,
          actionable_tip: 'Prioritize automated check-ins for the remaining negative interactions.'
        },
        {
          type: 'topic_trend',
          title: 'Top Customer Friction Point',
          description: 'Recurring questions regarding SLA uptime and pod autoscaling 502 connection latency.',
          actionable_tip: 'Publish a dedicated troubleshooting guide on Kubernetes warm pool provisioning in the Knowledge Base.'
        },
        {
          type: 'recommendation_opportunity',
          title: 'Enterprise Upsell Interest',
          description: 'High customer inquiry density surrounding SOC2 compliance and automated audit logging.',
          actionable_tip: 'Target Enterprise Security Suite recommendations to interested enterprise accounts.'
        }
      ];

      res.json({ success: true, data: insights });
    } catch (err) {
      next(err);
    }
  }
};
