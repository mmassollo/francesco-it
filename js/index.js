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
  localStorage.setItem("level", selected);
  window.location.href = "/scene.html";
});
