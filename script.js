let cookies = 0;
let cps = 0;
let multiplier = 1;

const upgrades = [
  { name: "Grandma", cost: 50, cps: 1, owned: 0 },
  { name: "Farm", cost: 200, cps: 5, owned: 0 }
];

const cookieEl = document.getElementById("cookie");
const cookieDisplay = document.getElementById("cookies");
const cpsDisplay = document.getElementById("cps");
const multiplierDisplay = document.getElementById("multiplier");
const shopList = document.getElementById("shop-list");
const savePopup = document.getElementById("save-popup");

cookieEl.addEventListener("click", () => {
  cookies += 1 * multiplier;
  updateDisplay();
});

function updateDisplay() {
  cookieDisplay.textContent = Math.floor(cookies);
  cpsDisplay.textContent = cps;
  multiplierDisplay.textContent = multiplier;
}

function renderShop() {
  shopList.innerHTML = "";
  upgrades.forEach((u, i) => {
    const btn = document.createElement("div");
    btn.className = "upgrade";
    btn.textContent = `${u.name} (${u.cost} cookies) +${u.cps} CPS (x${u.owned})`;
    btn.onclick = () => buyUpgrade(i);
    shopList.appendChild(btn);
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
  showPopup();
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
  if (!confirm("Reset game?")) return;
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

function showPopup() {
  savePopup.style.opacity = "1";
  setTimeout(() => savePopup.style.opacity = "0", 2000);
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

// Cookie generation
setInterval(() => {
  cookies += cps;
  updateDisplay();
}, 1000);

window.onload = () => {
  loadGame();
  renderShop();
  applySavedTheme();
};
