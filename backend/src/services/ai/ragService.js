import { db } from '../../database/db.js';

export const ragService = {
  /**
   * Search knowledge base for relevant articles belonging to the business
   * Grounded search that prevents hallucinations
   */
  findRelevantArticles: async (businessId, queryText, limit = 3) => {
    const articles = await db.find('knowledge_articles', {
      business_id: businessId,
      published: true
    });

    if (!articles || articles.length === 0) {
      return { matches: [], highestConfidence: 0.0 };
    }

    const queryWords = queryText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);

    const scored = articles.map(art => {
      const titleLower = art.title.toLowerCase();
      const contentLower = art.content.toLowerCase();
      const categoryLower = art.category.toLowerCase();

      let matchCount = 0;
      let titleHits = 0;

      queryWords.forEach(word => {
        if (titleLower.includes(word)) {
          titleHits += 2;
        }
        if (categoryLower.includes(word)) {
          matchCount += 1.5;
        }
        const regex = new RegExp(`\\b${word}`, 'gi');
        const count = (contentLower.match(regex) || []).length;
        matchCount += Math.min(count, 4);
      });

      // Relevance score calculation (0.0 to 1.0)
      const rawScore = (titleHits * 2.5 + matchCount) / Math.max(queryWords.length * 2, 1);
      const confidence = Math.min(Math.round(rawScore * 100) / 100, 0.98);

      return {
        article: art,
        confidence,
        title: art.title,
        id: art.id,
        snippet: art.content.length > 200 ? art.content.slice(0, 200) + '...' : art.content
      };
    });

    scored.sort((a, b) => b.confidence - a.confidence);

    const topMatches = scored.filter(item => item.confidence > 0.25).slice(0, limit);
    const highestConfidence = topMatches.length > 0 ? topMatches[0].confidence : 0.0;

    return {
      matches: topMatches,
      highestConfidence
    };
  }
};
