// Shared helpers: data loading, formatting, and storage that never throws.
const dataBase = new URL("../data/", import.meta.url);

export async function loadJSON(name) {
  const response = await fetch(new URL(name, dataBase));
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  return response.json();
}

export const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

// ISO "YYYY-MM-DD" to a local Date, avoiding the UTC shift that new Date(iso) causes.
export function parseISODate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(iso) {
  const d = parseISODate(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(d);
}

// sessionStorage can be blocked (private mode, policy). Every call degrades to "nothing stored".
export const storage = {
  get(key) { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } },
  set(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
  remove(key) { try { sessionStorage.removeItem(key); } catch { /* nothing to do */ } },
};

export const HANDOFF_KEY = "ivee-handoff";
export const INQUIRY_KEY = "ivee-inquiry";
