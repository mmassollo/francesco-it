const level = localStorage.getItem("level");
const sceneKey = (localStorage.getItem("scene") || "").toLowerCase();

const sceneMap = {
  "citta": "/images/scenes/citta-360.jpg",
  "colosseo": "/images/scenes/colosseo-360.jpg",
  "albergo": "/images/scenes/albergo-360.jpg",
  "spiaggia": "/images/scenes/spiaggia-360.jpg"
};

window.addEventListener("DOMContentLoaded", () => {
  const skyImg = document.getElementById("skyTexture");
  if (sceneKey && sceneMap[sceneKey]) {
    skyImg.setAttribute("src", sceneMap[sceneKey]);
  }

  const chatLog = document.getElementById("chatLog");
  const talkBtn = document.getElementById("talkBtn");
  const francescoFace = document.getElementById("francescoFace");

  function pushMsg(sender, text) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatLog.appendChild(p);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // Animación parpadeo
  function startBlinking(faceElem) {
    setInterval(() => {
      faceElem.classList.add("blink");
      setTimeout(() => faceElem.classList.remove("blink"), 200);
    }, Math.random() * 3000 + 3000);
  }
  if (francescoFace) startBlinking(francescoFace);

  // STT
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Questo browser non supporta SpeechRecognition (prova Chrome)");
    return;
  }
  const recognizer = new SR();
  recognizer.lang = "it-IT";
  recognizer.continuous = false;

  async function handleSpeech(text) {
    pushMsg("Tu", text);
    francescoFace.classList.add("talking");

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, level, scene: sceneKey })
      });
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error || "Errore IA");

      const reply = data.reply || "Scusa, non riesco a rispondere.";
      pushMsg("Francesco", reply);

      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(reply);
      utter.lang = "it-IT";
      utter.onend = () => francescoFace.classList.remove("talking");
      speechSynthesis.speak(utter);
    } catch (err) {
      console.error(err);
      pushMsg("Sistema", "Errore di comunicazione con l'IA");
      francescoFace.classList.remove("talking");
    }
  }

  recognizer.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    if (text.toLowerCase().includes("ci vediamo francesco")) {
      localStorage.clear();
      window.location.href = "/index.html";
    } else {
      handleSpeech(text);
    }
  };

  talkBtn.addEventListener("click", () => recognizer.start());
});
