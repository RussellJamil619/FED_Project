import { getStalls } from "./hygiene-store.js";

const STALLS_KEY = "hygiene_stalls";

const FALLBACK_STALLS = [
  { id: "stall-01", name: "Ah Meng Chicken Rice" },
  { id: "stall-02", name: "Nasi Lemak" },
  { id: "stall-03", name: "Roasted Chicken Rice" },
  { id: "stall-04", name: "Traditional Desserts" }
];

function ensureStallsExist(){
  // If store returns empty, seed localStorage stalls
  let stalls = [];
  try{
    stalls = getStalls() || [];
  }catch{
    stalls = [];
  }

  if(Array.isArray(stalls) && stalls.length > 0) return stalls;

  // If localStorage has empty/invalid stalls, fix it
  const raw = localStorage.getItem(STALLS_KEY);
  try{
    const parsed = raw ? JSON.parse(raw) : null;
    if(Array.isArray(parsed) && parsed.length > 0){
      return parsed;
    }
  }catch{}

  localStorage.setItem(STALLS_KEY, JSON.stringify(FALLBACK_STALLS));
  return FALLBACK_STALLS;
}

export function setActiveNav(current){
  const links = document.querySelectorAll("[data-nav]");
  links.forEach(a => {
    a.classList.toggle("active", a.getAttribute("data-nav") === current);
  });
}

export function fillStallSelect(selectEl, opts = {}){
  const stalls = ensureStallsExist();

  selectEl.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = opts.placeholder || "Choose a Stall...";
  selectEl.appendChild(placeholder);

  stalls.forEach(s => {
    // tolerate bad data shape
    const id = s.id ?? s.stallId ?? "";
    const name = s.name ?? s.stallName ?? "Unnamed Stall";
    if(!id) return;

    const op = document.createElement("option");
    op.value = id;
    op.textContent = name;
    selectEl.appendChild(op);
  });

  const remembered = localStorage.getItem("selected_stall_id") || "";
  if(opts.useRemembered && remembered){
    selectEl.value = remembered;
  }
}

export function rememberStall(stallId){
  localStorage.setItem("selected_stall_id", stallId || "");
}

export function prettyDate(iso){
  if(!iso) return "";
  const [y,m,d] = String(iso).split("-");
  if(!y || !m || !d) return String(iso);
  return `${d}/${m}/${y.slice(2)}`;
}

export function gradeMeaning(grade){
  const map = {
    A: "Excellence - Outstanding hygiene standard",
    B: "Good - Meets hygiene standard",
    C: "Fair - Needs improvement",
    D: "Poor - Below hygiene standard"
  };
  return map[String(grade || "").toUpperCase()] || "-";
}

export function scoreToGrade(score){
  const s = Number(score);
  if(Number.isNaN(s)) return "";
  if(s >= 90) return "A";
  if(s >= 80) return "B";
  if(s >= 70) return "C";
  return "D";
}
