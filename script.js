/* Name & Username Generator (clean UI)
   - Dropdown is visible/clickable (z-index + overflow fix in CSS)
   - Names are non-repeating until pool is exhausted (bag shuffle)
   - Username regeneration is "unique-looking"
*/

const MAX_SECTIONS = 5;

const COUNTRIES = [
  "American","Arabic","Indian","Bangladeshi","Pakistani","Chinese","Japanese","Korean",
  "Spanish","French","German","Russian","Italian","Turkish"
];

// Names data is loaded on-demand per country to keep initial JS small.
// JSON files live in /data/<Country>.json  (e.g., /data/American.json)
const NAMES_CACHE = new Map(); // country -> {male:[], female:[]}

async function loadCountryNames(country){
  if (NAMES_CACHE.has(country)) return NAMES_CACHE.get(country);
  const res = await fetch(`data/${country}.json`, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load names for ${country}: ${res.status}`);
  const obj = await res.json();
  NAMES_CACHE.set(country, obj);
  return obj;
}

// ---------- Name pools ----------

// Global name "bags" so a shown name won't appear again until the pool is exhausted.
const nameBags = new Map(); // key => array (shuffled remaining)

function randInt(maxExclusive){
  if (maxExclusive <= 0) return 0;
  if (window.crypto && crypto.getRandomValues){
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFromBag(key, pool){
  if (!pool || !pool.length) return "—";
  let bag = nameBags.get(key);
  if (!bag || bag.length === 0){
    bag = shuffle(pool);
    nameBags.set(key, bag);
  }
  return bag.pop();
}

function pickRandomCountry(){ return COUNTRIES[randInt(COUNTRIES.length)]; }
function pickRandomGender(){ return randInt(2) === 0 ? "male" : "female"; }

// ---------- Username generation ----------
function normalizeForUsername(str){
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function randomDigits(len){
  let out = "";
  for (let i=0;i<len;i++) out += String(randInt(10));
  return out;
}
function randomLetters(len){
  const abc = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i=0;i<len;i++) out += abc[randInt(abc.length)];
  return out;
}

function generateUsernameFromName(name, usedSet){
  const year = new Date().getFullYear();
  const clean = normalizeForUsername(name);
  const parts = clean.split(" ").filter(Boolean);
  const first = parts[0] || "user";
  const last = parts[parts.length - 1] || first;

  const templates = [
    () => `${first}${last}x${randomDigits(2)}`,
    () => `${first}${randomDigits(1)}${last}`,
    () => `${first}${last}${randomDigits(4)}`,
    () => `${last}${first}${year}`,
    () => `${last}x${randomDigits(2)}${first}`,
    () => `${first}${randomDigits(4)}${last}`,
    () => `${first}${last}${randomLetters(1)}${randomDigits(2)}`,
    () => `${first}${randomLetters(2)}${last}${randomDigits(2)}`,
    () => `${last}${randomDigits(2)}${first}${randomDigits(2)}`,
    () => `${first}_${last}${randomDigits(3)}`,
    () => `${first}${randomLetters(1)}${last}${randomDigits(3)}`,
    () => `${last}_${first}${randomDigits(3)}`
  ];

  for (let attempt = 0; attempt < 40; attempt++){
    const maker = templates[randInt(templates.length)];
    let candidate = maker();

    if (candidate.length > 18) candidate = candidate.slice(0, 18);
    candidate = candidate.replace(/^[_\d]+/, "");
    if (!candidate) candidate = `${first}${randomDigits(4)}`;

    if (!usedSet || !usedSet.has(candidate)){
      usedSet?.add(candidate);
      return candidate;
    }
  }
  const fallback = `${first}${last}${randomDigits(5)}`.slice(0, 18);
  usedSet?.add(fallback);
  return fallback;
}

// ---------- Clipboard ----------
async function copyText(text){
  if (!text || text === "—") return false;
  try{
    if (navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(_){}

  try{
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }catch(_){
    return false;
  }
}

// ---------- UI ----------
const sectionsRoot = document.getElementById("sections");
const template = document.getElementById("sectionTemplate");
const addSectionBtn = document.getElementById("addSectionBtn");
const toastEl = document.getElementById("toast");

const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const themeIcon = document.getElementById("themeIcon");

let sectionCount = 0;

function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.remove("show");
  void toastEl.offsetWidth;
  toastEl.classList.add("show");
}

function closeAllMenus(exceptSelect){
  document.querySelectorAll(".select.open").forEach(sel => {
    if (sel !== exceptSelect) sel.classList.remove("open");
    sel.querySelector(".select-btn")?.setAttribute("aria-expanded","false");
  });
}

function setSelectValue(selectEl, label, value){
  selectEl.dataset.value = value;
  selectEl.querySelector(".select-value").textContent = label;
}

function buildCountryMenu(menuEl){
  menuEl.innerHTML = "";
  const items = [{label:"Random", value:"random"}, ...COUNTRIES.map(c => ({label:c, value:c}))];
  for (const it of items){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "select-item";
    btn.dataset.value = it.value;
    btn.textContent = it.label;
    menuEl.appendChild(btn);
  }
}

function resolveSelection(genderValue, countryValue){
  let country = countryValue === "random" ? pickRandomCountry() : countryValue;
  let gender = genderValue === "random" ? pickRandomGender() : genderValue;

  if (!COUNTRIES.includes(country)) country = pickRandomCountry();
  if (gender !== "male" && gender !== "female") gender = pickRandomGender();

  return { gender, country };
}

async function generateName({genderValue, countryValue}){
  const { gender, country } = resolveSelection(genderValue, countryValue);
  const countryData = await loadCountryNames(country);
  const pool = countryData?.[gender] || [];
  const key = `${country}|${gender}`;
  const name = pickFromBag(key, pool);
  return { name, gender, country };
}

function createSection(){
  sectionCount += 1;

  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector('[data-role="meta"]').textContent = `Section ${sectionCount}`;

  const state = {
    genderValue: "random",
    countryValue: "random",
    currentName: "",
    usernameUsed: new Map(), // nameKey -> Set(usernames)
  };

  const removeBtn = node.querySelector('[data-action="remove"]');
  if (sectionsRoot.children.length === 0){
    removeBtn.style.visibility = "hidden";
  }

  const countrySelect = node.querySelector('.select[data-role="country"]');
  const countryMenu = countrySelect.querySelector('[data-role="countryMenu"]');
  buildCountryMenu(countryMenu);

  node.querySelectorAll(".select").forEach(selectEl => {
    const btn = selectEl.querySelector(".select-btn");
    const menu = selectEl.querySelector(".select-menu");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = selectEl.classList.contains("open");
      closeAllMenus(selectEl);
      selectEl.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });

    // Important: stop propagation so outside click handler doesn't instantly close while interacting/scrolling
    menu.addEventListener("pointerdown", (e) => e.stopPropagation());
    menu.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = e.target.closest(".select-item");
      if (!item) return;

      const value = item.dataset.value;
      const label = item.textContent.trim();

      setSelectValue(selectEl, label, value);

      if (selectEl.dataset.role === "gender") state.genderValue = value;
      if (selectEl.dataset.role === "country") state.countryValue = value;

      selectEl.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  const nameEl = node.querySelector('[data-role="nameValue"]');
  const usernameEl = node.querySelector('[data-role="usernameValue"]');

  function animatePop(el){
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  async function setNameAndUsername(){
    try{
      node.classList.add('loading');
      const { name } = await generateName({genderValue: state.genderValue, countryValue: state.countryValue});
    state.currentName = name;
    nameEl.textContent = name;
    animatePop(nameEl);

    const key = normalizeForUsername(name) || name;
    if (!state.usernameUsed.has(key)) state.usernameUsed.set(key, new Set());
    const usedSet = state.usernameUsed.get(key);

    const uname = generateUsernameFromName(name, usedSet);
    usernameEl.textContent = uname;
    animatePop(usernameEl);
    }catch(err){
      console.error(err);
      toast('Names load failed. Check data files / hosting.');
    }finally{
      node.classList.remove('loading');
    }
  }

  node.querySelector('[data-action="generate"]').addEventListener("click", setNameAndUsername);

  node.querySelector('[data-action="regenUsername"]').addEventListener("click", (e) => {
    e.stopPropagation();

    // visual feedback
    const regenBtn = e.currentTarget;
    regenBtn.classList.add("spin");
    setTimeout(() => regenBtn.classList.remove("spin"), 520);

    const name = state.currentName || nameEl.textContent;
    if (!name || name === "—"){
      toast("Generate a name first");
      return;
    }
    const key = normalizeForUsername(name) || name;
    if (!state.usernameUsed.has(key)) state.usernameUsed.set(key, new Set());
    const usedSet = state.usernameUsed.get(key);

    const uname = generateUsernameFromName(name, usedSet);
    usernameEl.textContent = uname;
    animatePop(usernameEl);
  });

  async function handleCopy(kind){
    const text = kind === "name" ? nameEl.textContent : usernameEl.textContent;
    const ok = await copyText(text);
    toast(ok ? `${kind === "name" ? "Name" : "Username"} copied` : "Copy failed (try HTTPS/localhost)");
  }

  const outName = node.querySelector('[data-action="copyName"]');
  const outUser = node.querySelector('[data-action="copyUsername"]');

  outName.addEventListener("click", () => handleCopy("name"));
  outUser.addEventListener("click", () => handleCopy("username"));

  for (const el of [outName, outUser]){
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        el.click();
      }
    });
  }

  removeBtn.addEventListener("click", () => {
    node.remove();
    const cards = Array.from(sectionsRoot.children);
    cards.forEach((c, idx) => {
      const rb = c.querySelector('[data-action="remove"]');
      if (!rb) return;
      rb.style.visibility = cards.length > 1 ? "visible" : "hidden";
      const m = c.querySelector('[data-role="meta"]');
      if (m) m.textContent = `Section ${idx + 1}`;
    });
    toast("Section removed");
    updateAddButtonState();
  });

  sectionsRoot.appendChild(node);
  updateAddButtonState();
}

function updateAddButtonState(){
  const n = sectionsRoot.children.length;
  addSectionBtn.disabled = n >= MAX_SECTIONS;
  addSectionBtn.title = addSectionBtn.disabled ? "Maximum 5 sections" : "Add section";
}

addSectionBtn.addEventListener("click", () => {
  if (sectionsRoot.children.length >= MAX_SECTIONS){
    toast("Max 5 sections reached");
    updateAddButtonState();
    return;
  }
  createSection();
  toast("New section added");
});

document.addEventListener("click", () => closeAllMenus(null));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllMenus(null); });

// ---------- Theme ----------
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeLabel.textContent = isDark ? "Dark" : "Light";
  themeIcon.textContent = isDark ? "🌙" : "☀️";
  try{ localStorage.setItem("ng_theme", theme); }catch(_){}
}

function getPreferredTheme(){
  try{
    const saved = localStorage.getItem("ng_theme");
    if (saved === "light" || saved === "dark") return saved;
  }catch(_){}
  try{
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (mq && mq.matches) return "dark";
  }catch(_){}
  return "light";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

// Boot
applyTheme(getPreferredTheme());
createSection();