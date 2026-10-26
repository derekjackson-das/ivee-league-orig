// Date checker: one field, three answers, result announced politely and shown as text.
import { loadJSON, parseISODate, formatDate, storage, HANDOFF_KEY } from "./data.js";

const form = document.getElementById("date-form");
const input = document.getElementById("check-date");
const errorEl = document.getElementById("check-date-error");
const result = document.getElementById("date-result");
const inquiryDate = document.getElementById("date");

let dates = { statuses: {}, dates: {} };
loadJSON("sample-dates.json").then((d) => { dates = d; }).catch((err) => console.error(err));

const MONTHS_AHEAD = 24;

function setError(message) {
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", "check-date-hint check-date-error");
    input.closest(".field").classList.add("has-error");
  } else {
    errorEl.hidden = true;
    errorEl.textContent = "";
    input.removeAttribute("aria-invalid");
    input.setAttribute("aria-describedby", "check-date-hint");
    input.closest(".field").classList.remove("has-error");
  }
}

function show(status, html, iso) {
  result.dataset.status = status;
  result.innerHTML = html;
  const btn = result.querySelector("[data-inquire]");
  if (btn) {
    btn.addEventListener("click", () => {
      inquiryDate.value = iso;
      storage.set(HANDOFF_KEY, { ...(storage.get(HANDOFF_KEY) || {}), date: iso });
      inquiryDate.focus();
    });
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const iso = input.value;
  const d = parseISODate(iso);
  if (!d) {
    setError("Enter a date to check, like 2027-06-12.");
    result.textContent = "";
    input.focus();
    return;
  }
  setError("");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const limit = new Date(today); limit.setMonth(limit.getMonth() + MONTHS_AHEAD);
  const pretty = formatDate(iso);

  if (d < today) {
    show("past", `<p><strong>${pretty} has already passed.</strong> Try a date from today onward.</p>`);
    return;
  }
  if (d > limit) {
    const opens = new Date(d); opens.setMonth(opens.getMonth() - MONTHS_AHEAD);
    const opensPretty = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(opens);
    show("later", `<p><strong>${pretty} is more than ${MONTHS_AHEAD} months away.</strong> Bookings for that date open on ${opensPretty}. Send an inquiry anyway and I'll keep your note on file.</p>`);
    return;
  }

  const status = dates.dates[iso] || "available";
  const label = dates.statuses[status] || status;
  const inquire = `<p><button type="button" class="button button-gold" data-inquire>Inquire about this date</button></p>`;
  if (status === "available") {
    show(status, `<p><strong>${label}.</strong> ${pretty} is open.</p>${inquire}`, iso);
  } else if (status === "limited") {
    show(status, `<p><strong>${label}.</strong> Steven is already booked on ${pretty}, but a second photographer from the studio can cover it at the same package prices.</p>${inquire}`, iso);
  } else {
    show(status, `<p><strong>${label}.</strong> ${pretty} is taken. Try the Friday or Sunday either side, or a nearby weekend.</p>`);
  }
});
