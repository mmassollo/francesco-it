// Mapa de escenas y etiquetas bonitas
window.SceneMap = {
  citta:   { label: "Città",   sceneImg: "/images/scenes/citta-360.jpg" },
  colosseo:{ label: "Colosseo",sceneImg: "/images/scenes/colosseo-360.jpg" },
  albergo: { label: "Albergo", sceneImg: "/images/scenes/albergo-360.jpg" },
  spiaggia:{ label: "Spiaggia",sceneImg: "/images/scenes/spiaggia-360.jpg" },
};

// Helpers de storage
window.AppStore = {
  setLevel: (lvl) => localStorage.setItem("level", lvl),
  getLevel: () => localStorage.getItem("level"),
  setScene: (key) => localStorage.setItem("scene", key),
  getScene: () => localStorage.getItem("scene"),
  clear: () => { localStorage.removeItem("level"); localStorage.removeItem("scene"); }
};

// Labels globales
window.Labels = {
  it: { user: "Tu", bot: "Francesco", sys: "Sistema", err: "Errore di comunicazione con l'IA" },
  es: { user: "Tú", bot: "Francisco", sys: "Sistema", err: "Error de comunicación con la IA" },
  en: { user: "You", bot: "Frank", sys: "System", err: "Communication error with AI" },
  pt: { user: "Você", bot: "Francisco", sys: "Sistema", err: "Erro de comunicação com a IA" }
};

// Helpers de storage
window.AppStore = {
  setLevel: (lvl) => localStorage.setItem("level", lvl),
  getLevel: () => localStorage.getItem("level"),
  setScene: (key) => localStorage.setItem("scene", key),
  getScene: () => localStorage.getItem("scene"),
  setLang: (lng) => localStorage.setItem("language", lng),
  getLang: () => localStorage.getItem("language"),
  clear: () => { ["level","scene","language"].forEach(k=>localStorage.removeItem(k)); }
};
