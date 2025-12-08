export type WritingStyleId = 'concise' | 'detailed' | 'simple' | 'casual' | 'formal' | 'visual';

export interface WritingStyle {
  id: WritingStyleId;
  name: string;
  description: string;
  emoji: string;
  prompt: string;
}

export const WRITING_STYLES: Record<WritingStyleId, WritingStyle> = {
  concise: {
    id: 'concise',
    name: 'Concise',
    description: 'Brief bullet points, key facts only',
    emoji: '⚡',
    prompt: 'Rewrite in concise bullet points. Focus on key facts and main ideas only.',
  },

  detailed: {
    id: 'detailed',
    name: 'Detailed',
    description: 'Comprehensive explanations with examples',
    emoji: '📚',
    prompt: 'Provide detailed explanations with examples and context. Be thorough.',
  },

  simple: {
    id: 'simple',
    name: 'Simple (ELI5)',
    description: 'Explain like I\'m 5, easy to understand',
    emoji: '🎈',
    prompt: 'Explain in very simple terms as if teaching a beginner. Use analogies and avoid jargon.',
  },

  casual: {
    id: 'casual',
    name: 'Casual',
    description: 'Conversational and friendly tone',
    emoji: '💬',
    prompt: 'Write in a casual, conversational tone. Make it engaging and friendly.',
  },

  formal: {
    id: 'formal',
    name: 'Formal',
    description: 'Academic and professional language',
    emoji: '🎓',
    prompt: 'Use formal academic language. Maintain professional tone and precise terminology.',
  },

  visual: {
    id: 'visual',
    name: 'Visual',
    description: 'Diagrams, charts, and structured layouts',
    emoji: '📊',
    prompt: 'Structure content visually with tables, comparisons, and clear hierarchies.',
  },
};

export const WRITING_STYLES_ARRAY = Object.values(WRITING_STYLES);
