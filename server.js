import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos epistemológica completa con los 19 filósofos
const BASE_EPISTEMOLOGICA = {
  socrates: "El conocimiento se alcanza reconociendo la propia ignorancia ('solo sé que nada sé') a través del diálogo dialéctico y la mayéutica para descubrir verdades universales e inherentes a la razón humana.",
  platon: "El conocimiento auténtico (episteme) es el recuerdo o aprehensión del Mundo de las Ideas (eternas, inmutables y perfectas), accesible solo por la razón, diferenciándolo de la opinión (doxa) basada en el mundo sensible.",
  aristoteles: "El conocimiento inicia en la experiencia sensible y la percepción, a partir de la cual el entendimiento abstrae las esencias universales e inteligibles de las cosas.",
  agustin: "El conocimiento verdadero proviene de la iluminación divina, donde Dios otorga a la mente humana la capacidad de percibir las verdades eternas e inmutables.",
  escoto: "El conocimiento intuitivo y abstracto permite captar tanto la existencia concreta e individual de las cosas (haecceitas) como sus conceptos universales.",
  ockam: "Sostiene un nominalismo radical donde solo existen los individuos concretos; los universales son meros conceptos mentales o nombres, situando la experiencia empírica directa como base fundamental del saber.",
  descartes: "El conocimiento debe fundamentarse en la duda metódica y en verdades indudables claras y distintas captadas por la razón pura (cogito, ergo sum).",
  spinoza: "El conocimiento supremo es intuitivo y busca comprender la unidad de todas las cosas como manifestaciones o atributos de una sola sustancia infinita (Dios o la Naturaleza).",
  leibniz: "Distingue entre verdades de razón (necesarias y a priori) y verdades de hecho (contingentes y a posteriori), sosteniendo la presencia de ideas innatas en la mente.",
  hobbes: "El conocimiento se origina exclusivamente en la sensación y la experiencia del movimiento de los cuerpos materiales, expresado luego mediante el lenguaje.",
  locke: "Rechaza las ideas innatas; concibe la mente como una tabla rasa que adquiere todo su contenido a través de la experiencia sensible externa e interna.",
  berkeley: "Plantea el inmaterialismo (esse est percipi), donde el conocimiento se reduce a las percepciones e ideas que Dios infunde directamente en la mente humana.",
  hume: "El conocimiento surge de las impresiones y las ideas; reduce las leyes de causa y efecto a hábitos psicológicos basados en la asociación y la costumbre.",
  kant: "El conocimiento es una síntesis entre el material de la experiencia sensible y las formas a priori (espacio, tiempo y categorías) estructuradas por el entendimiento humano.",
  husserl: "Funda la fenomenología, defining el conocimiento como la intuición directa y la descripción rigurosa de las esencias de los fenómenos tal como se presentan a la conciencia.",
  heidegger: "Concibe el conocimiento no como una mera relación sujeto-objeto, sino como una modalidad del 'estar-en-el-mundo' (Dasein) vinculada a la comprensión existencial y al sentido del Ser.",
  comte: "Establece el positivismo, donde el conocimiento válido se limita a los hechos observables y sus leyes científicas comprobables, descartando las explicaciones metafísicas.",
  nietzsche: "Rechaza la existencia de una verdad o conocimiento objetivo; sostiene un perspectivismo donde las verdades son construcciones interpretativas subordinadas a la voluntad de poder.",
  weber: "Plantea que el conocimiento en las ciencias sociales busca la comprensión interpretativa (Verstehen) de la acción social y los sentidos subjetivos que los individuos otorgan a sus actos."
};

app.post('/api/analizar', (req, res) => {
  const { premisa } = req.body;

  if (!premisa) {
    return res.status(400).json({ error: 'La premisa es requerida.' });
  }

  const respuestaFormat = {};
  for (const [key, doctrina] of Object.entries(BASE_EPISTEMOLOGICA)) {
    respuestaFormat[key] = `Ante '${premisa}': ${doctrina}`;
  }

  res.json(respuestaFormat);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
