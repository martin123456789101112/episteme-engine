import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

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
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            socrates: { type: SchemaType.STRING },
            platon: { type: SchemaType.STRING },
            aristoteles: { type: SchemaType.STRING },
            agustin: { type: SchemaType.STRING },
            escoto: { type: SchemaType.STRING },
            ockam: { type: SchemaType.STRING },
            descartes: { type: SchemaType.STRING },
            spinoza: { type: SchemaType.STRING },
            leibniz: { type: SchemaType.STRING },
            hobbes: { type: SchemaType.STRING },
            locke: { type: SchemaType.STRING },
            berkeley: { type: SchemaType.STRING },
            hume: { type: SchemaType.STRING },
            husserl: { type: SchemaType.STRING },
            heidegger: { type: SchemaType.STRING },
            kant: { type: SchemaType.STRING },
            comte: { type: SchemaType.STRING },
            nietzsche: { type: SchemaType.STRING },
            weber: { type: SchemaType.STRING }
          },
          required: [
            'socrates', 'platon', 'aristoteles', 'agustin', 'escoto', 'ockam',
            'descartes', 'spinoza', 'leibniz', 'hobbes', 'locke', 'berkeley',
            'hume', 'husserl', 'heidegger', 'kant', 'comte', 'nietzsche', 'weber'
          ]
        }
      }
    });

    const promptSystem = `
Actúa como un motor epistemológico. Analiza la siguiente premisa: "${premisa}".
Genera una explicación breve (1 o 2 frases) de cómo interpreta esta premisa cada uno de los 19 filósofos desde su postura filosófica.
`;

    const result = await model.generateContent(promptSystem);
    const data = JSON.parse(result.response.text());

    res.json(data);

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error al procesar el análisis.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
