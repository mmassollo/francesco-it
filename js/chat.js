// chat.js

const level = localStorage.getItem("level");
const sceneKey = localStorage.getItem("scene");

const sceneMap = {
  "Città": "/images/scenes/citta-360.jpg",
  "Colosseo": "/images/scenes/colosseo-360.jpg",
  "Albergo": "/images/scenes/albergo-360.jpg",
  "Spiaggia": "/images/scenes/spiaggia-360.jpg"
};

window.addEventListener("DOMContentLoaded", () => {
  console.log("Chat page loaded, level:", level, "scene:", sceneKey);

  // --- Cargar escena ---
  const skyImg = document.getElementById("skyTexture");
  if (sceneKey && sceneMap[sceneKey]) {
    skyImg.setAttribute("src", sceneMap[sceneKey]);
    console.log("Cargando escena:", sceneMap[sceneKey]);
  } else {
    console.error("No se encontró la escena:", sceneKey);
  }

  // --- Botones ---
  const micBtn = document.getElementById("micBtn");
  const endBtn = document.getElementById("endBtn");
  const openFrancescoBtn = document.getElementById("openFrancesco");
  const chatLog = document.getElementById("chatLog");

  // Mostrar mensajes en pantalla
  function pushMsg(sender, text) {
    const p = document.createElement("p");
    p.textContent = `${sender}: ${text}`;
    chatLog.appendChild(p);
  }

  // Hablar
  micBtn.addEventListener("click", () => {
    if (!recognizer) {
      alert("Reconocimiento de voz no disponible.");
      return;
    }
    try {
      recognizer.start();
      console.log("Micrófono activado...");
    } catch (e) {
      console.error("Error micrófono:", e);
    }
  });

  if (recognizer) {
    recognizer.onresult = (event) => {
      const text = event.results[0][0].transcript;
      pushMsg("Tu", text);

      // TODO: acá deberíamos mandar a Francesco, ahora solo eco
      const reply = "Ho capito: " + text;
      pushMsg("Francesco", reply);
      speak(reply);

      if (text.toLowerCase().includes("ci vediamo francesco")) {
        const bye = "Arrivederci! Torniamo al menu.";
        pushMsg("Francesco", bye);
        speak(bye);
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/index.html";
        }, 2000);
      }
    };
  }

  // Terminar
  endBtn.addEventListener("click", () => {
    const bye = "Sessione terminata. Torniamo al menu.";
    pushMsg("Francesco", bye);
    speak(bye);
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/index.html";
    }, 2000);
  });

  // Abrir Francesco en chatgpt.com
  openFrancescoBtn.addEventListener("click", () => {
    const url = "https://chatgpt.com/g/g-68404c27250c819198c20b64e40e8788-francesco-il-tuo-amico-italiano";
    window.open(url, "_blank", "noopener");
  });
});
