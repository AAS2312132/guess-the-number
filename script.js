const startBtn = document.getElementById("startBtn");
const gameForm = document.getElementById("gameForm");
const guessInput = document.getElementById("guessInput");
const resultMsg = document.getElementById("resultMsg");
const retryBtn = document.getElementById("retryBtn");
const historyList = document.getElementById("historyList");
const errorMsg = document.getElementById("errorMsg");
const rangeSelect = document.getElementById("rangeSelect");

let secretNumber = null;
let maxNumber = 100;
let attempts = 0;
let guesses = [];

const STORAGE_KEY = "guess_history";

function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

function setResult(text) {
  resultMsg.textContent = text;
  show(resultMsg);
}

function clearResult() {
  resultMsg.textContent = "";
  hide(resultMsg);
}

function generateSecret() {
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
}

function loadHistory() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveGameToHistory() {
  const history = loadHistory();
  history.unshift({
    date: new Date().toLocaleString(),
    maxNumber: maxNumber,
    secretNumber: secretNumber,
    attempts: attempts,
    guesses: guesses
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Zatím žádné dokončené hry.";
    historyList.appendChild(li);
    return;
  }

  history.forEach((game, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Hra #${history.length - index}</strong><br>
      Datum: ${game.date}<br>
      Rozsah: 1–${game.maxNumber}<br>
      Tajné číslo: ${game.secretNumber}<br>
      Pokusy: ${game.attempts}<br>
      Tipy: ${game.guesses.join(", ")}
    `;
    historyList.appendChild(li);
  });
}

function heatMessage(diff) {
  if (diff === 0) return "Gratuluji! Uhodl jsi.";
  if (diff <= 2) return "🔥 Hoří! Jsi extrémně blízko!";
  if (diff <= 5) return "🌡️ Hodně přihořívá!";
  if (diff <= 10) return "🙂 Přihořívá.";
  if (diff <= 20) return "😐 Jsi docela daleko.";
  return "🥶 Ledově daleko.";
}

guessInput.addEventListener("input", () => {
  guessInput.value = guessInput.value.replace(/[^0-9]/g, "");
});

startBtn.addEventListener("click", () => {
  maxNumber = Number(rangeSelect.value);
  attempts = 0;
  guesses = [];
  generateSecret();

  hide(startBtn);
  hide(retryBtn);
  clearResult();

  guessInput.value = "";
  guessInput.classList.remove("invalid");
  hide(errorMsg);

  show(gameForm);
  guessInput.focus();
});

gameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = guessInput.value.trim();

  if (value === "") {
    guessInput.classList.add("invalid");
    show(errorMsg);
    return;
  }

  guessInput.classList.remove("invalid");
  hide(errorMsg);

  const guess = Number(value);

  if (guess < 1 || guess > maxNumber) {
    setResult(`Zadej číslo v rozsahu 1–${maxNumber}.`);
    return;
  }

  attempts++;
  guesses.push(guess);

  const diff = Math.abs(secretNumber - guess);

  if (guess < secretNumber) {
    setResult("Moc nízko! " + heatMessage(diff));
  } else if (guess > secretNumber) {
    setResult("Moc vysoko! " + heatMessage(diff));
  } else {
    setResult("Gratuluji! Uhodl jsi.");
    hide(gameForm);
    show(retryBtn);

    saveGameToHistory();
    renderHistory();
  }

  guessInput.value = "";
  guessInput.focus();
});

retryBtn.addEventListener("click", () => {
  maxNumber = Number(rangeSelect.value);
  attempts = 0;
  guesses = [];
  generateSecret();

  clearResult();
  hide(retryBtn);

  guessInput.value = "";
  guessInput.classList.remove("invalid");
  hide(errorMsg);

  show(gameForm);
  guessInput.focus();
});

renderHistory();
