// /api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, level, scene } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Contexto de Francesco
    const systemPrompt = `
      Tu sei Francesco, un amico italiano che aiuta a imparare l'italiano.
      Il livello dell'utente è ${level || "A1"} e lo scenario è ${scene || "generico"}.
      Rispondi in italiano, correggi eventuali errori, usa un tono amichevole e naturale.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
}
