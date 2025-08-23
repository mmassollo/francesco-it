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
