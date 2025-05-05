let cookies = 0;
let cps = 0;
let multiplier = 1;

const upgrades = [
  { name: "Grandma", cost: 50, cps: 1, owned: 0 },
  { name: "Farm", cost: 200, cps: 5, owned: 0 },
];

const cookieEl = document.getElementById("cookie");
const cookieDisplay = document.getElementById("cookies");
const cpsDisplay = document.getElementById("cps");
const multiplierDisplay = document.getElementById("multiplier");
const shopList = document.getElementById("shop-list");
const shopContainer = document.getElementById("shop-container");
const savePopup = document.getElementById("save-popup");

// Click Cookie
cookieEl.addEventListener("click", () => {
  cookies += 1 * multiplier;
  updateDisplay();
});

// Toggle shop visibility
function toggleShop() {
  const isVisible = shopContainer.style.display === "block";
  shopContainer.style.display = isVisible ? "none" : "block";
}

// Update display
function updateDisplay() {
  cookieDisplay.textContent = Math.floor(cookies);
  cpsDisplay.textContent = cps;
  multiplierDisplay.textContent = multiplier;
}

// Render upgrades
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

// Buy upgrade
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

// Save game
function saveGame() {
  localStorage.setItem("save", JSON.stringify({ cookies, cps, multiplier, upgrades }));
  savePopup.style.opacity = "1";
  setTimeout(() => savePopup.style.opacity = "0", 2000);
}

// Load game
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

// Reset game
function resetGame() {
  if (!confirm("Reset the game?")) return;
  cookies = 0;
  cps = 0;
  multiplier = 1;
  upgrades.forEach((u, i) => {
    u.owned = 0;
    u.cost = i === 0 ? 50 : 200;
  });
  renderShop();
  updateDisplay();
  localStorage.removeItem("save");
}

// Prestige
function prestige() {
  if (cookies >= 1000) {
    cookies = 0;
    cps = 0;
    multiplier++;
    upgrades.forEach((u, i) => {
      u.owned = 0;
      u.cost = i === 0 ? 50 : 200;
    });
    renderShop();
    updateDisplay();
  }
}

// Theme toggle
function changeTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

function applySavedTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.getElementById("theme-select").value = saved;
  changeTheme(saved);
}

// Passive income
setInterval(() => {
  cookies += cps;
  updateDisplay();
}, 1000);

// Initialize
window.onload = () => {
  loadGame();
  renderShop();
  applySavedTheme();
};
