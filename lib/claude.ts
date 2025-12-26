import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY!;

if (!apiKey) {
  throw new Error('Missing Anthropic API key. Please check your .env file.');
}

// Initialize the Claude client
export const claude = new Anthropic({
  apiKey: apiKey,
});

/**
 * Generate content using Claude
 */
export async function generateContent(prompt: string): Promise<string> {
  const message = await claude.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text from response (message.content is an array of content blocks)
  const textParts: string[] = [];
  for (const block of message.content) {
    if (block.type === 'text') {
      textParts.push(block.text);
    }
  }

  if (textParts.length === 0) {
    throw new Error('No text content in Claude response');
  }

  return textParts.join('');
}

/**
 * Generate content with streaming (optional, for future use)
 */
export async function* generateContentStream(prompt: string): AsyncGenerator<string, void, unknown> {
  const stream = await claude.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      yield chunk.delta.text;
    }
  }
}

