import api from './api.js';

export const chatService = {
  sendMessage: async ({ conversation_id, customer_id, message }) => {
    return api.post('/chat/message', { conversation_id, customer_id, message });
  },

  getConversations: async () => {
    return api.get('/chat/conversations');
  },

  getConversationById: async (id) => {
    return api.get(`/chat/conversations/${id}`);
  },

  replyToConversation: async (id, content) => {
    return api.post(`/chat/conversations/${id}/messages`, { content });
  },

  updateConversationStatus: async (id, status) => {
    return api.patch(`/chat/conversations/${id}`, { status });
  },

  escalate: async ({ conversation_id, reason }) => {
    return api.post('/chat/escalate', { conversation_id, reason });
  },

  submitFeedback: async ({ customer_id, conversation_id, rating, comment }) => {
    return api.post('/chat/feedback', { customer_id, conversation_id, rating, comment });
  }
};
