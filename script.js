const startBtn = document.getElementById("startBtn");
const gameForm = document.getElementById("gameForm");
const guessInput = document.getElementById("guessInput");
const resultMsg = document.getElementById("resultMsg");
const retryBtn = document.getElementById("retryBtn");

let secretNumber = null;

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

startBtn.addEventListener("click", () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;

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

  if (guess < secretNumber) {
    setResult("Moc nízko!");
  } else if (guess > secretNumber) {
    setResult("Moc vysoko!");
  } else {
    setResult("Gratuluji! Uhodl jsi.");
    hide(gameForm);
    show(retryBtn);
  }

  guessInput.value = "";
  guessInput.focus();
});

retryBtn.addEventListener("click", () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;

  hide(retryBtn);
  show(gameForm);
  hide(resultMsg);

  guessInput.value = "";
  guessInput.focus();
});
