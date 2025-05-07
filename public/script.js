let cookies = 0n;
let cps = 0n;
let multiplier = 1;
let marbles = 0;
let nextMarbleThreshold = 100n;

const upgrades = [
  { name: "Grandma", cost: 50n, cps: 1n, owned: 0 },
  { name: "Farm", cost: 200n, cps: 5n, owned: 0 },
  { name: "Factory", cost: 1000n, cps: 15n, owned: 0 },
  { name: "Mine", cost: 5000n, cps: 50n, owned: 0 },
  { name: "Bank", cost: 15000n, cps: 100n, owned: 0 },
  { name: "Temple", cost: 40000n, cps: 250n, owned: 0 },
  { name: "Wizard Tower", cost: 100000n, cps: 500n, owned: 0 },
  { name: "Portal", cost: 250000n, cps: 1000n, owned: 0 },
  { name: "Time Machine", cost: 1000000n, cps: 2500n, owned: 0 },
  { name: "Antimatter Condenser", cost: 5000000n, cps: 7000n, owned: 0 },
  { name: "Rocket Lab", cost: 15000000n, cps: 15000n, owned: 0 },
  { name: "AI Factory", cost: 50000000n, cps: 30000n, owned: 0 },
  { name: "Cookie Universe", cost: 100000000n, cps: 50000n, owned: 0 },
  { name: "God Clicker", cost: 250000000n, cps: 75000n, owned: 0 },
  { name: "Data Center", cost: 500000000n, cps: 100000n, owned: 0 },
  { name: "Infinity Printer", cost: 1000000000n, cps: 200000n, owned: 0 },
  { name: "Alien Trade Post", cost: 5000000000n, cps: 350000n, owned: 0 },
  { name: "Parallel World Portal", cost: 10000000000n, cps: 500000n, owned: 0 },
  { name: "Black Hole Cookie Core", cost: 25000000000n, cps: 750000n, owned: 0 },
  { name: "Eternal Cookie Engine", cost: 50000000000n, cps: 1000000n, owned: 0 }
];

const cookieEl = document.getElementById("cookie");
const cookieDisplay = document.getElementById("cookies");
const cpsDisplay = document.getElementById("cps");
const multiplierDisplay = document.getElementById("multiplier");
const marbleDisplay = document.getElementById("marble-count");
const gachaList = document.getElementById("gacha-results");
const shopList = document.getElementById("shop-list");
const shopContainer = document.getElementById("shop-container");
const savePopup = document.getElementById("save-popup");

cookieEl.addEventListener("click", () => {
  cookies += BigInt(multiplier);
  updateDisplay();
});

function toggleShop() {
  shopContainer.style.display = shopContainer.style.display === "block" ? "none" : "block";
}

function formatNumber(num) {
  if (num < 1000n) return num.toString();
  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  let i = 0;
  while (num >= 1000n && i < suffixes.length - 1) {
    num /= 1000n;
    i++;
  }
  return num.toString() + suffixes[i];
}

function updateDisplay() {
  cookieDisplay.textContent = formatNumber(cookies);
  cpsDisplay.textContent = formatNumber(cps);
  multiplierDisplay.textContent = multiplier;
  marbleDisplay.textContent = marbles;
}

function renderShop() {
  shopList.innerHTML = "";
  upgrades.forEach((u, i) => {
    const div = document.createElement("div");
    div.className = "upgrade";
    div.textContent = `${u.name} (${formatNumber(u.cost)}) +${formatNumber(u.cps)} CPS (x${u.owned})`;
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
    u.cost = BigInt(Math.floor(Number(u.cost) * 1.15));
    checkMarbleMilestone();
    renderShop();
    updateDisplay();
  }
}

function checkMarbleMilestone() {
  while (cps >= nextMarbleThreshold) {
    marbles++;
    nextMarbleThreshold *= 10n;
  }
}

function pullGacha() {
  if (marbles <= 0) {
    alert("Not enough marbles!");
    return;
  }
  marbles--;
  updateDisplay();

  const animationEl = document.getElementById("gacha-animation");
  animationEl.style.display = "block";
  animationEl.textContent = "🎲 Rolling...";

  setTimeout(() => {
    animationEl.style.display = "none";

    const rewards = [
      { item: "✨ Cookie Skin", rate: 30 },
      { item: "🎨 Theme Unlock", rate: 20 },
      { item: "🔥 Boost Token", rate: 15 },
      { item: "🐱 Pet Cat", rate: 15 },
      { item: "🌀 Special Aura", rate: 10 },
      { item: "🔮 Cosmetic Effect", rate: 10 }
    ];

    const totalRate = rewards.reduce((acc, r) => acc + r.rate, 0);
    const rand = Math.random() * totalRate;
    let sum = 0;
    let selected = rewards[0];

    for (const reward of rewards) {
      sum += reward.rate;
      if (rand <= sum) {
        selected = reward;
        break;
      }
    }

    const li = document.createElement("li");
    li.textContent = `🎁 You got: ${selected.item}`;
    li.className = "sparkle";
    gachaList.prepend(li);
  }, 1500);
}

function saveGame() {
  const saveData = {
    cookies: cookies.toString(),
    cps: cps.toString(),
    multiplier,
    marbles,
    nextMarbleThreshold: nextMarbleThreshold.toString(),
    upgrades
  };
  localStorage.setItem("save", JSON.stringify(saveData));
  savePopup.style.opacity = "1";
  setTimeout(() => savePopup.style.opacity = "0", 2000);
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("save"));
  if (!save) return;
  cookies = BigInt(save.cookies);
  cps = BigInt(save.cps);
  multiplier = save.multiplier;
  marbles = save.marbles || 0;
  nextMarbleThreshold = BigInt(save.nextMarbleThreshold || "100");
  save.upgrades.forEach((u, i) => Object.assign(upgrades[i], u));
  renderShop();
  updateDisplay();
}

function resetGame() {
  if (!confirm("Reset the game?")) return;
  cookies = 0n;
  cps = 0n;
  multiplier = 1;
  marbles = 0;
  nextMarbleThreshold = 100n;
  upgrades.forEach((u, i) => {
    u.owned = 0;
    u.cost = upgrades[i].cost;
  });
  localStorage.removeItem("save");
  renderShop();
  updateDisplay();
}

function prestige() {
  if (cookies < 1000000n) {
    alert("You need at least 1,000,000 cookies to prestige.");
    return;
  }
  cookies = 0n;
  cps = 0n;
  multiplier++;
  upgrades.forEach((u, i) => {
    u.owned = 0;
    u.cost = upgrades[i].cost;
  });
  renderShop();
  updateDisplay();
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

// ❓ Gacha Info Toggle
document.getElementById("gacha-info-btn").addEventListener("click", () => {
  const infoBox = document.getElementById("gacha-info");
  infoBox.style.display = infoBox.style.display === "none" ? "block" : "none";
});
