import { getStalls } from "./hygiene-store.js";

export function setActiveNav(current){
  const links = document.querySelectorAll("[data-nav]");
  links.forEach(a => {
    a.classList.toggle("active", a.getAttribute("data-nav") === current);
  });
}

export function fillStallSelect(selectEl, opts = {}){
  const stalls = getStalls();
  selectEl.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = opts.placeholder || "Choose a Stall...";
  selectEl.appendChild(placeholder);

  stalls.forEach(s => {
    const op = document.createElement("option");
    op.value = s.id;
    op.textContent = s.name;
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
  const [y,m,d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

export function gradeMeaning(grade){
  const map = {
    A: "Excellence - Outstanding hygiene standard",
    B: "Good - Meets hygiene standard",
    C: "Fair - Needs improvement",
    D: "Poor - Below hygiene standard"
  };
  return map[grade] || "-";
}

export function scoreToGrade(score){
  const s = Number(score);
  if(s >= 90) return "A";
  if(s >= 80) return "B";
  if(s >= 70) return "C";
  return "D";
}
