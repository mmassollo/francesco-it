// Escenas multi-idioma
window.SceneLocales = {
  it: {
    albergo: { label: "Albergo", sceneImg:"/images/scenes/albergo-360.jpg", thumb:"/images/thumbnails/albergo-thumb.jpg" },
    citta:   { label: "Città",   sceneImg:"/images/scenes/citta-360.jpg",   thumb:"/images/thumbnails/citta-thumb.jpg" },
    ristorante:{ label: "Ristorante", sceneImg:"/images/scenes/ristorante-360.jpg", thumb:"/images/thumbnails/ristorante-thumb.jpg" },
    spiaggia:{ label: "Spiaggia",sceneImg:"/images/scenes/spiaggia-360.jpg", thumb:"/images/thumbnails/spiaggia-thumb.jpg" }
  },
  es: {
    albergo: { label: "Hotel", sceneImg:"/images/scenes/albergo-360.jpg", thumb:"/images/thumbnails/albergo-thumb.jpg" },
    citta:   { label: "Ciudad", sceneImg:"/images/scenes/citta-360.jpg", thumb:"/images/thumbnails/citta-thumb.jpg" },
    ristorante:{ label: "Restaurante", sceneImg:"/images/scenes/ristorante-360.jpg", thumb:"/images/thumbnails/ristorante-thumb.jpg" },
    spiaggia:{ label: "Playa", sceneImg:"/images/scenes/spiaggia-360.jpg", thumb:"/images/thumbnails/spiaggia-thumb.jpg" }
  },
  en: {
    albergo: { label: "Hotel", sceneImg:"/images/scenes/albergo-360.jpg", thumb:"/images/thumbnails/albergo-thumb.jpg" },
    citta:   { label: "City", sceneImg:"/images/scenes/citta-360.jpg", thumb:"/images/thumbnails/citta-thumb.jpg" },
    ristorante:{ label: "Restaurant", sceneImg:"/images/scenes/ristorante-360.jpg", thumb:"/images/thumbnails/ristorante-thumb.jpg" },
    spiaggia:{ label: "Beach", sceneImg:"/images/scenes/spiaggia-360.jpg", thumb:"/images/thumbnails/spiaggia-thumb.jpg" }
  },
  pt: {
    albergo: { label: "Hotel", sceneImg:"/images/scenes/albergo-360.jpg", thumb:"/images/thumbnails/albergo-thumb.jpg" },
    citta:   { label: "Cidade", sceneImg:"/images/scenes/citta-360.jpg", thumb:"/images/thumbnails/citta-thumb.jpg" },
    ristorante:{ label: "Restaurante", sceneImg:"/images/scenes/ristorante-360.jpg", thumb:"/images/thumbnails/ristorante-thumb.jpg" },
    spiaggia:{ label: "Praia", sceneImg:"/images/scenes/spiaggia-360.jpg", thumb:"/images/thumbnails/spiaggia-thumb.jpg" }
  }
};

// Etiquetas de chat
window.Labels = {
  it: { user: "Tu", bot: "Francesco", sys: "Sistema", err: "Errore di comunicazione con l'IA" },
  es: { user: "Tú", bot: "Francisco", sys: "Sistema", err: "Error de comunicación con la IA" },
  en: { user: "You", bot: "Frank", sys: "System", err: "Communication error with AI" },
  pt: { user: "Você", bot: "Francisco", sys: "Sistema", err: "Erro de comunicação com a IA" }
};

// Textos de interfaz
window.UIStrings = {
  it: {
    back: "Indietro",
    start: "Inizia",
    continue: "Continua",
    chooseScene: "Scegli uno scenario",
    chooseLang: "Seleziona la lingua",
    chooseLevel: "Scegli il tuo livello per iniziare",
    talk: "Parla"
  },
  es: {
    back: "Atrás",
    start: "Comenzar",
    continue: "Continuar",
    chooseScene: "Elige un escenario",
    chooseLang: "Selecciona idioma",
    chooseLevel: "Elige tu nivel para comenzar",
    talk: "Hablar"
  },
  en: {
    back: "Back",
    start: "Start",
    continue: "Continue",
    chooseScene: "Choose a scene",
    chooseLang: "Select Language",
    chooseLevel: "Choose your level to start",
    talk: "Speak"
  },
  pt: {
    back: "Voltar",
    start: "Começar",
    continue: "Continuar",
    chooseScene: "Escolha um cenário",
    chooseLang: "Selecionar idioma",
    chooseLevel: "Escolha o seu nível para começar",
    talk: "Falar"
  }
};

// Helpers de almacenamiento
window.AppStore = {
  setLevel: (lvl) => localStorage.setItem("level", lvl),
  getLevel: () => localStorage.getItem("level"),
  setScene: (key) => localStorage.setItem("scene", key),
  getScene: () => localStorage.getItem("scene"),
  setLang: (lng) => localStorage.setItem("language", lng),
  getLang: () => localStorage.getItem("language") || (navigator.language || "en").slice(0,2),
  clear: () => { ["level","scene","language"].forEach(k=>localStorage.removeItem(k)); }
};
