const level = localStorage.getItem("level");
const sceneKey = (localStorage.getItem("scene") || "").toLowerCase();
const language = localStorage.getItem("language") || "it";

// Mapear códigos BCP-47 para STT/TTS
const LangCodes = {
  it: "it-IT",
  es: "es-ES",
  en: "en-US",
  pt: "pt-BR"
};
const langCode = LangCodes[language] || "it-IT";

// Escenas
const sceneMap = {
  citta: "/images/scenes/citta-360.jpg",
  ristorante: "/images/scenes/ristorante-360.jpg",
  albergo: "/images/scenes/albergo-360.jpg",
  spiaggia: "/images/scenes/spiaggia-360.jpg"
};

// Etiquetas según idioma
const L = Labels[language] || Labels.it;

window.addEventListener("DOMContentLoaded", () => {
  // ---- Escena dinámica ----
  const skyImg = document.getElementById("skyTexture");
  if (sceneKey && sceneMap[sceneKey]) {
    skyImg.setAttribute("src", sceneMap[sceneKey]);
  }

  const chatLog = document.getElementById("chatLog");
  const talkBtn = document.getElementById("talkBtn");

  function pushMsg(sender, text, cls = "") {
    const p = document.createElement("p");
    p.className = cls || (sender === L.user ? "msg-user" : "msg-bot");
    p.textContent = `${sender}: ${text}`;
    chatLog.appendChild(p);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ---- Sintetizador de voz ----
  function getVoice() {
    const voices = speechSynthesis.getVoices();
    return voices.find((v) => v.lang === langCode) || voices.find((v) => v.lang.startsWith(language)) || voices[0];
  }

  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    const voice = getVoice();
    if (voice) utter.voice = voice;
    speechSynthesis.speak(utter);
  }

  // ---- Reconocimiento de voz ----
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  recognizer.lang = langCode;
  recognizer.continuous = false;

  async function handleSpeech(text) {
    pushMsg(L.user, text);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, level, scene: sceneKey, language })
      });
      const data = await resp.json();
      let reply = data.reply || L.err;
      pushMsg(L.bot, reply);
      speechSynthesis.cancel();
      speak(reply);
    } catch (err) {
      console.error(err);
      pushMsg(L.sys, L.err, "msg-system");
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
