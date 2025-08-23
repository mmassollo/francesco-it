import { speak, createRecognizer } from "./voice.js";

const labelLevel = document.getElementById("labelLevel");
const labelScene = document.getElementById("labelScene");
const messagesEl = document.getElementById("messages");
const micBtn = document.getElementById("micBtn");
const endBtn = document.getElementById("endBtn");
const openFrancescoBtn = document.getElementById("openFrancesco");

const level = localStorage.getItem("level");
const sceneKey = localStorage.getItem("scene");
if (!level || !sceneKey) {
  window.location.replace("/index.html");
}

const scene = window.SceneMap[sceneKey];
labelLevel.textContent = `Livello ${level}`;
labelScene.textContent = scene?.label || sceneKey;

// Setear textura 360
const skyImg = document.getElementById("skyTexture");
skyImg.src = scene.sceneImg;

// Mensajería UI
function pushMsg(side, text) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg ${side}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// “Sistema” (bienvenida según nivel/escena)
const hello = `Ciao! Iniziamo a praticare italiano al livello ${level} nello scenario ${scene.label}. Parlami quando sei pronto.`;
pushMsg("bot", hello);
speak(hello);

// Reconocedor
const recognizer = createRecognizer({ lang: "it-IT" });

let listening = false;
micBtn.addEventListener("click", () => {
  if (!recognizer) return;
  if (listening) return;
  try {
    recognizer.start();
    listening = true;
    micBtn.textContent = "🎙️ Ascoltando…";
  } catch (e) {
    console.warn(e);
  }
});

recognizer && (recognizer.onresult = (ev) => {
  listening = false;
  micBtn.textContent = "🎙️ Hablar";
  const text = ev.results[0][0].transcript.trim();
  if (!text) return;

  pushMsg("me", text);

  // Frase de salida
  if (/ci vediamo francesco/i.test(text)) {
    const bye = "Va bene! Alla prossima. Torniamo al menu iniziale.";
    pushMsg("bot", bye);
    speak(bye);
    setTimeout(() => {
      localStorage.removeItem("level");
      localStorage.removeItem("scene");
      window.location.href = "/index.html";
    }, 1400);
    return;
  }

  // ---- MODO GRATUITO SIN API ----
  // Simulamos respuesta “coach” local con una plantilla según nivel:
  const reply = localCoachReply(level, scene.label, text);
  pushMsg("bot", reply);
  speak(reply);

  // Además, copiamos TU último texto al portapapeles
  // por si querés pegarlo en la pestaña de Francesco.
  navigator.clipboard?.writeText?.(buildContextPreface(level, scene.label) + "\nUtente: " + text)
    .catch(() => {});
});

recognizer && (recognizer.onerror = () => {
  listening = false;
  micBtn.textContent = "🎙️ Hablar";
});
recognizer && (recognizer.onend = () => {
  listening = false;
  micBtn.textContent = "🎙️ Hablar";
});

// Botón “Abrir Francesco” (pestaña aparte)
openFrancescoBtn.addEventListener("click", () => {
  const url = "https://chatgpt.com/g/g-68404c27250c819198c20b64e40e8788-francesco-il-tuo-amico-italiano";
  // Copiamos un contexto inicial para que lo pegues como primer mensaje
  const preface = buildContextPreface(level, scene.label);
  navigator.clipboard?.writeText?.(preface).catch(()=>{});
  window.open(url, "_blank", "noopener");
  pushMsg("bot", "Ho aperto Francesco in una nuova scheda. Ho copiato il contesto iniziale negli appunti: incollalo come primo messaggio.");
  speak("Ho aperto Francesco in una nuova scheda. Incolla il contesto che ho copiato negli appunti.");
});

// Helpers “coach” local
function buildContextPreface(lvl, scenelabel) {
  return `Ciao Francesco! Da ora in poi, parla in italiano al livello ${lvl}, nello scenario ${scenelabel}. Se sono principianti, parla più lentamente e correggi errori basilari. A livelli superiori, aumenta velocità e complessità.`;
}

function localCoachReply(lvl, scenelabel, userText) {
  const baseSlow = (t) => `Capito. ${t ? "Hai detto: “" + t + "”. " : ""}Prova a ripetere con frasi brevi. Qual è il tuo obiettivo oggi?`;
  const baseFast = (t) => `${t ? "Interessante: “" + t + "”. " : ""}Parliamo dello scenario ${scenelabel}. Raccontami un dettaglio in più, usando tempi verbali corretti.`;
  switch (lvl) {
    case "A1": return baseSlow(userText) + " Io ti aiuterò con la pronuncia.";
    case "A2": return baseSlow(userText) + " Ora prova a fare una domanda.";
    case "B1": return baseFast(userText) + " Cerca di usare passato prossimo.";
    case "B2": return baseFast(userText) + " Aggiungi una tua opinione personale.";
    case "C1": return baseFast(userText) + " Sii preciso nel vocabolario e nella coesione.";
    case "C2": return baseFast(userText) + " Mantieni registro naturale e complesso.";
    default: return baseSlow(userText);
  }
}

// Botón terminar manual
endBtn.addEventListener("click", () => {
  const bye = "Sessione terminata. Torniamo al menu.";
  pushMsg("bot", bye);
  speak(bye);
  setTimeout(() => {
    localStorage.removeItem("level");
    localStorage.removeItem("scene");
    window.location.href = "/index.html";
  }, 1200);
});

// Consejo extra al cargar
setTimeout(() => {
  const tip = "Premi il microfono, parla, e io risponderò con la voce. Se vuoi usare Francesco ufficiale, apri la nuova scheda.";
  pushMsg("bot", tip);
  // No lo hablamos para no interrumpir de entrada
}, 600);
