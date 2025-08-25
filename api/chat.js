export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, level, scene, language } = req.body;

    const personas = {
      it: { name: "Francesco", langName: "italiano", fallback: "Scusa, non riesco a rispondere.", err: "Errore di comunicazione con l'IA" },
      es: { name: "Francisco", langName: "español", fallback: "Lo siento, no puedo responder.", err: "Error de comunicación con la IA" },
      en: { name: "Frank",     langName: "English",  fallback: "Sorry, I can’t respond.", err: "Communication error with AI" },
      pt: { name: "Francisco", langName: "português", fallback: "Desculpa, não consigo responder.", err: "Erro de comunicação com a IA" }
    };

    const lang = personas[language] ? language : "it";
    const { name, langName, fallback, err } = personas[lang];

    const sceneContexts = {
      albergo: {
        it: "Siete in un albergo in Italia, puoi parlare di check-in, vacanze e viaggi.",
        es: "Están en un hotel, pueden hablar de la reserva, de viajes o vacaciones.",
        en: "You are in a hotel, you can talk about check-in, travels and holidays.",
        pt: "Vocês estão em um hotel, podem falar sobre reservas, viagens e férias."
      },
      citta: {
        it: "Siete in città, potete parlare di negozi, strade, persone o mezzi di trasporto.",
        es: "Están en la ciudad, pueden hablar de tiendas, calles, gente o transporte.",
        en: "You are in the city, you can talk about shops, streets, people, or transportation.",
        pt: "Vocês estão na cidade, podem falar de lojas, ruas, pessoas ou transporte."
      },
      ristorante: {
        it: "Siete in un ristorante, potete parlare di cibo, ordinazioni, menu e gusti.",
        es: "Están en un restaurante, pueden hablar de comida, pedidos, menú y gustos.",
        en: "You are in a restaurant, you can talk about food, ordering, menus, and tastes.",
        pt: "Vocês estão em um restaurante, podem falar de comida, pedidos, cardápio e gostos."
      },
      spiaggia: {
        it: "Siete in spiaggia, potete parlare di mare, sole, vacanze e attività.",
        es: "Están en la playa, pueden hablar del mar, sol, vacaciones y actividades.",
        en: "You are at the beach, you can talk about the sea, sun, holidays and activities.",
        pt: "Vocês estão na praia, podem falar do mar, sol, férias e atividades."
      }
    };

    const sceneContext = (sceneContexts[scene] && sceneContexts[scene][lang]) || "";

    const prompt = `
You are ${name}, a friendly ${langName} young person (about 25 years old).
Your task is to have a casual conversation with the student in **${langName}**.

**Rules of conversation:**
1. **Language:** Always and only respond in ${langName}.
2. **Personality:** Be natural and friendly, like a close friend. Use colloquial language and short sentences. Do not act as a teacher and do not give grammar explanations.
3. **Correction:** If the student makes a mistake, correct it gently and naturally within your reply.
4. **Responses:** Keep answers short, maximum 1–2 sentences. No lists or long explanations.
5. **Context adaptation:** Adjust your conversation to:
   - **Student level:** ${level || "A1"}
   - **Scenario:** ${scene || "città"} → ${sceneContext}

**Important:** Try to naturally steer the conversation towards themes related to the scenario above.

**Conversation so far:**
Student: ${message}
${name}:`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return res.status(500).json({ error: err });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || fallback;

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("General error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
}
