const startBtn = document.getElementById("startBtn");
const gameForm = document.getElementById("gameForm");
const guessInput = document.getElementById("guessInput");
const resultMsg = document.getElementById("resultMsg");
const retryBtn = document.getElementById("retryBtn");
const historyList = document.getElementById("historyList");

let secretNumber = null;
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
      Tajné číslo: ${game.secretNumber}<br>
      Pokusy: ${game.attempts}<br>
      Tipy: ${game.guesses.join(", ")}
    `;
    historyList.appendChild(li);
  });
}

startBtn.addEventListener("click", () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  guesses = [];

  hide(startBtn);
  hide(retryBtn);
  show(gameForm);
  hide(resultMsg);

  guessInput.value = "";
  guessInput.focus();
});

gameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const guess = Number(guessInput.value);
  attempts++;
  guesses.push(guess);

  if (guess < secretNumber) {
    setResult("Moc nízko!");
  } else if (guess > secretNumber) {
    setResult("Moc vysoko!");
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
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  guesses = [];

  hide(retryBtn);
  show(gameForm);
  hide(resultMsg);

  guessInput.value = "";
  guessInput.focus();
});

renderHistory();
