// ✅ script.js (Improved Prestige System)
let cookies = 0;
let cps = 0;
let prestigePoints = 0;
let totalCookiesEarned = 0;

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
  { name: "Grandma's Oven", cost: 80, cps: 1, owned: 0 },
  { name: "Bakery Apprentice", cost: 160, cps: 2, owned: 0 },
  { name: "Rolling Pin", cost: 320, cps: 4, owned: 0 },
  { name: "Chocolate River", cost: 640, cps: 8, owned: 0 },
  { name: "Golden Tray", cost: 1280, cps: 16, owned: 0 },
  { name: "Cookie Robot", cost: 2560, cps: 32, owned: 0 },
  { name: "Sugar Mine", cost: 5120, cps: 64, owned: 0 },
  { name: "Time-Freezer", cost: 10240, cps: 128, owned: 0 },
  { name: "Space Oven", cost: 20480, cps: 256, owned: 0 },
  { name: "Quantum Mixer", cost: 40960, cps: 512, owned: 0 },
  { name: "Dark Matter Dough", cost: 81920, cps: 1024, owned: 0 },
  { name: "Cinnamon Cyclone", cost: 163840, cps: 2048, owned: 0 },
  { name: "Mystic Baker", cost: 327680, cps: 4096, owned: 0 },
  { name: "Phoenix Flame", cost: 655360, cps: 8192, owned: 0 },
  { name: "Eternal Mixer", cost: 1310720, cps: 16384, owned: 0 },
  { name: "Bakery Empire", cost: 2621440, cps: 32768, owned: 0 },
  { name: "Time Cookie", cost: 5242880, cps: 65536, owned: 0 },
  { name: "Galactic Yeast", cost: 10485760, cps: 131072, owned: 0 },
  { name: "Infinite Bake", cost: 20971520, cps: 262144, owned: 0 },
  { name: "God Oven", cost: 41943040, cps: 524288, owned: 0 }
];

function prestige() {
  const earnedPrestige = Math.floor(Math.log10(totalCookiesEarned / 100000));
  if (earnedPrestige > prestigePoints) {
    const gain = earnedPrestige - prestigePoints;
    prestigePoints = earnedPrestige;
    multiplier = 1 + prestigePoints * 0.1;
    cookies = 0;
    cps = 0;
    upgrades.forEach((u, i) => {
      u.owned = 0;
      u.cost = upgrades[i].cost;
    });
    alert(`🌟 You gained ${gain} prestige point(s)! Multiplier is now x${multiplier.toFixed(1)}.`);
    updateDisplay();
    renderShop();
    saveGame();
  } else {
    alert("Not enough cookies to gain more prestige points yet. Keep baking!");
  }
}

setInterval(() => {
  cookies += cps;
  totalCookiesEarned += cps;
  updateDisplay();
  checkAchievements();
}, 1000);

function updateDisplay() {
  const prestigeDisplay = document.getElementById("prestige-points");
  if (prestigeDisplay) prestigeDisplay.textContent = prestigePoints;
  cookieDisplay.textContent = Math.floor(cookies);
  cpsDisplay.textContent = Math.floor(cps);
  multiplierDisplay.textContent = multiplier.toFixed(1);
}

function saveGame() {
  const save = {
    cookies,
    cps,
    multiplier,
    prestigePoints,
    totalCookiesEarned,
    upgrades,
    currentSkin,
    ownedSkins
  };
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
  prestigePoints = save.prestigePoints || 0;
  totalCookiesEarned = save.totalCookiesEarned || 0;
  currentSkin = save.currentSkin || "Classic Cookie";
  ownedSkins = save.ownedSkins || ["Classic Cookie"];
  if (save.upgrades) save.upgrades.forEach((u, i) => Object.assign(upgrades[i], u));
  renderShop();
  updateDisplay();
  equipSkin(currentSkin);
  renderAchievements();
}
