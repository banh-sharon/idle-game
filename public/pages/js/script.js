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
  { name: "Classic Cookie", src: "assets/cookie_default.png", rarity: "common" },
  { name: "Choco Chip", src: "assets/cookie_choco.png", rarity: "rare" },
  { name: "Golden Cookie", src: "assets/cookie_gold.png", rarity: "legendary" },
  { name: "Galaxy Cookie", src: "assets/cookie_galaxy.png", rarity: "epic" }
];

let currentSkin = "Classic Cookie";
let ownedSkins = ["Classic Cookie"];

const upgrades = [];
for (let i = 1; i <= 20; i++) {
  upgrades.push({
    name: `Upgrade ${i}`,
    cost: 50 * Math.pow(1.5, i),
    cps: 1 * Math.pow(1.4, i),
    owned: 0
  });
}

cookieEl.addEventListener("click", () => {
  cookies += 1 * multiplier;
  updateDisplay();
});

function updateDisplay() {
  cookieDisplay.textContent = Math.floor(cookies);
  cpsDisplay.textContent = Math.floor(cps);
  multiplierDisplay.textContent = multiplier;
}

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
  }
}

function saveGame() {
  const save = { cookies, cps, multiplier, upgrades, currentSkin, ownedSkins };
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
  save.upgrades.forEach((u, i) => Object.assign(upgrades[i], u));
  renderShop();
  updateDisplay();
  equipSkin(currentSkin);
}

function resetGame() {
  if (!confirm("Reset game?")) return;
  cookies = 0;
  cps = 0;
  multiplier = 1;
  ownedSkins = ["Classic Cookie"];
  upgrades.forEach((u, i) => {
    u.owned = 0;
    u.cost = 50 * Math.pow(1.5, i + 1);
  });
  renderShop();
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
      u.cost = u.cost / Math.pow(1.15, u.owned);
    });
    renderShop();
    updateDisplay();
  }
}

// Theme & storage
function changeTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.getElementById("theme-select").value = theme;
  changeTheme(theme);
}

// Passive income
setInterval(() => {
  cookies += cps;
  updateDisplay();
}, 1000);

// Background cats
function spawnCat() {
  const cat = document.createElement("img");
  cat.src = "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif";
  cat.className = "cat";
  cat.style.left = `${Math.random() * 100}%`;
  cat.style.top = "100%";
  document.getElementById("cat-container").appendChild(cat);
  setTimeout(() => cat.remove(), 10000);
}
setInterval(spawnCat, 4000);

// Gacha system
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
  if (roll < 0.6) result = availableSkins[0]; // common
  else if (roll < 0.85) result = availableSkins[1]; // rare
  else if (roll < 0.97) result = availableSkins[3]; // epic
  else result = availableSkins[2]; // legendary

  if (!ownedSkins.includes(result.name)) {
    ownedSkins.push(result.name);
    gachaResult.textContent = `You got a new skin: ${result.name}!`;
  } else {
    gachaResult.textContent = `Duplicate skin: ${result.name}`;
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
  ownedSkinsDiv.innerHTML = "<strong>Owned:</strong><br>";
  ownedSkins.forEach(skin => {
    const btn = document.createElement("button");
    btn.textContent = skin;
    btn.onclick = () => equipSkin(skin);
    ownedSkinsDiv.appendChild(btn);
  });
}

// Leaderboard (requires server.js)
async function fetchLeaderboard() {
  try {
    const res = await fetch("/leaderboard");
    const list = await res.json();
    const container = document.getElementById("leaderboard");
    container.innerHTML = "";
    list.forEach(score => {
      const li = document.createElement("li");
      li.textContent = `${score.name}: ${score.cookies} cookies`;
      container.appendChild(li);
    });
  } catch (e) {
    console.warn("Leaderboard error", e);
  }
}

window.onload = () => {
  loadGame();
  renderShop();
  applySavedTheme();
  fetchLeaderboard();
};
