// ✅ script.js (Leaderboard removed, image paths fixed)
let cookies = 0;
let cps = 0;
let multiplier = 1;

const cookieEl = document.getElementById("cookie");
const cookieDisplay = document.getElementById("cookies");
const cpsDisplay = document.getElementById("cps");
const multiplierDisplay = document.getElementById("multiplier");
const shopList = document.getElementById("shop-list");
const shopContainer = document.getElementById("shop-container");
const savePopup = document.getElementById("save-popup");

const gachaModal = document.getElementById("gacha-modal");
const gachaResult = document.getElementById("gacha-result");
const ownedSkinsDiv = document.getElementById("owned-skins");

const availableSkins = [
  { name: "Classic Cookie", src: "assets/cookie_default.png" },
  { name: "Choco Chip", src: "assets/cookie_choco.png" },
  { name: "Golden Cookie", src: "assets/cookie_gold.png" },
  { name: "Best Cookie", src: "assets/cookie_best.png" }
];

let currentSkin = "Classic Cookie";
let ownedSkins = ["Classic Cookie"];

// 20 Upgrades
const upgrades = [];
for (let i = 1; i <= 20; i++) {
  upgrades.push({
    name: `Upgrade ${i}`,
    cost: 50 * Math.pow(1.6, i),
    cps: 1 * Math.pow(1.4, i),
    owned: 0
  });
}

// Achievements
const achievements = [
  { id: "firstClick", label: "First Click", unlocked: false, condition: () => cookies >= 1 },
  { id: "100Cookies", label: "100 Cookies", unlocked: false, condition: () => cookies >= 100 },
  { id: "1KCookies", label: "1K Cookies", unlocked: false, condition: () => cookies >= 1000 },
  { id: "firstUpgrade", label: "Bought First Upgrade", unlocked: false, condition: () => upgrades.some(u => u.owned > 0) }
];

cookieEl.addEventListener("click", () => {
  cookies += 1 * multiplier;
  updateDisplay();
  checkAchievements();
});

function toggleShop() {
  shopContainer.style.display = shopContainer.style.display === "block" ? "none" : "block";
}

function renderShop() {
  shopList.innerHTML = "";
  upgrades.forEach((u, i) => {
    const div = document.createElement("div");
    div.className = "upgrade";
    div.textContent = `${u.name} (${Math.floor(u.cost)}) +${Math.floor(u.cps)} CPS (x${u.owned})`;
    div.onclick = () => buyUpgrade(i);
    shopList.appendChild(div);
  });
}

function buyUpgrade(i) {
  const u = upgrades[i];
  if (cookies >= u.cost) {
    cookies -= u.cost;
    cps += u.cps;
    u.owned++;
    u.cost *= 1.15;
    renderShop();
    updateDisplay();
    checkAchievements();
  }
}

function updateDisplay() {
  cookieDisplay.textContent = Math.floor(cookies);
  cpsDisplay.textContent = Math.floor(cps);
  multiplierDisplay.textContent = multiplier;
}

function saveGame() {
  const save = { cookies, cps, multiplier, upgrades, currentSkin, ownedSkins, achievements };
  localStorage.setItem("save", JSON.stringify(save));
  savePopup.style.opacity = "1";
  setTimeout(() => savePopup.style.opacity = "0", 2000);
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("save"));
  if (!save) return;
  cookies = save.cookies;
  cps = save.cps;
  multiplier = save.multiplier;
  currentSkin = save.currentSkin || "Classic Cookie";
  ownedSkins = save.ownedSkins || ["Classic Cookie"];
  if (save.achievements) {
    save.achievements.forEach(saved => {
      const a = achievements.find(a => a.id === saved.id);
      if (a) a.unlocked = saved.unlocked;
    });
  }
  save.upgrades.forEach((u, i) => Object.assign(upgrades[i], u));
  renderShop();
  updateDisplay();
  equipSkin(currentSkin);
  renderAchievements();
}

function resetGame() {
  if (!confirm("Reset game?")) return;
  cookies = 0;
  cps = 0;
  multiplier = 1;
  ownedSkins = ["Classic Cookie"];
  upgrades.forEach((u, i) => {
    u.owned = 0;
    u.cost = 50 * Math.pow(1.6, i + 1);
  });
  achievements.forEach(a => a.unlocked = false);
  renderShop();
  renderAchievements();
  updateDisplay();
  localStorage.removeItem("save");
}

function prestige() {
  if (cookies >= 100000) {
    cookies = 0;
    cps = 0;
    multiplier++;
    upgrades.forEach(u => {
      u.owned = 0;
      u.cost = 50 * Math.pow(1.6, 1 + upgrades.indexOf(u));
    });
    renderShop();
    updateDisplay();
  }
}

function changeTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.getElementById("theme-select").value = theme;
  changeTheme(theme);
}

setInterval(() => {
  cookies += cps;
  updateDisplay();
  checkAchievements();
}, 1000);

function openGacha() {
  gachaModal.classList.remove("hidden");
  updateOwnedSkins();
}

function closeGacha() {
  gachaModal.classList.add("hidden");
}

function rollGacha() {
  const roll = Math.random();
  let result;
  if (roll < 0.6) result = availableSkins[0];
  else if (roll < 0.85) result = availableSkins[1];
  else if (roll < 0.97) result = availableSkins[3];
  else result = availableSkins[2];

  if (!ownedSkins.includes(result.name)) {
    ownedSkins.push(result.name);
    gachaResult.textContent = `🎉 New Skin: ${result.name}`;
  } else {
    gachaResult.textContent = `Duplicate: ${result.name}`;
  }

  equipSkin(result.name);
  updateOwnedSkins();
  saveGame();
}

function equipSkin(name) {
  const skin = availableSkins.find(s => s.name === name);
  if (skin) {
    cookieEl.src = skin.src;
    currentSkin = name;
  }
}

function updateOwnedSkins() {
  ownedSkinsDiv.innerHTML = "<strong>Owned Skins:</strong><br>";
  ownedSkins.forEach(skin => {
    const btn = document.createElement("button");
    btn.textContent = skin;
    btn.onclick = () => equipSkin(skin);
    ownedSkinsDiv.appendChild(btn);
  });
}

function spawnCat() {
  const cat = document.createElement("img");
  cat.src = "assets/doro.gif";
  cat.className = "cat";
  cat.style.left = `${Math.random() * 100}%`;
  document.getElementById("cat-container").appendChild(cat);
  setTimeout(() => cat.remove(), 10000);
}
setInterval(spawnCat, 4000);

function renderAchievements() {
  const list = document.getElementById("achievement-list");
  list.innerHTML = "";
  achievements.forEach(a => {
    const li = document.createElement("li");
    li.textContent = a.label;
    li.style.opacity = a.unlocked ? "1" : "0.3";
    list.appendChild(li);
  });
}

function checkAchievements() {
  let changed = false;
  achievements.forEach(a => {
    if (!a.unlocked && a.condition()) {
      a.unlocked = true;
      changed = true;
    }
  });
  if (changed) {
    renderAchievements();
    saveGame();
  }
}

window.onload = () => {
  loadGame();
  renderShop();
  applySavedTheme();
  renderAchievements();
};
