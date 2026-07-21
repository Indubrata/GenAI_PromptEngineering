import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Dual failover strategy: fast model for simple tasks, robust model for complex formatting
const MODELS = {
  FAST: 'llama-3.1-8b-instant', // Fast inference for basic extraction
  ROBUST: 'llama-3.3-70b-versatile', // High reasoning for rewriting and scoring
  BACKUP: 'mixtral-8x7b-32768' // Failover
};

/**
 * Core AI Gateway function that implements the dual-failover architecture
 */
export async function generateCompletion(systemPrompt, userPrompt, useRobustModel = true, jsonMode = true) {
  const primaryModel = useRobustModel ? MODELS.ROBUST : MODELS.FAST;
  
  try {
    return await attemptCompletion(systemPrompt, userPrompt, primaryModel, jsonMode);
  } catch (error) {
    console.warn(`Primary model (${primaryModel}) failed. Attempting failover to ${MODELS.BACKUP}...`);
    try {
      return await attemptCompletion(systemPrompt, userPrompt, MODELS.BACKUP, jsonMode);
    } catch (fallbackError) {
      console.error('All AI models failed in the gateway.', fallbackError);
      throw new Error('AI Gateway Error: Unable to process request at this time.');
    }
  }
}

async function attemptCompletion(systemPrompt, userPrompt, model, jsonMode) {
  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: model,
    temperature: 0.3, // Low temperature for deterministic resume analysis
    response_format: jsonMode ? { type: 'json_object' } : { type: 'text' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Groq API');
  }

  if (jsonMode) {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse JSON response from Groq:', content);
      throw new Error('AI Gateway Error: Invalid JSON returned.');
    }
  }

  return content;
}
