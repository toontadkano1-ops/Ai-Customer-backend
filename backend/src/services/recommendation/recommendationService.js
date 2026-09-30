import { db } from '../../database/db.js';

export const recommendationService = {
  getRecommendationsForCustomer: async (customerId, businessId) => {
    // 1. Fetch customer details and preferences
    const customer = await db.findById('customers', customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const bId = businessId || customer.business_id;

    // 2. Fetch business approved active products
    const products = await db.find('products', {
      business_id: bId,
      active: true
    });

    if (!products || products.length === 0) {
      return [];
    }

    // 3. Fetch past conversations and messages to extract topic interests
    const conversations = await db.find('conversations', { customer_id: customerId });
    const convIds = conversations.map(c => c.id);

    let customerKeywords = [];
    if (customer.preferences && Array.isArray(customer.preferences.interests)) {
      customerKeywords.push(...customer.preferences.interests.map(i => i.toLowerCase()));
    }

    // Check recent messages for affinity
    const allMessages = await db.find('messages', {});
    const customerMessages = allMessages.filter(m => convIds.includes(m.conversation_id) && m.sender_type === 'customer');
    customerMessages.forEach(m => {
      const text = m.content.toLowerCase();
      if (text.includes('kubernetes') || text.includes('k8s') || text.includes('cluster')) customerKeywords.push('cloud infrastructure');
      if (text.includes('security') || text.includes('soc2') || text.includes('compliance')) customerKeywords.push('security');
      if (text.includes('monitor') || text.includes('tracing') || text.includes('alert')) customerKeywords.push('ai observability');
      if (text.includes('api') || text.includes('gateway') || text.includes('latency')) customerKeywords.push('api gateway');
    });

    // 4. Score and rank products
    const scoredProducts = products.map(prod => {
      let score = 0;
      let matchedReason = '';

      const catLower = prod.category.toLowerCase();
      const descLower = (prod.description || '').toLowerCase();
      const nameLower = prod.name.toLowerCase();

      for (const kw of customerKeywords) {
        if (catLower.includes(kw) || kw.includes(catLower)) {
          score += 3;
          matchedReason = `Matched category interest: "${prod.category}"`;
        } else if (descLower.includes(kw) || nameLower.includes(kw)) {
          score += 2;
          matchedReason = `Matched query interest related to: "${kw}"`;
        }
      }

      if (!matchedReason) {
        matchedReason = `Recommended popular solution in ${prod.category} for enterprise scaling`;
      }

      return {
        product_id: prod.id,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        description: prod.description,
        reason: matchedReason,
        score
      };
    });

    // Sort descending by relevance score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Persist top recommendations into recommendations table
    const topRecs = scoredProducts.slice(0, 3);
    for (const rec of topRecs) {
      const existing = await db.findOne('recommendations', {
        customer_id: customerId,
        product_id: rec.product_id
      });

      if (!existing) {
        await db.insert('recommendations', {
          customer_id: customerId,
          product_id: rec.product_id,
          reason: rec.reason
        });
      }
    }

    return topRecs;
  }
};
