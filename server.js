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
Actúa como un profesor experto en epistemología e historia de la filosofía. 
Analiza de forma ultra-específica la siguiente premisa planteada por el usuario: "${premisa}".

Tu objetivo es explicar la posición epistemológica de 8 filósofos frente a ESTA premisa en particular. 
Evita frases genéricas o resúmenes de libros. Conecta directamente la premisa con sus conceptos clave.

Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin bloques markdown de código de tipo \`\`\`json) con la siguiente estructura y requisitos para cada uno:

1. "socrates": Aplica la mayéutica. Plantea una pregunta punzante directa que desmonte los supuestos de la premisa.
2. "platon": Explica por qué esta premisa pertenece al mundo sensible (doxa/sombra) e indica cuál sería su Idea verdadera en el mundo inteligible.
3. "aristoteles": Analiza la premisa mediante la experiencia sensible, las causas (material, formal, eficiente, final) o la abstracción empírica.
4. "agustin": Relaciona la premisa con la fe, la iluminación divina y la falibilidad de la sensación humana sin la verdad de Dios.
5. "descartes": Aplica la duda metódica. Cuestiona si los sentidos o un genio maligno podrían estar engañando al afirmar esta premisa.
6. "locke": Explica cómo esta premisa se construye a partir de ideas simples de la sensación e ideas complejas de la reflexión (tabla rasa).
7. "kant": Analiza los juicios sintéticos a priori, las intuiciones puras del espacio/tiempo y las categorías del entendimiento aplicadas a esta premisa (fenómeno vs. noúmeno).
8. "nietzsche": Critica la premisa como una construcción del lenguaje, una perspectiva subjetiva o una manifestación de la voluntad de poder.

Responde ÚNICAMENTE con el objeto JSON estructurado así:
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
    
    // Limpieza de formato si el modelo incluye bloques ```json
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
