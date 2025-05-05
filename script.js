let cookies = 0;
let cps = 0;
let multiplier = 1;

const upgrades = [
  { name: "Grandma", cost: 50, cps: 1, owned: 0 },
  { name: "Farm", cost: 200, cps: 5, owned: 0 },
  { name: "Factory", cost: 1000, cps: 15, owned: 0 },
  { name: "Mine", cost: 5000, cps: 50, owned: 0 },
  { name: "Bank", cost: 15000, cps: 100, owned: 0 },
  { name: "Temple", cost: 40000, cps: 250, owned: 0 },
  { name: "Wizard Tower", cost: 100000, cps: 500, owned: 0 },
  { name: "Portal", cost: 250000, cps: 1000, owned: 0 },
  { name: "Time Machine", cost: 1000000, cps: 2500, owned: 0 },
  { name: "Antimatter Condenser", cost: 5000000, cps: 7000, owned: 0 },
  { name: "Rocket Lab", cost: 15000000, cps: 15000, owned: 0 },
  { name: "AI Factory", cost: 50000000, cps: 30000, owned: 0 },
  { name: "Cookie Universe", cost: 100000000, cps: 50000, owned: 0 },
  { name: "God Clicker", cost: 250000000, cps: 75000, owned: 0 },
  { name: "Data Center", cost: 500000000, cps: 100000, owned: 0 },
  { name: "Infinity Printer", cost: 1000000000, cps: 200000, owned: 0 },
  { name: "Alien Trade Post", cost: 5000000000, cps: 350000, owned: 0 },
  { name: "Parallel World Portal", cost: 10000000000, cps: 500000, owned: 0 },
  { name: "Black Hole Cookie Core", cost: 25000000000, cps: 750000, owned: 0 },
  { name: "Eternal Cookie Engine", cost: 50000000000, cps: 1000000, owned: 0 }
];

const cookieEl = document.getElementById("cookie");
const cookieDisplay = document.getElementById("cookies");
const cpsDisplay = document.getElementById("cps");
const multiplierDisplay = document.getElementById("multiplier");
const shopList = document.getElementById("shop-list");
const shopContainer = document.getElementById("shop-container");
const savePopup = document.getElementById("save-popup");

cookieEl.addEventListener("click", () => {
  cookies += 1 * multiplier;
  updateDisplay();
});

function toggleShop() {
  const isVisible = shopContainer.style.display === "block";
  shopContainer.style.display = isVisible ? "none" : "block";
}

function updateDisplay() {
  cookieDisplay.textContent = Math.floor(cookies);
  cpsDisplay.textContent = cps;
  multiplierDisplay.textContent = multiplier;
}

function renderShop() {
  shopList.innerHTML = "";
  upgrades.forEach((u, i) => {
    const div = document.createElement("div");
    div.className = "upgrade";
    div.textContent = `${u.name} (${u.cost}) +${u.cps} CPS (x${u.owned})`;
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
    u.cost = Math.floor(u.cost * 1.15);
    renderShop();
    updateDisplay();
  }
}

function saveGame() {
  localStorage.setItem("save", JSON.stringify({ cookies, cps, multiplier, upgrades }));
  savePopup.style.opacity = "1";
  setTimeout(() => savePopup.style.opacity = "0", 2000);
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("save"));
  if (!save) return;
  cookies = save.cookies;
  cps = save.cps;
  multiplier = save.multiplier;
  save.upgrades.forEach((u, i) => Object.assign(upgrades[i], u));
  renderShop();
  updateDisplay();
}

function resetGame() {
  if (!confirm("Reset the game?")) return;
  cookies = 0;
  cps = 0;
  multiplier = 1;
  upgrades.forEach((u, i) => {
    u.owned = 0;
    u.cost = u.name === "Grandma" ? 50 :
             u.name === "Farm" ? 200 :
             i > 1 ? upgrades[i].cost : 1000;
  });
  renderShop();
  updateDisplay();
  localStorage.removeItem("save");
}

function prestige() {
  if (cookies >= 1000000) {
    cookies = 0;
    cps = 0;
    multiplier++;
    upgrades.forEach((u, i) => {
      u.owned = 0;
      u.cost = upgrades[i].cost;
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
  const saved = localStorage.getItem("theme") || "light";
  document.getElementById("theme-select").value = saved;
  changeTheme(saved);
}

setInterval(() => {
  cookies += cps;
  updateDisplay();
}, 1000);

window.onload = () => {
  loadGame();
  renderShop();
  applySavedTheme();
};
