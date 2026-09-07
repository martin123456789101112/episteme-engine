import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analizar', async (req, res) => {
  const { premisa } = req.body;

  if (!premisa) {
    return res.status(400).json({ error: 'La premisa es requerida.' });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const promptSystem = `
Actúa como un motor epistemológico interactivo. Interpreta la siguiente premisa ingresada por el usuario: "${premisa}".

Tu tarea es hacer que cada uno de los 19 filósofos reaccione e interprete esta premisa en 1 o 2 frases concisas y directas.

Devuelve UNICAMENTE un objeto JSON donde cada clave sea el ID del filósofo exacto:

{
  "socrates": "...",
  "platon": "...",
  "aristoteles": "...",
  "agustin": "...",
  "escoto": "...",
  "ockam": "...",
  "descartes": "...",
  "spinoza": "...",
  "leibniz": "...",
  "hobbes": "...",
  "locke": "...",
  "berkeley": "...",
  "hume": "...",
  "husserl": "...",
  "heidegger": "...",
  "kant": "...",
  "comte": "...",
  "nietzsche": "...",
  "weber": "..."
}
`;

    const result = await model.generateContent(promptSystem);
    const textResponse = result.response.text();
    const data = JSON.parse(textResponse);

    res.json(data);

  } catch (error) {
    console.error('Error al generar análisis:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar el análisis.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
