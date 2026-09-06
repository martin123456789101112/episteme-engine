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

Tu tarea es hacer que cada uno de los 18 filósofos de la lista reaccione e interprete ESTA PREMISA ESPECÍFICA en PRIMERA PERSONA o mediante su razonamiento directo (máximo 2-3 frases breves por filósofo).

REGLAS CRÍTICAS:
- NO digas cosas como "Sócrates cuestionaría esto mediante..." o "Platón dice que...".
- Haz que cada filósofo HAGA su planteamiento directamente sobre la premisa ingresada.
- Utiliza su lenguaje técnico exacto.

Lista de los 18 filósofos:
1. "socrates": Cuestionamiento mayéutico directo.
2. "platon": Mundo sensible (doxa/sombra) vs Idea inteligible.
3. "aristoteles": Abstracción empírica y causas (material, formal, etc.).
4. "agustin": Iluminación divina y fe frente a la falibilidad de los sentidos.
5. "escoto": Duns Escoto; distinción formal y voluntarismo cognitivo.
6. "ockam": Guillermo de Ockham; nominalismo y la navaja de Ockham.
7. "descartes": Duda metódica, certezas claras y distintas.
8. "spinoza": Sustancia única, Dios o la Naturaleza (Pantenteísmo epistemológico).
9. "leibniz": Mónadas e ideas innatas/armonía preestablecida.
10. "hobbes": Materialismo, empirismo mecanicista y sensación.
11. "locke": Tabula rasa, ideas simples de sensación y complejas de reflexión.
12. "berkeley": Inmaterialismo; "ser es ser percibido" (Esse est percipi).
13. "hume": Impresiones, ideas y escepticismo sobre la causalidad.
14. "husserl": Fenomenología y epojé (reducción fenomenológica de la conciencia).
15. "heidegger": Dasein, el Ser-en-el-mundo y la vivencia existencial de la premisa.
16. "kant": Juicios a priori, espacio/tiempo y fenómeno vs noúmeno.
17. "comte": Positivismo, los tres estadios y el hecho científico observable.
18. "nietzsche": Voluntad de poder, metáfora del lenguaje y perspectiva.
19. "weber": Max Weber; "Verstehen" (comprensión interpretativa del sentido social).

Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin bloques markdown de código de tipo \`\`\`json) estructurado con estas 19 llaves exactas:
"socrates", "platon", "aristoteles", "agustin", "escoto", "ockam", "descartes", "spinoza", "leibniz", "hobbes", "locke", "berkeley", "hume", "husserl", "heidegger", "kant", "comte", "nietzsche", "weber".
`;

    const result = await model.generateContent(promptSystem);
    const textResponse = result.response.text().trim();
    
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
