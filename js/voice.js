// voice.js
let recognizer;
let speak;

function initVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Este navegador no soporta SpeechRecognition (usá Chrome en Android/desktop)");
    return;
  }

  recognizer = new SR();
  recognizer.lang = "it-IT";
  recognizer.continuous = true; // conversación continua
  recognizer.interimResults = false;

  speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "it-IT";
    utter.rate = 1;
    speechSynthesis.speak(utter);
  };
}

initVoice();
