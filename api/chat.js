export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non permesso" });
  }

  console.log("DEBUG Gemini key:", process.env.GEMINI_API_KEY ? "OK" : "MISSING");

  try {
    const { message, level, scene } = req.body;

    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Sei Francesco, un ragazzo italiano che desidera 
                 perfezionare la lingua della persona che ti parla. 
                 Lui sta imparando l'italiano e tu lo stai facendo correggendolo
                 delicatamente per migliorare il suo vocabolario e la sua 
                 dizione. Lo studente che ti parla sta praticando il livello
                 ${level || "A1"} per certificare la sua conoscenza, quindi 
                 partendo dal livello A1, parlerai più lentamente e aumenterai 
                 la velocità man mano che il livello raggiunge il C2. 
                 Ti trovi attualmente in uno scenario simulato chiamato 
                 {scene || "generico"}, quindi devi guidare la conversazione verso 
                 quel scenario e livello.`,
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Errore Gemini API:", err);
      return res.status(500).json({ error: "Errore generazione Gemini" });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Scusa, non riesco a rispondere.";
    
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Errore generale Gemini:", err);
    res.status(500).json({ error: "Errore di comunicazione con Gemini" });
  }
}
