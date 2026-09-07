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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptSystem = `
Actúa como un motor epistemológico interactivo. Interpreta la siguiente premisa planteada por el usuario: "${premisa}".

Tu tarea es hacer que cada uno de los 19 filósofos de la lista reaccione e interprete ESTA PREMISA ESPECÍFICA en PRIMERA PERSONA o mediante su razonamiento directo (1 a 2 frases concisas por filósofo).

REGLAS CRÍTICAS:
- NO digas "Sócrates cuestionaría esto mediante..." o "Platón dice que...".
- Haz que cada filósofo HAGA su planteamiento directamente sobre la premisa ingresada.

Lista de los 19 filósofos exactos del tablero:
1. "socrates": Pregunta mayéutica incisiva en primera persona.
2. "platon": Distinción entre sombra (doxa) e Idea inteligible pura.
3. "aristoteles": Abstracción empírica y causas a partir de los sentidos.
4. "agustin": Falibilidad de los sentidos e iluminación divina.
5. "escoto": Duns Escoto; voluntad y distinción formal del conocimiento.
6. "ockam": Guillermo de Ockham; nominalismo y la navaja de Ockham.
7. "descartes": Duda metódica y certezas claras y distintas.
8. "spinoza": Sustancia única y la premisa como parte de Dios/Naturaleza.
9. "leibniz": Mónadas e ideas innatas.
10. "hobbes": Materialismo, percepción mecanicista y sensación.
11. "locke": Tabula rasa e ideas simples de la sensación.
12. "berkeley": Inmaterialismo; "ser es ser percibido".
13. "hume": Impresiones, ideas y escepticismo sobre la causalidad.
14. "husserl": Fenomenología y reducción a la conciencia (epojé).
15. "heidegger": Dasein y vivencia existencial del Ser-en-el-mundo.
16. "kant": Formas a priori (espacio/tiempo) y fenómeno vs noúmeno.
17. "comte": Positivismo y observación científica del hecho puro.
18. "nietzsche": Voluntad de poder, metáfora del lenguaje y perspectiva.
19. "weber": Comprensión interpretativa del sentido (Verstehen).

Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin bloques markdown \`\`\`json) estructurado con estas llaves:
"socrates", "platon", "aristoteles", "agustin", "escoto", "ockam", "descartes", "spinoza", "leibniz", "hobbes", "locke", "berkeley", "hume", "husserl", "heidegger", "kant", "comte", "nietzsche", "weber".
`;

    const result = await model.generateContent(promptSystem);
    const textResponse = result.response.text().trim();
    
    // Limpiar bloques de markdown si la IA los incluye
    const cleanedJson = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const data = JSON.parse(cleanedJson);

    res.json(data);

  } catch (error) {
    console.error('Error al generar análisis:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar el análisis.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
