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
  } else {
    console.error("No se encontró la scena:", sceneKey);
  }

  const chatLog = document.getElementById("chatLog");
  const talkBtn = document.getElementById("talkBtn");
  const endBtn = document.getElementById("endBtn");
  const francescoFace = document.getElementById("francescoFace");
  const hint = document.getElementById("exitHint");

  function pushMsg(sender, text, cls = "") {
    const p = document.createElement("p");
    p.className = cls || (sender === "Tu" ? "msg-user" : "msg-bot");
    p.textContent = `${sender}: ${text}`;
    chatLog.appendChild(p);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // animación simple de parpadeo
  function startBlinking(faceElem) {
    setInterval(() => {
      faceElem.classList.add("blink");
      setTimeout(() => faceElem.classList.remove("blink"), 200);
    }, Math.random() * 3000 + 3000);
  }
  if (francescoFace) startBlinking(francescoFace);

  // 🔹 STT
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
      pushMsg("Sistema", "Errore di comunicazione con l'IA", "msg-system");
      francescoFace.classList.remove("talking");
    }
  }

  recognizer.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    if (text.toLowerCase().includes("ci vediamo francesco")) {
      endBtn.click();
    } else {
      handleSpeech(text);
    }
  };

  // 🔹 botones
  talkBtn.addEventListener("click", () => recognizer.start());

  endBtn.addEventListener("click", () => {
    const bye = "Ci vediamo! Torniamo al menu.";
    pushMsg("Francesco", bye);
    const utter = new SpeechSynthesisUtterance(bye);
    utter.lang = "it-IT";
    utter.onend = () => {
      localStorage.clear();
      window.location.href = "/index.html";
    };
    speechSynthesis.speak(utter);
  });

  // mostrar hint
  if (hint) hint.style.display = "block";
});
