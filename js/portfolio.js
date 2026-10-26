// Portfolio: category filters with aria-pressed, and a lightbox built on the native dialog.
const grid = document.getElementById("portfolio-grid");
const items = [...grid.querySelectorAll("li")];
const filterBar = document.getElementById("portfolio-filters");
const status = document.getElementById("filter-status");
const dialog = document.getElementById("lightbox");
const dlgImg = document.getElementById("lightbox-img");
const dlgTitle = document.getElementById("lightbox-title");
const dlgDesc = document.getElementById("lightbox-desc");
const prevBtn = document.getElementById("lightbox-prev");
const nextBtn = document.getElementById("lightbox-next");
const closeBtn = document.getElementById("lightbox-close");

const categories = [
  ["all", "All"], ["ceremony", "Ceremony"], ["portraits", "Portraits"], ["details", "Details"], ["reception", "Reception"],
];

// ---- Filters ----
function applyFilter(cat) {
  let shown = 0;
  items.forEach((li) => {
    const match = cat === "all" || li.dataset.category === cat;
    li.hidden = !match;
    if (match) shown += 1;
  });
  filterBar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
  const label = categories.find(([id]) => id === cat)[1].toLowerCase();
  status.textContent = cat === "all" ? `Showing all ${shown} photographs.` : `Showing ${shown} ${label} photographs.`;
}

categories.forEach(([id, label]) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.dataset.filter = id;
  b.textContent = label;
  b.setAttribute("aria-pressed", String(id === "all"));
  b.addEventListener("click", () => applyFilter(id));
  filterBar.append(b);
});
filterBar.hidden = false;

// ---- Lightbox ----
let opener = null;
let current = 0;

function visible() { return items.filter((li) => !li.hidden); }

function showIndex(i) {
  const list = visible();
  current = (i + list.length) % list.length;
  const li = list[current];
  const img = li.querySelector("img");
  dlgImg.src = img.dataset.full || img.currentSrc || img.src;
  dlgImg.alt = img.alt;
  dlgTitle.textContent = `Photo ${current + 1} of ${list.length}: ${li.querySelector("figcaption").textContent}`;
  dlgDesc.textContent = img.alt;
}

function open(li, button) {
  opener = button;
  showIndex(visible().indexOf(li));
  dialog.showModal();
  closeBtn.focus();
}

// Only wrap thumbnails in buttons once the script runs, so without JS they stay plain images.
items.forEach((li) => {
  const img = li.querySelector("img");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "thumb";
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-label", `View larger: ${img.alt}`);
  img.replaceWith(btn);
  btn.append(img);
  btn.addEventListener("click", () => open(li, btn));
});

prevBtn.addEventListener("click", () => showIndex(current - 1));
nextBtn.addEventListener("click", () => showIndex(current + 1));
closeBtn.addEventListener("click", () => dialog.close());
dialog.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") { e.preventDefault(); showIndex(current - 1); }
  if (e.key === "ArrowRight") { e.preventDefault(); showIndex(current + 1); }
});
// Native dialog handles Escape and the focus trap; we handle focus return.
dialog.addEventListener("close", () => { if (opener) opener.focus(); });
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
