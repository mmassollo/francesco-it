// ---- TTS (Text-to-Speech) ----
export function speak(text, lang = "it-IT") {
  if (!("speechSynthesis" in window)) {
    console.warn("speechSynthesis non disponibile");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  // Elegir una voz italiana si existe
  const voices = speechSynthesis.getVoices();
  const it = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("it"));
  if (it) utter.voice = it;
  speechSynthesis.cancel(); // corta cualquier lectura anterior
  speechSynthesis.speak(utter);
}

// ---- STT (Speech-to-Text) ----
export function createRecognizer({ lang = "it-IT", interim = false } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Il tuo browser non supporta Speech Recognition. Prova con Chrome.");
    return null;
  }
  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = interim;
  rec.maxAlternatives = 1;
  rec.continuous = false; // una frase por vez
  return rec;
}
