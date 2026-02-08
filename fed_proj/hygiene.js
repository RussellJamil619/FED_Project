const STORE_KEY = "sg_hawker_hygiene_v2";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function defaultData() {
  return {
    stalls: [
      { id: "chicken-rice", name: "Chicken Rice" },
      { id: "curry", name: "Curry" },
      { id: "thai-food", name: "Thai Food" },
      { id: "nasi-lemak", name: "Nasi Lemak" },
      { id: "traditional-desserts", name: "Traditional Desserts" },
      { id: "drinks", name: "Drinks" }
    ],
    inspections: [
      { stallId: "chicken-rice", date: "2026-01-05", grade: "A", score: 95, remarks: "Excellent hygiene standard" },
      { stallId: "curry", date: "2026-01-06", grade: "B", score: 85, remarks: "Good hygiene, improve storage labeling" },
      { stallId: "thai-food", date: "2026-01-07", grade: "A", score: 92, remarks: "Very good practices observed" },
      { stallId: "nasi-lemak", date: "2026-01-08", grade: "B", score: 82, remarks: "Good, ensure handwash consistency" },
      { stallId: "traditional-desserts", date: "2026-01-09", grade: "A", score: 90, remarks: "Clean prep area and utensils" },
      { stallId: "drinks", date: "2026-01-10", grade: "C", score: 75, remarks: "Fair, improve ice handling and sanitizing" }
    ],
    auth: {
      email: "officer@sg-hawker.com",
      password: "password123"
    }
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const seed = defaultData();
      localStorage.setItem(STORE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    const seed = defaultData();
    localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function getStalls() {
  return loadData().stalls;
}

function getLatestInspectionForStall(stallId) {
  const data = loadData();
  const list = data.inspections.filter(x => x.stallId === stallId);
  list.sort((a, b) => (a.date < b.date ? 1 : -1));
  return list[0] || null;
}

function getInspectionHistoryForStall(stallId) {
  const data = loadData();
  const list = data.inspections.filter(x => x.stallId === stallId);
  list.sort((a, b) => (a.date < b.date ? 1 : -1));
  return list;
}

function addInspection({ stallId, date, grade, score, remarks }) {
  const data = loadData();
  data.inspections.push({
    stallId,
    date: date || todayISO(),
    grade: String(grade || "").toUpperCase(),
    score: Number(score),
    remarks: remarks || ""
  });
  saveData(data);
}

function verifyLogin(email, password) {
  const data = loadData();
  return email === data.auth.email && password === data.auth.password;
}

function resetPassword(email, newPassword) {
  const data = loadData();
  if (email !== data.auth.email) return false;
  data.auth.password = newPassword;
  saveData(data);
  return true;
}

/* expose globally so your pages can use it without modules */
window.AppData = {
  loadData,
  saveData,
  getStalls,
  getLatestInspectionForStall,
  getInspectionHistoryForStall,
  addInspection,
  verifyLogin,
  resetPassword
};


