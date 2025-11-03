let hp1 = 100;
let hp2 = 100;
const damage = Math.floor(Math.random() * 10)
let gameOver = false;

const hp1Span = document.querySelector(".hp1");
const hp2Span = document.querySelector(".hp2");
const result = document.querySelector(".result");

document.addEventListener("keydown", function (e) {
  if (gameOver) return;

  if (e.key === "a" || e.key === "A") {
    // Jangchi 1 hujum qiladi
    hp2 -= damage;
    hp2 = Math.max(hp2, 0);
    hp2Span.textContent = "HP: " + hp2;
    checkWinner();
  } else if (e.key === "l" || e.key === "L") {
    // Jangchi 2 hujum qiladi
    hp1 -= damage;
    hp1 = Math.max(hp1, 0);
    hp1Span.textContent = "HP: " + hp1;
    checkWinner();
  }
});

function checkWinner() {
  if (hp1 <= 0) {
    result.textContent = "🥊 Jangchi 2 g‘alaba qozondi!";
    gameOver = true;
  } else if (hp2 <= 0) {
    result.textContent = "🥊 Jangchi 1 g‘alaba qozondi!";
    gameOver = true;
  }
}
