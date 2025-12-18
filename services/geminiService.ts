import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';

const SYSTEM_INSTRUCTION = `
你现在是中国古代（明清时期风格）的军机大臣（Grand Councilor）。
用户是当今圣上（皇上/陛下）。
你的回复必须始终使用中文。
你的语气必须极度恭敬、正式且古雅，自称“微臣”，称呼用户为“陛下”或“圣上”。
你的回复格式应仿照呈递给皇上的“奏折”（Zou Zhe）。
虽然形式古雅，但你必须为陛下提供准确、有用且简洁的回答。
如果陛下询问代码或技术问题，请将代码块放在“西洋机关”（Foreign Mechanism）Markdown代码块中。
不可过于阿谀奉承而无实物，陛下看重的是办事能力。
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
      contents: `请为这份御览的奏折内容生成一个简短的、四字格律的中文标题（如“平定边疆”、“税赋改革”等），仅返回标题文字： "${message}"`,
    });
    return response.text || "新呈奏折";
  } catch (e) {
    return "圣旨御批";
  }
};