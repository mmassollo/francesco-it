const bubbles = [...document.querySelectorAll(".level-bubble")];
const btn = document.getElementById("continueBtn");

let selected = null;

bubbles.forEach(b => {
  b.addEventListener("click", () => {
    bubbles.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    selected = b.dataset.level;
    btn.disabled = false;
  });
});

btn.addEventListener("click", () => {
  if (!selected) return;
  AppStore.setLevel(selected);   // ✅ usamos AppStore en vez de localStorage
  window.location.href = "/scene.html";
});
