import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.post('/api/analyze-image', async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured.' });
      }

      if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided.' });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: 'image/jpeg'
                }
              },
              {
                text: "Analise esta imagem e classifique o problema urbano em UMA das seguintes categorias exatas: ARVORE_CAIDA, BUEIRO, CALCADA, TAPA_BURACO, BARULHO_PSIU, FISCALIZACAO_POSTURA, MORADOR_RUA, DESFAZIMENTO. Se for um problema em via esburacada, retorne TAPA_BURACO. Se for lixo/entulho em bueiro, retorne BUEIRO. Retorne APENAS o nome da categoria, sem aspas, sem formatação e sem explicação adicional. Se não conseguir identificar, retorne FISCALIZACAO_POSTURA."
              }
            ]
          }
        ],
        config: {
          temperature: 0,
          maxOutputTokens: 32,
          httpOptions: {
            timeout: 30_000
          }
        }
      });

      const text = response.text?.trim() || 'FISCALIZACAO_POSTURA';
      
      // Validate category
      const validCategories = ['ARVORE_CAIDA', 'BUEIRO', 'CALCADA', 'TAPA_BURACO', 'BARULHO_PSIU', 'FISCALIZACAO_POSTURA', 'MORADOR_RUA', 'DESFAZIMENTO'];
      const category = validCategories.includes(text) ? text : 'FISCALIZACAO_POSTURA';

      res.json({ category });
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: 'Failed to analyze image' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
