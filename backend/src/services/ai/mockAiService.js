import { ragService } from './ragService.js';
import { db } from '../../database/db.js';

export const mockAiService = {
  /**
   * Deterministic NLP Sentiment & Intent Analyzer
   */
  analyzeSentiment: (text) => {
    const textLower = text.toLowerCase();

    const negativeKeywords = [
      'terrible', 'worst', 'horrible', 'broken', 'error', 'crashed', 'bug', 'angry',
      'unacceptable', 'slow', 'fail', 'failed', 'failing', 'awful', 'hate', 'disappointed',
      'waste', 'cancel', 'refund', 'scam', 'useless', 'frustrated', 'outage', 'down', 'complaint',
      'kharab', 'problem', 'dikkat', 'gadbad', 'kam nahi kar raha', 'nahi chal raha'
    ];

    const positiveKeywords = [
      'great', 'love', 'excellent', 'fast', 'awesome', 'amazing', 'perfect', 'helpful',
      'thank', 'thanks', 'appreciate', 'smooth', 'good', 'super', 'wonderful', 'resolved', 'fixed',
      'badhiya', 'shukriya', 'achha', 'sahi hai', 'mast'
    ];

    const matchedNegative = negativeKeywords.filter(k => textLower.includes(k));
    const matchedPositive = positiveKeywords.filter(k => textLower.includes(k));

    let sentiment = 'neutral';
    let confidence = 0.85;
    let escalationRecommended = false;

    if (matchedNegative.length > matchedPositive.length) {
      sentiment = 'negative';
      confidence = Math.min(0.75 + matchedNegative.length * 0.08, 0.99);
      if (confidence >= 0.80 || matchedNegative.some(w => ['cancel', 'unacceptable', 'crashed', 'outage', 'kam nahi kar raha'].includes(w))) {
        escalationRecommended = true;
      }
    } else if (matchedPositive.length > matchedNegative.length) {
      sentiment = 'positive';
      confidence = Math.min(0.78 + matchedPositive.length * 0.07, 0.99);
    } else {
      sentiment = 'neutral';
      confidence = 0.85;
    }

    // Intent detection
    let intent = 'general';
    if (/^(hi|hello|hey|namaste|greetings|good morning|good evening|kaise ho|help|madad)/i.test(textLower.trim())) {
      intent = 'greeting';
    } else if (/refund|money back|billing|charge|invoice|payment|pricing|cost|paisa/i.test(textLower)) {
      intent = textLower.includes('refund') ? 'refund_request' : 'billing_inquiry';
    } else if (/sla|uptime|downtime|outage|maintenance|guarantee|availability/i.test(textLower)) {
      intent = 'sla_inquiry';
    } else if (/error|502|crash|bug|fail|broken|deploy|k8s|kubernetes|api|timeout|down|nahi chal raha/i.test(textLower)) {
      intent = 'technical_issue';
    } else if (/recommend|suggest|product|service|catalog|plan|solution|offer/i.test(textLower)) {
      intent = 'product_recommendation';
    } else if (/unacceptable|terrible|bad service|manager|complaint|shikayat/i.test(textLower)) {
      intent = 'complaint';
    }

    const allKeywords = [...new Set([...matchedNegative, ...matchedPositive])];

    return {
      sentiment,
      confidence: parseFloat(confidence.toFixed(3)),
      intent,
      keywords: allKeywords,
      escalation_recommended: escalationRecommended,
      is_mock: true
    };
  },

  /**
   * Grounded Chatbot Response Engine
   */
  generateChatResponse: async ({ businessId, message, conversationHistory = [], customerName = 'there' }) => {
    const textLower = message.toLowerCase().trim();
    const analysis = mockAiService.analyzeSentiment(message);

    // 1. Handle Greetings / Pleasantries warmly
    if (analysis.intent === 'greeting' || /^(hi|hello|hey|help|kya kar sakte ho)/i.test(textLower)) {
      return {
        content: `Hello ${customerName}! 👋 Welcome to **CX Intelligence**. \n\nI can help you with:\n- **Official SLA & Uptime Policies** (99.99% monthly guarantee)\n- **Billing & 30-Day Refund Terms**\n- **Smart Product Recommendations** (Kubernetes Mesh, SOC2 Shield, Observability)\n- **API Quotas & Rate Limits**\n- **Live Human Support Escalation**\n\nHow can I assist you today?`,
        sentiment: 'positive',
        intent: 'greeting',
        confidence: 0.99,
        sources: [],
        is_uncertain: false,
        suggested_actions: ['Enterprise SLA Policy', 'Subscription & Refund Terms', 'Recommend Kubernetes Mesh', 'API Quotas'],
        escalation_recommended: false
      };
    }

    // 2. Handle Product Recommendations directly with catalog data
    if (analysis.intent === 'product_recommendation' || /recommend|suggest|product|solution/i.test(textLower)) {
      const products = await db.find('products', { business_id: businessId, active: true });
      const itemsList = products.map(p => `• **${p.name}** ($${Number(p.price).toFixed(2)}/mo): ${p.description}`).join('\n');

      return {
        content: `Based on your business needs, here are our recommended, verified enterprise solutions:\n\n${itemsList}\n\nYou can configure and deploy any of these solutions directly from the **Recommendations** tab!`,
        sentiment: 'positive',
        intent: 'product_recommendation',
        confidence: 0.95,
        sources: [{ id: 'catalog', title: 'Apex Cloud Verified Product Catalog', category: 'Products' }],
        is_uncertain: false,
        suggested_actions: ['Deploy Kubernetes Mesh', 'View SOC2 Security Suite', 'Open Recommendations Page'],
        escalation_recommended: false
      };
    }

    // 3. Query Knowledge Base for grounded RAG
    const { matches, highestConfidence } = await ragService.findRelevantArticles(businessId, message);

    let reply = '';
    let sources = [];
    let isUncertain = false;
    let suggestedActions = [];

    // Grounding check
    if (highestConfidence >= 0.25 && matches.length > 0) {
      const topArticle = matches[0].article;
      sources.push({
        id: topArticle.id,
        title: topArticle.title,
        category: topArticle.category
      });

      if (analysis.intent === 'sla_inquiry' || /sla|uptime|guarantee/i.test(textLower)) {
        reply = `According to our official **${topArticle.title}**:\n\n> Apex Cloud guarantees a **99.99% monthly uptime** for all Enterprise tier subscriptions. Scheduled maintenance is announced 72 hours in advance during off-peak weekend windows (02:00 - 04:00 UTC). Outages exceeding 0.01% trigger automatic SLA billing credits upon request.`;
        suggestedActions = ['Request SLA Credit', 'Check Maintenance Schedule', 'Escalate to Support'];
      } else if (analysis.intent === 'refund_request' || analysis.intent === 'billing_inquiry' || /refund|billing|invoice|cancel/i.test(textLower)) {
        reply = `Based on our verified **${topArticle.title}**:\n\n> All subscription plans offer a **30-day money-back guarantee** for first-time customers. Renewal charges are non-refundable after 7 days from the invoice date. Annual subscriptions can be cancelled with prorated credits applied to future billing cycles.`;
        suggestedActions = ['Open Billing Ticket', 'View Invoices', 'Speak with Billing Agent'];
      } else if (analysis.intent === 'technical_issue' || /api|rate|quota|limit/i.test(textLower)) {
        reply = `Per **${topArticle.title}**:\n\n> ${topArticle.content}`;
        suggestedActions = ['Escalate to DevOps Support', 'Run Health Diagnostics', 'Create Support Ticket'];
      } else {
        reply = `Here is what I found in our official business documentation (**${topArticle.title}**):\n\n> ${topArticle.content}\n\nPlease let me know if you would like me to open a ticket or connect you with an engineer for further clarification!`;
        suggestedActions = ['Ask Follow-up', 'Explore Documentation', 'Contact Human Support'];
      }
    } else {
      // Grounding Fallback: Chatbot does NOT hallucinate policies or pricing
      isUncertain = true;
      reply = `I searched our verified business documentation, but could not find an approved policy covering: "${message}". \n\nTo ensure complete accuracy, I have avoided making unconfirmed assumptions. Would you like me to connect you with our human support engineers or open a priority support ticket?`;
      suggestedActions = ['Connect with Human Agent', 'Create Support Ticket', 'Search Knowledge Base'];
    }

    return {
      content: reply,
      sentiment: analysis.sentiment,
      intent: analysis.intent,
      confidence: highestConfidence > 0 ? highestConfidence : 0.70,
      sources,
      is_uncertain: isUncertain,
      suggested_actions: suggestedActions,
      escalation_recommended: analysis.escalation_recommended || isUncertain
    };
  },

  /**
   * Auto-suggest ticket priority based on text urgency & sentiment
   */
  suggestTicketPriority: ({ subject = '', description = '', sentiment = 'neutral' }) => {
    const text = `${subject} ${description}`.toLowerCase();

    if (
      /outage|down|critical|data loss|security breach|vulnerability|emergency/i.test(text) ||
      (sentiment === 'negative' && /fatal|crashed|urgent|immediately|kam nahi kar raha/i.test(text))
    ) {
      return { priority: 'urgent', reason: 'High critical keywords and severe negative sentiment detected' };
    }

    if (
      /502|error|broken|failing|blocker|cannot login|stopped working|nahi chal raha/i.test(text) ||
      sentiment === 'negative'
    ) {
      return { priority: 'high', reason: 'Service disruption or customer dissatisfaction detected' };
    }

    if (/billing|invoice|slow|request|access|feature|question/i.test(text)) {
      return { priority: 'medium', reason: 'Standard operational or billing inquiry' };
    }

    return { priority: 'low', reason: 'Routine inquiry with standard SLA timeline' };
  }
};
