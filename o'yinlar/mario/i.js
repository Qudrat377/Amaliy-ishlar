const player = document.querySelector('.player');

let x = 100;
let y = 0;
let velocityY = 0;
let isJumping = true;
const gravity = 0.8;
const jumpPower = -24;
const speed = 100;
const groundLevel = 350; // height of .game (400) - ground (50)

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    x -= speed;
  } else if (e.key === 'ArrowRight') {
    x += speed;
  } else if (e.key === ' ' || e.key === 'ArrowUp') {
    if (!isJumping) {
      velocityY = jumpPower;
      isJumping = false;
    }
  }
});

function gameLoop() {
  velocityY += gravity;
  y += velocityY;

  // Yerga tushdi
  if (y > groundLevel - player.offsetHeight) {
    y = groundLevel - player.offsetHeight;
    velocityY = 0;
    isJumping = false;
  }

  // Joylashuvni yangilash
  player.style.left = x + 'px';
  player.style.top = y + 'px';

  requestAnimationFrame(gameLoop);
}

gameLoop();
