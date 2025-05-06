// ✅ script.js (Restored to pre-prestige version)
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

const upgrades = [
  { name: "👵 Grandma's Oven", cost: 80, cps: 1, owned: 0 },
  { name: "🧁 Bakery Apprentice", cost: 160, cps: 2, owned: 0 },
  { name: "🍽️ Rolling Pin", cost: 320, cps: 4, owned: 0 },
  { name: "🍫 Chocolate River", cost: 640, cps: 8, owned: 0 },
  { name: "💰 Golden Tray", cost: 1280, cps: 16, owned: 0 },
  { name: "🤖 Cookie Robot", cost: 2560, cps: 32, owned: 0 },
  { name: "⛏️ Sugar Mine", cost: 5120, cps: 64, owned: 0 },
  { name: "❄️ Time-Freezer", cost: 10240, cps: 128, owned: 0 },
  { name: "🚀 Space Oven", cost: 20480, cps: 256, owned: 0 },
  { name: "⚛️ Quantum Mixer", cost: 40960, cps: 512, owned: 0 },
  { name: "🌌 Dark Matter Dough", cost: 81920, cps: 1024, owned: 0 },
  { name: "🌪️ Cinnamon Cyclone", cost: 163840, cps: 2048, owned: 0 },
  { name: "🔮 Mystic Baker", cost: 327680, cps: 4096, owned: 0 },
  { name: "🔥 Phoenix Flame", cost: 655360, cps: 8192, owned: 0 },
  { name: "♾️ Eternal Mixer", cost: 1310720, cps: 16384, owned: 0 },
  { name: "🏢 Bakery Empire", cost: 2621440, cps: 32768, owned: 0 },
  { name: "⏳ Time Cookie", cost: 5242880, cps: 65536, owned: 0 },
  { name: "🧬 Galactic Yeast", cost: 10485760, cps: 131072, owned: 0 },
  { name: "🌠 Infinite Bake", cost: 20971520, cps: 262144, owned: 0 },
  { name: "👑 God Oven", cost: 41943040, cps: 524288, owned: 0 }
];


cookieEl.addEventListener("click", () => {
  cookies += 1 * multiplier;
  updateDisplay();
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
  }
}

function updateDisplay() {
  cookieDisplay.textContent = Math.floor(cookies);
  cpsDisplay.textContent = Math.floor(cps);
  multiplierDisplay.textContent = multiplier;
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
  if (save.upgrades) {
    save.upgrades.forEach((u, i) => {
      upgrades[i].owned = u.owned;
      upgrades[i].cost = u.cost;
    });
  }
  
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
    u.cost = 50 * Math.pow(1.6, i + 1);
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
    upgrades.forEach((u, i) => {
      u.owned = 0;
      u.cost = 50 * Math.pow(1.6, i + 1);
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

window.onload = () => {
  loadGame();
  renderShop();
  applySavedTheme();
};
