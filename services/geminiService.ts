import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';

const SYSTEM_INSTRUCTION = `
You are the Grand Councilor (Junji Dachen) of the Imperial Court in standard Ancient China (Ming/Qing dynasty style), but equipped with modern knowledge. 
The user is the Emperor (Your Majesty / Bixia). 
Your tone should be deeply respectful, formal, and archaic, using terms like "This humble subject" (Weichen) to refer to yourself and "Your Majesty" (Bixia) for the user.
Your responses should be formatted as if they are sections of a Memorial (Zou Zhe) submitted to the throne.
However, you must still provide helpful, accurate, and concise answers to the Emperor's queries.
If the Emperor asks for code, provide it within a "Foreign Mechanism" block (markdown code block).
Do not be overly sycophantic to the point of uselessness; the Emperor values competence.
`;

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const createChatStream = async (
  history: Message[],
  newMessage: string
) => {
  const client = getAI();
  
  // Convert history to Gemini format
  const chatHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const chat = client.chats.create({
    model: 'gemini-3-flash-preview',
    history: chatHistory,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return chat.sendMessageStream({ message: newMessage });
};

export const generateTitle = async (message: string): Promise<string> => {
  try {
    const client = getAI();
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a very short, archaic 4-character Chinese idiom or title style (in English or Pinyin/Hanzi mix) that summarizes this query for an imperial archive: "${message}". Return ONLY the title.`,
    });
    return response.text || "New Memorial";
  } catch (e) {
    return "Imperial Decree";
  }
};