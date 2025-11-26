import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import router from './routes/router';

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
   throw new Error('Missing GOOGLE_API_KEY in environment');
}

const client = new GoogleGenerativeAI(apiKey);
const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Store chat history: conversationId -> messages[]
let conversations = new Map<string, any[]>();

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt, conversationId } = req.body;

   if (!prompt || !conversationId) {
      return res.status(400).send('Missing prompt or conversationId');
   }

   try {
      // Get existing conversation or create new
      let history = conversations.get(conversationId) || [];

      // Add user message
      history.push({
         role: 'user',
         parts: [{ text: prompt }],
      });

      // Send to Gemini
      const result = await model.generateContent({
         contents: history,
         generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 200,
         },
      });

      const reply = result.response.text();

      // Add assistant reply to history
      history.push({
         role: 'model',
         parts: [{ text: reply }],
      });

      // Save back
      conversations.set(conversationId, history);

      res.json({ message: reply });
   } catch (err: any) {
      console.error('Gemini error:', err?.message || err);
      res.status(500).json({ error: err?.message || 'Unknown Gemini error' });
   }
});

app.use('/api/v1', router);

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});
