import Groq from 'groq-sdk';

// GROQ_API_KEY is injected at startup via `--env-file=../.env` in package.json dev script.
// Do NOT call dotenv.config() here — it would look for .env in server/ (not found)
// and silently leave the key undefined, breaking auth.
if (!process.env.GROQ_API_KEY) {
  throw new Error(
    '[aiGateway] GROQ_API_KEY is not set.\n' +
    '  → Make sure your root .env file has GROQ_API_KEY=gsk_... and restart the server.\n' +
    '  → Get a fresh key at https://console.groq.com/keys'
  );
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 60000,
  maxRetries: 0
});

// Dual failover strategy: fast model for simple tasks, robust model for complex formatting
// Updated August 2026 — all prior llama/mixtral models have been decommissioned by Groq.
const MODELS = {
  FAST: 'openai/gpt-oss-20b',        // Fast inference for basic extraction
  ROBUST: 'openai/gpt-oss-120b',     // High reasoning for rewriting and scoring
  BACKUP: 'qwen/qwen3.6-27b'         // Failover
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
