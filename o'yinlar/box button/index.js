const box = document.getElementById("box");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");

let score = 0;
let timeLeft = 30;
let timerId;
let gameActive = false;

function randomPosition() {
  const maxX = gameArea.clientWidth - box.offsetWidth;
  const maxY = gameArea.clientHeight - box.offsetHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  box.style.left = randomX + "px";
  box.style.top = randomY + "px";
}

function updateScore() {
  score++;
  scoreDisplay.textContent = "Ball: " + score;
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = "Vaqt: " + timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timerId);
    alert("Vaqt tugadi! Siz " + score + " ball to'pladingiz!");
    gameActive = false;
    box.style.display = "none";
    startBtn.disabled = false;
  }
}

box.addEventListener("click", function () {
  if (!gameActive) return;
  updateScore();
  randomPosition();
});

startBtn.addEventListener("click", function () {
  score = 0;
  timeLeft = 30;
  gameActive = true;
  scoreDisplay.textContent = "Ball: 0";
  timerDisplay.textContent = "Vaqt: 30";
  box.style.display = "block";
  randomPosition();
  startBtn.disabled = true;

  timerId = setInterval(updateTimer, 100);
});
