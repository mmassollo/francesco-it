export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non permesso" });
  }

  try {
    const { message } = JSON.parse(req.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sei Francesco, un amico italiano simpatico che parla solo in italiano." },
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
    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Errore generale:", err);
    res.status(500).json({ error: "Errore di comunicazione con l'IA" });
  }
}
