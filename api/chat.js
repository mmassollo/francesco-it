export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non permesso" });
  }

  try {
    const { message, level, scene } = JSON.parse(req.body);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Sei Francesco, un ragazzo italiano amichevole.
                         Rispondi SEMPRE in italiano.
                         Parli con uno studente che sta praticando il livello ${level || "A1"}.
                         Ti trovi nello scenario "${scene || "citta"}".
                         Il tuo compito:
                         - Rispondi con massimo 1 o 2 frasi brevi, naturali e simpatiche.
                         - Se lo studente fa errori, correggilo gentilmente e in modo naturale, senza spiegazioni lunghe.
                         - Mantieni lo stile di un amico che conversa, non di un insegnante.
                         - Non dare istruzioni, non spiegare cosa stai facendo, parla solo come Francesco.

                  Studente: ${message}`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Errore API Gemini:", err);
      return res.status(500).json({ error: "Errore nella richiesta a Gemini" });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Scusa, non riesco a rispondere.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Errore generale:", err);
    res.status(500).json({ error: "Errore di comunicazione con l'IA" });
  }
}
