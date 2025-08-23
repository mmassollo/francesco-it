// Inicializa STT y TTS
let recognizer;
let speak;

function initVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Tu navegador no soporta SpeechRecognition (usa Chrome en Android/desktop)");
    return;
  }

  recognizer = new SR();
  recognizer.lang = "it-IT";
  recognizer.continuous = true;
  recognizer.interimResults = false;

  speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "it-IT";
    utter.rate = 1;
    speechSynthesis.speak(utter);
  };
}

initVoice();
