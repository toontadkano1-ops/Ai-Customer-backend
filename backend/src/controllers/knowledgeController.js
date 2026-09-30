import { db } from '../database/db.js';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.string().default('General'),
  published: z.boolean().default(true)
});

export const knowledgeController = {
  list: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const { search, category } = req.query;

      let articles = await db.find('knowledge_articles', { business_id: businessId });

      if (category && category !== 'All') {
        articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const query = search.toLowerCase();
        articles = articles.filter(a =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
        );
      }

      res.json({ success: true, data: articles });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await db.findById('knowledge_articles', id);
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      res.json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const validated = articleSchema.parse(req.body);
      const businessId = req.user.business_id;

      const article = await db.insert('knowledge_articles', {
        business_id: businessId,
        title: validated.title,
        content: validated.content,
        category: validated.category,
        published: validated.published
      });

      res.status(201).json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await db.findById('knowledge_articles', id);
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      const updated = await db.update('knowledge_articles', id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await db.delete('knowledge_articles', id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      res.json({ success: true, message: 'Article deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};
