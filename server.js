import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analizar', async (req, res) => {
  const { premisa } = req.body;

  if (!premisa) {
    return res.status(400).json({ error: 'La premisa es requerida.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptSystem = `
Actúa como un motor epistemológico interactivo. Interpreta la siguiente premisa planteada por el usuario: "${premisa}".

Tu tarea es hacer que cada uno de los siguientes 8 filósofos reaccione e interprete ESTA PREMISA ESPECÍFICA en PRIMERA PERSONA o mediante su razonamiento directo. 
IMPORTANTE:
- NO digas cosas como "Sócrates cuestionaría esto mediante la mayéutica..." o "Platón dice que...".
- En su lugar, haz que el filósofo HAGA el cuestionamiento o el análisis directamente.
- Aplica rigurosamente la doctrina y el lenguaje técnico de cada uno adaptado a la frase.

Instrucciones por filósofo:
1. "socrates": Haz la pregunta mayéutica directa e incisiva que pone en duda lo que el usuario da por sentado sobre su premisa. (Ej: "¿Afirmas que ves X, pero acaso tus ojos te muestran la esencia de X o solo un reflejo efímero?").
2. "platon": Explica directamente cómo la premisa es una mera sombra (doxa/mundo sensible) y cuál es la Idea eterna e inteligible a la que intenta aspirar.
3. "aristoteles": Analiza directamente las causas (material, formal, eficiente, final) o el proceso de abstracción empírica a partir de la experiencia sensible de la premisa.
4. "agustin": Explica directamente cómo la percepción humana de la premisa es falible y solo alcanza la verdad suprema mediante la iluminación divina.
5. "descartes": Aplica directamente la duda metódica sobre la premisa: ¿puedes dudar de esto? ¿Es una intuición clara y distinta o un engaño de los sentidos/genio maligno?
6. "locke": Descompón la premisa en ideas simples de sensación e ideas complejas de reflexión, demostrando cómo la mente era una 'tabla rasa' antes de esta experiencia.
7. "kant": Examina directamente la premisa usando las intuiciones a priori (espacio y tiempo) y las categorías del entendimiento (demostrando que conocemos el fenómeno, no el noúmeno).
8. "nietzsche": Destruye o deconstruye la premisa con tono crítico y punzante, exponiéndola como una mera metáfora del lenguaje, una perspectiva o una construcción de la voluntad de poder.

Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin bloques markdown de código de tipo \`\`\`json) estructurado así:
{
  "socrates": "...",
  "platon": "...",
  "aristoteles": "...",
  "agustin": "...",
  "descartes": "...",
  "locke": "...",
  "kant": "...",
  "nietzsche": "..."
}
`;

    const result = await model.generateContent(promptSystem);
    const textResponse = result.response.text().trim();
    
    // Limpieza del bloque JSON
    const cleanedJson = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const data = JSON.parse(cleanedJson);

    res.json(data);

  } catch (error) {
    console.error('Error al generar análisis:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar el análisis filosófico.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
