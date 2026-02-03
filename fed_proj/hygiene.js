const STORE_KEY = "sg_hawker_hygiene_v1";

function todayISO(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

function defaultData(){
  return {
    stalls: [
      { id:"stall-01", name:"Ah Meng Chicken Rice" },
      { id:"stall-02", name:"Nasi Lemak Corner" },
      { id:"stall-03", name:"Curry Fish Head" }
    ],
    inspections: [
      { stallId:"stall-01", date:"2026-01-05", grade:"A", score:95, remarks:"Excellence hygiene standard" },
      { stallId:"stall-01", date:"2025-12-10", grade:"A", score:93, remarks:"Very good, minor improvement" },
      { stallId:"stall-01", date:"2025-11-15", grade:"A", score:91, remarks:"Good practices observed" }
    ],
    auth: {
      email:"officer@sg-hawker.com",
      password:"password123"
    }
  };
}

export function loadData(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw){
      const seed = defaultData();
      localStorage.setItem(STORE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  }catch(e){
    const seed = defaultData();
    localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function saveData(data){
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function getStalls(){
  return loadData().stalls;
}

export function getLatestInspectionForStall(stallId){
  const data = loadData();
  const list = data.inspections.filter(x => x.stallId === stallId);
  list.sort((a,b)=> (a.date < b.date ? 1 : -1));
  return list[0] || null;
}

export function getInspectionHistoryForStall(stallId){
  const data = loadData();
  const list = data.inspections.filter(x => x.stallId === stallId);
  list.sort((a,b)=> (a.date < b.date ? 1 : -1));
  return list;
}

export function addInspection({ stallId, date, grade, score, remarks }){
  const data = loadData();
  data.inspections.push({
    stallId,
    date: date || todayISO(),
    grade,
    score: Number(score),
    remarks: remarks || ""
  });
  saveData(data);
}

export function verifyLogin(email, password){
  const data = loadData();
  return email === data.auth.email && password === data.auth.password;
}

export function resetPassword(email, newPassword){
  const data = loadData();
  if(email !== data.auth.email) return false;
  data.auth.password = newPassword;
  saveData(data);
  return true;
}
