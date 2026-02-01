const startBtn = document.getElementById("startBtn");
const gameForm = document.getElementById("gameForm");
const guessInput = document.getElementById("guessInput");
const resultMsg = document.getElementById("resultMsg");

let secretNumber = null;

function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

startBtn.addEventListener("click", () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  hide(startBtn);
  show(gameForm);

  guessInput.value = "";
  hide(resultMsg);
  guessInput.focus();
});

gameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const guess = Number(guessInput.value);

  if (guess < secretNumber) {
    resultMsg.textContent = "Moc nízko!";
    show(resultMsg);
  } else if (guess > secretNumber) {
    resultMsg.textContent = "Moc vysoko!";
    show(resultMsg);
  } else {
    resultMsg.textContent = "Gratuluji! Uhodl jsi.";
    show(resultMsg);
  }

  guessInput.value = "";
  guessInput.focus();
});
