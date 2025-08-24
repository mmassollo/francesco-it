const level = localStorage.getItem("level");
const sceneKey = (localStorage.getItem("scene") || "").toLowerCase();

const sceneMap = {
  citta: "/images/scenes/citta-360.jpg",
  colosseo: "/images/scenes/colosseo-360.jpg",
  albergo: "/images/scenes/albergo-360.jpg",
  spiaggia: "/images/scenes/spiaggia-360.jpg"
};

window.addEventListener("DOMContentLoaded", () => {
  // ---- Escena dinámica ----
  const skyImg = document.getElementById("skyTexture");
  if (sceneKey && sceneMap[sceneKey]) {
    skyImg.setAttribute("src", sceneMap[sceneKey]);
  } else {
    console.error("Scena non trovata:", sceneKey);
  }

  const chatLog = document.getElementById("chatLog");
  const talkBtn = document.getElementById("talkBtn");

  function pushMsg(sender, text, cls = "") {
    const p = document.createElement("p");
    p.className = cls || (sender === "Tu" ? "msg-user" : "msg-bot");
    p.textContent = `${sender}: ${text}`;
    chatLog.appendChild(p);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ---- Sintesi vocale ----
  function getItalianVoice() {
    const voices = speechSynthesis.getVoices();
    return (
      voices.find(
        (v) =>
          v.lang.startsWith("it") &&
          (v.name.toLowerCase().includes("child") ||
           v.name.toLowerCase().includes("ragazzo") ||
           v.name.toLowerCase().includes("male"))
      ) || voices.find((v) => v.lang.startsWith("it"))
    );
  }

  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "it-IT";
    const voice = getItalianVoice();
    if (voice) utter.voice = voice;
    speechSynthesis.speak(utter);
  }

  // ---- Riconoscimento vocale ----
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  recognizer.lang = "it-IT";
  recognizer.continuous = true;

  recognizer.onend = () => {
    recognizer.start();
  };

  async function handleSpeech(text) {
    pushMsg("Tu", text);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, level, scene: sceneKey })
      });
      const data = await resp.json();
      let reply = data.reply || "Scusa, non riesco a rispondere.";
      pushMsg("Francesco", reply);
      speechSynthesis.cancel();
      speak(reply);
    } catch (err) {
      console.error(err);
      pushMsg("Sistema", "Errore di comunicazione con l'IA", "msg-system");
    }
  }

  recognizer.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    handleSpeech(text);
  };

  talkBtn.addEventListener("click", () => {
    recognizer.start();
  });
});
