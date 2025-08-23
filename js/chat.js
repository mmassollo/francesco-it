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
  if (sceneKey && sceneMap[sceneKey]) skyImg.setAttribute("src", sceneMap[sceneKey]);
  else console.error("No se encontró la escena:", sceneKey);

  const chatLog = document.getElementById("chatLog");
  const endBtn = document.getElementById("endBtn");
  const openFrancescoBtn = document.getElementById("openFrancesco");
  const francescoFace = document.getElementById("francescoFace");

  function pushMsg(sender, text) {
    const p = document.createElement("p");
    p.className = sender === "Tu" ? "msg-user" : "msg-bot";
    p.textContent = `${sender}: ${text}`;
    chatLog.appendChild(p);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // Animaciones: parpadeo y gestos de cabeza
  function startBlinking(faceElem) {
    setInterval(() => {
      faceElem.classList.add("blink");
      setTimeout(() => faceElem.classList.remove("blink"), 200);
    }, Math.random() * 3000 + 3000);
  }

  function headGesture(faceElem) {
    faceElem.style.transform = "translateX(-50%) rotateZ(3deg)";
    setTimeout(() => { faceElem.style.transform = "translateX(-50%) rotateZ(-3deg)"; }, 200);
    setTimeout(() => { faceElem.style.transform = "translateX(-50%) rotateZ(0deg)"; }, 400);
  }

  startBlinking(francescoFace);

  // STT automático
  if (recognizer) {
    recognizer.start();

    recognizer.onresult = async (event) => {
      const text = event.results[event.results.length - 1][0].transcript;
      pushMsg("Tu", text);

      francescoFace.classList.add("talking");
      headGesture(francescoFace);

      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, level, scene: sceneKey })
        });
        const data = await resp.json();
        if (data.reply) {
          pushMsg("Francesco", data.reply);
          speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(data.reply);
          utter.lang = "it-IT";
          utter.rate = 1;
          utter.onend = () => francescoFace.classList.remove("talking");
          speechSynthesis.speak(utter);
        }
      } catch (err) {
        console.error(err);
        pushMsg("Sistema", "Errore comunicazione IA");
        francescoFace.classList.remove("talking");
      }
    };
  }

  // Terminar sesión
  endBtn.addEventListener("click", () => {
    const bye = "Sessione terminata. Torniamo al menu.";
    pushMsg("Francesco", bye);
    const utter = new SpeechSynthesisUtterance(bye);
    utter.lang = "it-IT";
    utter.onend = () => {
      localStorage.clear();
      window.location.href = "/index.html";
    };
    speechSynthesis.speak(utter);
  });

  openFrancescoBtn.addEventListener("click", () => {
    window.open(
      "https://chatgpt.com/g/g-68404c27250c819198c20b64e40e8788-francesco-il-tuo-amico-italiano",
      "_blank",
      "noopener"
    );
  });
});
