const goBtn = document.getElementById("goBtn");
const backBtn = document.getElementById("backBtn");
const thumbs = [...document.querySelectorAll(".thumb")];

let selected = null;

if (!localStorage.getItem("level")) {
  // Si no eligió nivel, volver
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
