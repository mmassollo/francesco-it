// voice.js
let recognizer;
let speak;

function initVoice() {
  // STT
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Este navegador no soporta SpeechRecognition (usá Chrome en Android/desktop)");
    return;
  }
  recognizer = new SR();
  recognizer.lang = "it-IT";
  recognizer.continuous = false;

  // TTS
  speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "it-IT";
    speechSynthesis.speak(utter);
  };
}

initVoice();
