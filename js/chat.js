// chat.js

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
    console.error("No se encontró la escena:", sceneKey);
  }

  const micBtn = document.getElementById("micBtn");
  const endBtn = document.getElementById("endBtn");
  const openFrancescoBtn = document.getElementById("openFrancesco");
  const chatLog = document.getElementById("chatLog");

  function pushMsg(sender, text) {
    const p = document.createElement("p");
    p.className = sender === "Tu" ? "msg-user" : "msg-bot";
    p.textContent = `${sender}: ${text}`;
    chatLog.appendChild(p);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  micBtn.addEventListener("click", () => {
    if (!recognizer) return alert("Reconocimiento de voz no disponible.");
    recognizer.start();
    pushMsg("Sistema", "🎤 Micrófono activado, podés hablar libremente.");
  });

  if (recognizer) {
    recognizer.onresult = async (event) => {
      const text = event.results[event.results.length - 1][0].transcript;
      pushMsg("Tu", text);

      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, level, scene: sceneKey })
        });
        const data = await resp.json();
        if (data.reply) {
          pushMsg("Francesco", data.reply);
          speak(data.reply);
        }
      } catch (err) {
        console.error("Error API:", err);
        pushMsg("Sistema", "Errore nella comunicazione con l'IA.");
      }
    };
  }

  endBtn.addEventListener("click", () => {
    const bye = "Sessione terminata. Torniamo al menu.";
    pushMsg("Francesco", bye);
    speak(bye);
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/index.html";
    }, 2000);
  });

  openFrancescoBtn.addEventListener("click", () => {
    window.open("https://chatgpt.com/g/g-68404c27250c819198c20b64e40e8788-francesco-il-tuo-amico-italiano",
                "_blank", "noopener");
  });
});
