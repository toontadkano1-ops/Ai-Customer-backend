import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'fallback_development_secret_cx_intelligence_32chars!',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'gemini-3.8',
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    modelName: process.env.AI_MODEL_NAME || 'gemini-3.8-flash',
    confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD || '0.65'),
    autoEscalationSentimentThreshold: parseFloat(process.env.AUTO_ESCALATION_SENTIMENT_THRESHOLD || '-0.6')
  }
};
