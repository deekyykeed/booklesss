import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;

if (!apiKey) {
  throw new Error('Missing Gemini API key. Please check your .env file.');
}

// Initialize the Gemini AI client
export const genAI = new GoogleGenerativeAI(apiKey);

// Use Gemini 2.5 Flash for cost-effectiveness (~$0.42 per course)
export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
