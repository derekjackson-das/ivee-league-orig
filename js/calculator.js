// Cost calculator: reads pricing.json, keeps the breakdown current, and announces only the total.
import { loadJSON, money, storage, HANDOFF_KEY } from "./data.js";

const form = document.getElementById("calculator");
const totalEl = document.getElementById("estimate-total");
const bodyEl = document.querySelector("#breakdown tbody");
const subtotalEl = document.getElementById("breakdown-subtotal");
const sendLink = document.getElementById("send-estimate");
const hoursInput = document.getElementById("hours");
const hoursHint = document.getElementById("hours-hint");
const second = document.getElementById("second");
const secondHint = document.getElementById("second-hint");
const engagement = document.getElementById("engagement");
const engagementHint = document.getElementById("engagement-hint");

let pricing;
let announceTimer;

function tier() {
  const id = form.elements.tier.value;
  return pricing.tiers.find((t) => t.id === id);
}

// Hours stay inside the tier's included-to-maximum window.
function syncTier() {
  const t = tier();
  hoursInput.min = t.includedHours;
  hoursInput.max = t.maxHours;
  const extraMax = t.maxHours - t.includedHours;
  hoursHint.textContent = `${t.name} includes ${t.includedHours} hours. Add up to ${extraMax} more at ${money(pricing.addOns.extraHour.price)} each.`;
  let h = Number(hoursInput.value);
  if (!Number.isFinite(h)) h = t.includedHours;
  hoursInput.value = Math.min(Math.max(h, t.includedHours), t.maxHours);

  second.disabled = !t.secondShooterAllowed;
  if (!t.secondShooterAllowed) second.checked = false;
  secondHint.textContent = t.secondShooterAllowed ? "" : `Not available on the ${t.name} package.`;

  const included = (pricing.addOns.engagementSession.includedInTiers || []).includes(t.id);
  engagement.disabled = included;
  if (included) engagement.checked = true;
  engagementHint.textContent = included ? `Included with ${t.name}.` : "";
}

function compute() {
  const t = tier();
  const hours = Number(hoursInput.value) || t.includedHours;
  const extra = Math.max(0, hours - t.includedHours);
  const add = pricing.addOns;
  const travel = pricing.travelBands.find((b) => b.id === form.elements.travel.value) || pricing.travelBands[0];
  const engagementIncluded = (add.engagementSession.includedInTiers || []).includes(t.id);

  const lines = [
    { label: `${t.name} package, ${t.includedHours} hours`, amount: t.basePrice },
  ];
  if (extra > 0) lines.push({ label: `${extra} additional ${extra === 1 ? "hour" : "hours"} at ${money(add.extraHour.price)}`, amount: extra * add.extraHour.price });
  if (second.checked && t.secondShooterAllowed) lines.push({ label: add.secondShooter.label, amount: add.secondShooter.price });
  if (engagementIncluded) lines.push({ label: `${add.engagementSession.label} (included)`, amount: 0 });
  else if (engagement.checked) lines.push({ label: add.engagementSession.label, amount: add.engagementSession.price });
  if (form.elements.album.checked) lines.push({ label: add.album.label, amount: add.album.price });
  if (travel.price > 0) lines.push({ label: `Travel: ${travel.label}`, amount: travel.price });

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const spread = pricing.estimateSpread;
  const roundTo = spread.roundTo || 1;
  const low = Math.round((subtotal * (1 + spread.low)) / roundTo) * roundTo;
  const high = Math.round((subtotal * (1 + spread.high)) / roundTo) * roundTo;

  return {
    lines, subtotal, low, high,
    selections: {
      tier: t.id, tierName: t.name, hours,
      second: second.checked && t.secondShooterAllowed ? 1 : 0,
      engagement: engagement.checked || engagementIncluded ? 1 : 0,
      album: form.elements.album.checked ? 1 : 0,
      travel: travel.id,
    },
  };
}

function render({ lines, subtotal, low, high, selections }, { announce }) {
  bodyEl.replaceChildren(...lines.map((l) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th"); th.scope = "row"; th.textContent = l.label;
    const td = document.createElement("td"); td.textContent = l.amount === 0 ? "Included" : money(l.amount);
    tr.append(th, td);
    return tr;
  }));
  subtotalEl.textContent = money(subtotal);

  const params = new URLSearchParams({ ...selections, low, high });
  sendLink.href = `inquire.html?${params}`;
  storage.set(HANDOFF_KEY, { ...(storage.get(HANDOFF_KEY) || {}), estimate: { ...selections, low, high } });

  // The live region gets the final value only. Typing in the hours field is debounced so
  // a screen reader hears one estimate, not one per keystroke.
  const text = `Estimated ${money(low)} to ${money(high)}`;
  clearTimeout(announceTimer);
  if (announce === "now") totalEl.textContent = text;
  else announceTimer = setTimeout(() => { totalEl.textContent = text; }, 700);
}

function update(announce) {
  render(compute(), { announce });
}

async function init() {
  try {
    pricing = await loadJSON("pricing.json");
  } catch (err) {
    totalEl.textContent = "The calculator could not load its price list. The packages page lists the same prices.";
    console.error(err);
    return;
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "tier") syncTier();
    update("now");
  });
  hoursInput.addEventListener("input", () => update("later"));
  form.querySelectorAll("[data-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = (Number(hoursInput.value) || Number(hoursInput.min)) + Number(btn.dataset.step);
      hoursInput.value = Math.min(Math.max(next, Number(hoursInput.min)), Number(hoursInput.max));
      update("now");
    });
  });
  form.addEventListener("submit", (e) => e.preventDefault());

  // "Change the estimate" from the inquiry page carries the selections back here.
  const params = new URLSearchParams(location.search);
  if (params.has("tier") && pricing.tiers.some((t) => t.id === params.get("tier"))) {
    form.elements.tier.value = params.get("tier");
    if (params.has("hours")) hoursInput.value = params.get("hours");
    second.checked = params.get("second") === "1";
    engagement.checked = params.get("engagement") === "1";
    form.elements.album.checked = params.get("album") === "1";
    if (params.has("travel")) form.elements.travel.value = params.get("travel");
  }

  syncTier();
  update("now");
}

init();
