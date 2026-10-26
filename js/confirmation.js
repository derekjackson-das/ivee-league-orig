// Confirmation: show what was "sent" if storage allowed it. Nothing leaves the browser.
import { storage, INQUIRY_KEY } from "./data.js";

const data = storage.get(INQUIRY_KEY);
if (data && data.names) {
  const intro = document.getElementById("confirmation-intro");
  intro.textContent = `Thanks, ${data.names}. Your inquiry is in.`;
  const box = document.getElementById("confirmation-summary");
  const bits = [];
  if (data.date) bits.push(`Wedding date: ${data.date}.`);
  if (data.estimate) bits.push(`Estimate attached: ${data.estimate}`);
  if (bits.length) {
    box.textContent = bits.join(" ");
    box.hidden = false;
  }
  storage.remove(INQUIRY_KEY);
}
