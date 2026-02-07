// js/hygiene-store.js

const STALLS_KEY = "hygiene_stalls";
const INSPECTIONS_KEY = "hygiene_inspections";
const LOGIN_KEY = "hygiene_login_creds";

const DEFAULT_STALLS = [
  { id: "stall-01", name: "Ah Meng Chicken Rice" },
  { id: "stall-02", name: "Nasi Lemak" },
  { id: "stall-03", name: "Roasted Chicken Rice" },
  { id: "stall-04", name: "Traditional Desserts" }
];

const DEFAULT_INSPECTIONS = [
  { stallId: "stall-01", date: "2026-01-05", grade: "A", score: 95, remarks: "Excellent hygiene standard" },
  { stallId: "stall-01", date: "2025-12-10", grade: "A", score: 93, remarks: "Very good, minor improvement" }
];

const DEFAULT_LOGIN = { email: "officer@sg-hawker.com", password: "password123" };

function load(key, fallback){
  const raw = localStorage.getItem(key);
  if(!raw) return fallback;
  try{
    return JSON.parse(raw);
  }catch{
    return fallback;
  }
}

function save(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureArray(key, fallback){
  const v = load(key, null);
  if(!Array.isArray(v) || v.length === 0){
    save(key, fallback);
    return fallback;
  }
  return v;
}

function ensureObject(key, fallback){
  const v = load(key, null);
  if(!v || typeof v !== "object"){
    save(key, fallback);
    return fallback;
  }
  return v;
}

// Auto-fix / seed every time (this is the important part)
function init(){
  ensureArray(STALLS_KEY, DEFAULT_STALLS);
  const ins = load(INSPECTIONS_KEY, null);
  if(!Array.isArray(ins)) save(INSPECTIONS_KEY, DEFAULT_INSPECTIONS);
  ensureObject(LOGIN_KEY, DEFAULT_LOGIN);
}
init();

export function getStalls(){
  return ensureArray(STALLS_KEY, DEFAULT_STALLS);
}

export function verifyLogin(email, password){
  const creds = ensureObject(LOGIN_KEY, DEFAULT_LOGIN);
  return email === creds.email && password === creds.password;
}

export function setLoginPassword(newPassword){
  const creds = ensureObject(LOGIN_KEY, DEFAULT_LOGIN);
  save(LOGIN_KEY, { ...creds, password: String(newPassword) });
}

function getAllInspections(){
  const v = load(INSPECTIONS_KEY, []);
  return Array.isArray(v) ? v : [];
}

function setAllInspections(list){
  save(INSPECTIONS_KEY, list);
}

export function addInspection(record){
  const list = getAllInspections();

  const clean = {
    stallId: String(record.stallId || ""),
    date: record.date ? String(record.date) : new Date().toISOString().slice(0,10),
    grade: String(record.grade || "").toUpperCase(),
    score: Number(record.score),
    remarks: String(record.remarks || "")
  };

  list.unshift(clean);
  setAllInspections(list);
  return clean;
}

export function getInspectionHistoryForStall(stallId){
  const list = getAllInspections().filter(x => x.stallId === stallId).slice();
  list.sort((a,b) => String(b.date).localeCompare(String(a.date)));
  return list;
}

export function getLatestInspectionForStall(stallId){
  const list = getInspectionHistoryForStall(stallId);
  return list.length ? list[0] : null;
}

