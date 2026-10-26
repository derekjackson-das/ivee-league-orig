// Inquiry form: pre-fill from the calculator and date checker, validate with a linked error summary, confirm.
import { loadJSON, money, formatDate, parseISODate, storage, HANDOFF_KEY, INQUIRY_KEY } from "./data.js";

const form = document.getElementById("inquiry");
const summary = document.getElementById("error-summary");
const errorList = document.getElementById("error-list");
const attached = document.getElementById("estimate-attached");
const attachedText = document.getElementById("estimate-attached-text");
const attachedField = document.getElementById("estimate-field");
const changeLink = document.getElementById("estimate-change");

// ---- Pre-fill: URL parameters first, then sessionStorage, then nothing ----
async function prefill() {
  const params = new URLSearchParams(location.search);
  const stored = storage.get(HANDOFF_KEY) || {};
  let estimate = null;
  let date = params.get("date") || stored.date || "";

  if (params.has("tier") && params.has("low")) {
    estimate = Object.fromEntries(params.entries());
  } else if (stored.estimate) {
    estimate = stored.estimate;
  }

  if (date && parseISODate(date)) form.elements.date.value = date;

  if (estimate) {
    form.elements.package.value = estimate.tier;
    let pricing = null;
    try { pricing = await loadJSON("pricing.json"); } catch { /* fall back to ids */ }
    const tier = pricing?.tiers.find((t) => t.id === estimate.tier);
    const travel = pricing?.travelBands.find((b) => b.id === estimate.travel);
    const parts = [
      `${tier?.name || estimate.tier}, ${estimate.hours} hours`,
      Number(estimate.second) ? "second photographer" : null,
      Number(estimate.engagement) ? "engagement session" : null,
      Number(estimate.album) ? "album" : null,
      travel && travel.price > 0 ? `travel ${travel.label.split(" (")[0].toLowerCase()}` : null,
    ].filter(Boolean);
    const text = `${money(estimate.low)} to ${money(estimate.high)}: ${parts.join(", ")}. Sample pricing for demo purposes.`;
    attachedText.textContent = text;
    attachedField.value = text;
    const q = new URLSearchParams({ tier: estimate.tier, hours: estimate.hours, second: estimate.second, engagement: estimate.engagement, album: estimate.album, travel: estimate.travel });
    changeLink.href = `calculator.html?${q}`;
    attached.hidden = false;
  }
}

document.getElementById("estimate-remove").addEventListener("click", () => {
  attached.hidden = true;
  attachedField.value = "";
  const stored = storage.get(HANDOFF_KEY) || {};
  delete stored.estimate;
  storage.set(HANDOFF_KEY, stored);
  form.elements.package.focus();
});

// ---- Validation ----
const rules = [
  { id: "names", test: (v) => v.trim().length > 0, message: "Enter your names." },
  { id: "email", test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: "Enter an email address in the form name@example.com." },
  { id: "phone", test: (v) => v.trim() === "" || v.replace(/\D/g, "").length >= 7, message: "Enter a phone number with at least 7 digits, or leave it blank." },
  { id: "date", test: (v) => v === "" || parseISODate(v) !== null, message: "Enter a valid date, or leave it blank." },
  { id: "venue", test: (v) => v.trim().length > 0, message: "Enter the venue or city." },
  { id: "guests", test: (v) => v !== "", message: "Choose a guest count range." },
  { id: "package", test: (v) => v !== "", message: "Choose a package, or \"Not sure yet\"." },
  { id: "message", test: (v) => v.trim().length > 0, message: "Tell me a little about your day." },
];

function fieldWrap(id) { return document.getElementById(id).closest(".field"); }

function clearErrors() {
  rules.forEach(({ id }) => {
    const el = document.getElementById(id);
    el.removeAttribute("aria-invalid");
    const err = document.getElementById(`${id}-error`);
    if (err) err.remove();
    const ids = (el.getAttribute("aria-describedby") || "").split(" ").filter((x) => x && x !== `${id}-error`);
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" ")); else el.removeAttribute("aria-describedby");
    fieldWrap(id).classList.remove("has-error");
  });
  summary.hidden = true;
  errorList.replaceChildren();
}

function showErrors(errors) {
  errors.forEach(({ id, message }) => {
    const el = document.getElementById(id);
    el.setAttribute("aria-invalid", "true");
    const err = document.createElement("p");
    err.className = "error-text";
    err.id = `${id}-error`;
    err.textContent = message;
    fieldWrap(id).classList.add("has-error");
    el.insertAdjacentElement("afterend", err);
    const ids = (el.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
    el.setAttribute("aria-describedby", [...ids, err.id].join(" "));

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = message;
    a.addEventListener("click", (e) => { e.preventDefault(); el.focus(); el.scrollIntoView({ block: "center" }); });
    li.append(a);
    errorList.append(li);
  });
  summary.hidden = false;
  summary.focus();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();
  const errors = rules.filter(({ id, test }) => !test(form.elements[id].value)).map(({ id, message }) => ({ id, message }));
  if (errors.length) { showErrors(errors); return; }

  const data = Object.fromEntries(new FormData(form).entries());
  storage.set(INQUIRY_KEY, {
    names: data.names.trim(),
    date: data.date ? formatDate(data.date) : "",
    estimate: data.estimate || "",
  });
  storage.remove(HANDOFF_KEY);
  location.href = "confirmation.html";
});

prefill();
