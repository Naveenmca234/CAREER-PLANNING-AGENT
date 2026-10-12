/**
 * AI Service Integration - Supports Google Gemini & OpenAI-compatible APIs with Fallback Engine
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SYSTEM_CAREER_AGENT_PROMPT, buildAnalysisPrompt, buildRefinementPrompt } = require('./prompts');
const { generateFallbackCareerPlan, generateFallbackRefinement } = require('./fallbackAgent');

// Helper to sanitize JSON response from LLM
function cleanAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response from model');
  }

  let text = rawText.trim();

  // Remove markdown code fences ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
  }

  // Find first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(text);
}

class AIService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    this.geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.openaiBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  // Update keys dynamically (e.g. from UI settings or runtime)
  updateConfig({ geminiKey, openaiKey, geminiModel }) {
    if (geminiKey !== undefined) this.geminiApiKey = geminiKey.trim();
    if (openaiKey !== undefined) this.openaiApiKey = openaiKey.trim();
    if (geminiModel !== undefined) this.geminiModel = geminiModel.trim();
  }

  getStatus() {
    return {
      hasGeminiKey: Boolean(this.geminiApiKey),
      hasOpenaiKey: Boolean(this.openaiApiKey),
      geminiModel: this.geminiModel,
      activeProvider: this.geminiApiKey ? 'Google Gemini' : (this.openaiApiKey ? 'OpenAI / Compatible' : 'Expert Rule-Based Engine')
    };
  }

  async generateCareerPlan(studentData, clientApiKey = null) {
    const key = (clientApiKey && clientApiKey.trim()) || this.geminiApiKey;

    // If Gemini key is available, attempt Gemini generation
    if (key) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({
          model: this.geminiModel,
          systemInstruction: SYSTEM_CAREER_AGENT_PROMPT,
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            responseMimeType: "application/json"
          }
        });

        const prompt = buildAnalysisPrompt(studentData);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = cleanAndParseJSON(responseText);

        return {
          success: true,
          provider: `Google Gemini (${this.geminiModel})`,
          isAiGenerated: true,
          data: parsed
        };
      } catch (err) {
        console.warn('[AIService] Gemini API call failed, falling back to Expert Engine:', err.message);
        const fallback = generateFallbackCareerPlan(studentData);
        return {
          success: true,
          provider: 'Career Heuristic Expert Engine (Offline Fallback)',
          isAiGenerated: false,
          fallbackReason: `Live Gemini API encountered an error (${err.message}). Seamlessly switched to built-in Career Expert Engine.`,
          data: fallback
        };
      }
    }

    // If OpenAI key is available
    if (this.openaiApiKey) {
      try {
        const response = await fetch(`${this.openaiBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
          },
          body: JSON.stringify({
            model: this.openaiModel,
            messages: [
              { role: 'system', content: SYSTEM_CAREER_AGENT_PROMPT },
              { role: 'user', content: buildAnalysisPrompt(studentData) }
            ],
            temperature: 0.4,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error status: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        const parsed = cleanAndParseJSON(content);

        return {
          success: true,
          provider: `OpenAI / Custom (${this.openaiModel})`,
          isAiGenerated: true,
          data: parsed
        };
      } catch (err) {
        console.warn('[AIService] OpenAI API call failed, switching to fallback:', err.message);
      }
    }

    // Default to high-fidelity Expert Engine
    const fallback = generateFallbackCareerPlan(studentData);
    return {
      success: true,
      provider: 'Career Heuristic Expert Engine',
      isAiGenerated: false,
      infoNote: 'Running on built-in Career Strategy Engine. To use live Google Gemini AI, configure GEMINI_API_KEY in .env or the Settings panel.',
      data: fallback
    };
  }

  async refineCareerPlan(currentPlan, studentData, userFeedback, chatHistory = [], clientApiKey = null) {
    const key = (clientApiKey && clientApiKey.trim()) || this.geminiApiKey;

    if (key) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({
          model: this.geminiModel,
          systemInstruction: SYSTEM_CAREER_AGENT_PROMPT,
          generationConfig: {
            temperature: 0.5,
            topP: 0.9,
            responseMimeType: "application/json"
          }
        });

        const prompt = buildRefinementPrompt(currentPlan, studentData, userFeedback, chatHistory);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = cleanAndParseJSON(responseText);

        return {
          success: true,
          provider: `Google Gemini (${this.geminiModel})`,
          isAiGenerated: true,
          data: parsed
        };
      } catch (err) {
        console.warn('[AIService] Gemini refinement failed, using fallback:', err.message);
      }
    }

    const fallback = generateFallbackRefinement(currentPlan, studentData, userFeedback);
    return {
      success: true,
      provider: 'Career Heuristic Expert Engine',
      isAiGenerated: false,
      data: fallback
    };
  }
}

module.exports = new AIService();
