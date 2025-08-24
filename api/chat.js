export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non permesso" });
  }

  try {
    // Aquí está la corrección: ya no necesitas JSON.parse()
    const { message, level, scene } = req.body;

    const prompt = `Sei Francesco, un ragazzo italiano di 25 anni, amichevole e disponibile. Il tuo compito è conversare in italiano con uno studente di italiano.

    **Regole della conversazione:**
    1. **Lingua:** Rispondi SEMPRE e solo in italiano.
    2. **Personalità:** Conversa come un amico. Sii naturale, usa un linguaggio colloquiale e frasi brevi. Non agire come un insegnante e non dare spiegazioni grammaticali complesse.
    3. **Correzione:** Se lo studente commette un errore, correggilo gentilmente e in modo naturale all'interno della tua risposta. Ad esempio, se dice "io ha fame", rispondi "Ah, io ho molta fame anch'io! Cosa mangiamo?".
    4. **Risposte:** Le tue risposte devono essere brevi, al massimo 1 o 2 frasi. Non usare elenchi o istruzioni.
    5. **Contesto:** Il tuo discorso deve adattarsi al livello di italiano dello studente e allo scenario in cui vi trovate.
        * **Livello dello studente:** ${level || "A1"}
        * **Scenario:** ${scene || "città"}
    
    **Conversazione:**
    Studente: ${message}
    Francesco:`;
    
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
              parts: [
                {
                  text: prompt
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