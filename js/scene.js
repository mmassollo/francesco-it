const goBtn = document.getElementById("goBtn");
const backBtn = document.getElementById("backBtn");
const thumbs = [...document.querySelectorAll(".scene-item")];

let selected = null;

if (!localStorage.getItem("level")) {
  window.location.replace("/index.html");
}

thumbs.forEach(t => {
  t.addEventListener("click", () => {
    thumbs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    selected = t.dataset.scene;
    goBtn.disabled = false;
  });
});

goBtn.addEventListener("click", () => {
  if (!selected) return;
  localStorage.setItem("scene", selected);
  window.location.href = "/chat.html";
});

backBtn.addEventListener("click", () => {
  window.location.href = "/index.html";
});

// Escenas multi-idioma
window.SceneLocales = {
  it: {
    albergo: { label: "Albergo", sceneImg:"/images/scenes/albergo-360.jpg", thumb:"/images/thumbnails/albergo-thumb.jpg" },
    citta:   { label: "Città",   sceneImg:"/images/scenes/citta-360.jpg", thumb:"/images/thumbnails/citta-thumb.jpg" },
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
