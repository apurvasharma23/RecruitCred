import { ChatContextPayload, ChatMessage } from '../../types/chat';
import { generateIntelligentFallbackResponse, AIResponseResult } from './fallbackResponses';
import { CREDAI_SYSTEM_PROMPT } from './systemPrompt';

export interface SendMessageOptions {
  userMessage: string;
  context: ChatContextPayload;
  history?: ChatMessage[];
}

export const sendChatMessage = async (
  options: SendMessageOptions
): Promise<AIResponseResult> => {
  const { userMessage, context, history = [] } = options;

  // Sanitize user message
  const cleanInput = userMessage.trim();
  if (!cleanInput) {
    return {
      content: 'Please enter a question or select one of the suggested topics below.'
    };
  }

  const aiApiUrl = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_AI_API_URL : undefined;
  const aiApiKey = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_AI_API_KEY : undefined;

  // If a secure backend proxy or direct endpoint is provided in environment variables:
  if (aiApiUrl && typeof aiApiUrl === 'string' && aiApiUrl.trim() !== '') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second safety timeout

    try {
      const response = await fetch(aiApiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(aiApiKey ? { Authorization: `Bearer ${aiApiKey}` } : {})
        },
        body: JSON.stringify({
          systemPrompt: CREDAI_SYSTEM_PROMPT,
          context,
          history: history.slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          message: cleanInput
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // Handle various standard backend AI response formats
        let replyText = '';
        if (typeof data.reply === 'string') {
          replyText = data.reply;
        } else if (typeof data.response === 'string') {
          replyText = data.response;
        } else if (typeof data.content === 'string') {
          replyText = data.content;
        } else if (typeof data.message === 'string') {
          replyText = data.message;
        } else if (typeof data.text === 'string') {
          replyText = data.text;
        } else if (Array.isArray(data.choices) && data.choices[0]?.message?.content) {
          replyText = data.choices[0].message.content;
        } else if (Array.isArray(data.candidates) && data.candidates[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
        }

        if (replyText.trim()) {
          return {
            content: replyText.trim(),
            quickReplies: Array.isArray(data.quickReplies) ? data.quickReplies : undefined,
            actionLink: data.actionLink
          };
        }
      } else {
        console.warn(`[CredAI] External AI service returned HTTP ${response.status}. Using internal intelligence engine.`);
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('[CredAI] External AI API timed out after 8s. Falling back to local intelligence engine.');
      } else {
        console.warn('[CredAI] External AI API unavailable. Falling back to local intelligence engine.', err);
      }
    }
  }

  // Graceful, intelligent data-aware local contextual intelligence response
  return generateIntelligentFallbackResponse(cleanInput, context);
};
