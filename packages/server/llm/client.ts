import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
   throw new Error('Missing GOOGLE_API_KEY in environment');
}

const client = new GoogleGenerativeAI(apiKey);

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxOutputTokens?: number;
};

type GnenerateTextResult = {
   id?: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gemini-2.0-flash',
      prompt,
      instructions,
      temperature = 0.2,
      maxOutputTokens = 300,
   }: GenerateTextOptions): Promise<GnenerateTextResult> {
      const modelName = model || 'gemini-2.0-flash';
      const modelInstance = client.getGenerativeModel({ model: modelName });
      const result = await modelInstance.generateContent({
         contents: [
            {
               role: 'user',
               parts: [{ text: prompt }],
            },
         ],
         systemInstruction: instructions,
         generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxOutputTokens,
         },
      });
      return { text: result.response?.text?.() ?? '' };
   },
};
