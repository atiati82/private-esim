import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export type AIModel = 'gpt-4.1-mini' | 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-mini';

const DEFAULT_MODEL: AIModel = 'gpt-4.1-mini';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getConfiguredModel(): Promise<AIModel> {
  return DEFAULT_MODEL;
}

export async function chat(
  messages: ChatMessage[],
  options?: {
    model?: AIModel;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const model = options?.model || DEFAULT_MODEL;
  
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4000,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('[AI Client] Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function chatWithFunctions<T>(
  messages: ChatMessage[],
  tools: OpenAI.Chat.ChatCompletionTool[],
  executeFunction: (name: string, args: Record<string, unknown>) => Promise<T>,
  options?: {
    model?: AIModel;
    maxIterations?: number;
  }
): Promise<{ response: string; functionResults: Array<{ name: string; result: T }> }> {
  const model = options?.model || DEFAULT_MODEL;
  const maxIterations = options?.maxIterations || 5;
  const functionResults: Array<{ name: string; result: T }> = [];
  
  const conversationMessages: OpenAI.Chat.ChatCompletionMessageParam[] = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  let iterations = 0;
  let finalResponse = '';

  while (iterations < maxIterations) {
    iterations++;

    const response = await openai.chat.completions.create({
      model,
      messages: conversationMessages,
      tools,
      tool_choice: 'auto',
    });

    const message = response.choices[0]?.message;
    if (!message) break;

    if (message.tool_calls && message.tool_calls.length > 0) {
      conversationMessages.push({
        role: 'assistant',
        content: message.content || '',
        tool_calls: message.tool_calls,
      });

      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== 'function') continue;
        const fnName = toolCall.function.name;
        const fnArgs = JSON.parse(toolCall.function.arguments || '{}');
        
        const result = await executeFunction(fnName, fnArgs);
        functionResults.push({ name: fnName, result });

        conversationMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    } else {
      finalResponse = message.content || '';
      break;
    }
  }

  return { response: finalResponse, functionResults };
}

export { openai };
