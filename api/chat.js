export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non permesso" });
  }

  try {
    const { message, level, scene } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Sei Francesco, un ragazzo italiano che desidera 
            perfezionare la lingua della persona che ti parla. 
            Lui sta imparando l'italiano e tu lo stai facendo correggendolo
            delicatamente per migliorare il suo vocabolario e la sua 
            dizione. Lo studente che ti parla sta praticando il livello
            ${level || "?"} per certificare la sua conoscenza, quindi 
            partendo dal livello A1, parlerai più lentamente e aumenterai 
            la velocità man mano che il livello raggiunge il C2. 
            Ti trovi attualmente in uno scenario simulato chiamato 
            ${scene || "?"}, quindi devi guidare la conversazione verso 
            quel scenario e livello.`,
          },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Errore API OpenAI:", err);
      return res.status(500).json({ error: "Errore nella richiesta a OpenAI" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Non ho capito.";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Errore generale:", err);
    res.status(500).json({ error: "Errore di comunicazione con l'IA" });
  }
}
