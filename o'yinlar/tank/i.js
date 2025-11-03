const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const TANK_SIZE = 40;
const TANK_SPEED = 2;
const BULLET_SPEED = 7;
const WALL_THICKNESS = 20;
const BORDER_THICKNESS = 20;
const MAX_HEALTH = 100;

let currentLevel = 1;

// Levels ma'lumotlari: devorlar va dushmanlar joylashuvi
const levels = [
  {
    walls: [
      // Yon devorlar
      { x: BORDER_THICKNESS, y: BORDER_THICKNESS, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS },
      { x: WIDTH - BORDER_THICKNESS - WALL_THICKNESS, y: BORDER_THICKNESS, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS },
      { x: BORDER_THICKNESS, y: BORDER_THICKNESS, width: WIDTH - 2 * BORDER_THICKNESS, height: WALL_THICKNESS },
      { x: BORDER_THICKNESS, y: HEIGHT - BORDER_THICKNESS - WALL_THICKNESS, width: WIDTH - 2 * BORDER_THICKNESS, height: WALL_THICKNESS },

      // O'rtada vertikal devor, o'rtada teshik
      { x: WIDTH/2 - WALL_THICKNESS/2, y: BORDER_THICKNESS + WALL_THICKNESS + 50, width: WALL_THICKNESS, height: HEIGHT - 2*BORDER_THICKNESS - 100 - 2*WALL_THICKNESS }
    ],
    enemies: [
      { x: WIDTH - 100, y: 150, angle: Math.PI },
    ]
  },
  {
    walls: [
      // Yon devorlar
      { x: BORDER_THICKNESS, y: BORDER_THICKNESS, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS },
      { x: WIDTH - BORDER_THICKNESS - WALL_THICKNESS, y: BORDER_THICKNESS, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS },
      { x: BORDER_THICKNESS, y: BORDER_THICKNESS, width: WIDTH - 2 * BORDER_THICKNESS, height: WALL_THICKNESS },
      { x: BORDER_THICKNESS, y: HEIGHT - BORDER_THICKNESS - WALL_THICKNESS, width: WIDTH - 2 * BORDER_THICKNESS, height: WALL_THICKNESS },

      // Ko'proq devorlar (vertikal va gorizontal)
      { x: WIDTH/3 - WALL_THICKNESS/2, y: BORDER_THICKNESS + 20, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS - 100 },
      { x: 2*WIDTH/3 - WALL_THICKNESS/2, y: BORDER_THICKNESS + 20, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS - 100 },
      { x: WIDTH/3 - WALL_THICKNESS/2, y: HEIGHT/2 - WALL_THICKNESS/2, width: 2*WIDTH/3 - WIDTH/3 + WALL_THICKNESS, height: WALL_THICKNESS },
    ],
    enemies: [
      { x: WIDTH - 120, y: 120, angle: Math.PI },
      { x: WIDTH - 120, y: HEIGHT - 150, angle: Math.PI * 1.5 },
    ]
  },
  {
    walls: [
      // Yon devorlar
      { x: BORDER_THICKNESS, y: BORDER_THICKNESS, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS },
      { x: WIDTH - BORDER_THICKNESS - WALL_THICKNESS, y: BORDER_THICKNESS, width: WALL_THICKNESS, height: HEIGHT - 2 * BORDER_THICKNESS },
      { x: BORDER_THICKNESS, y: BORDER_THICKNESS, width: WIDTH - 2 * BORDER_THICKNESS, height: WALL_THICKNESS },
      { x: BORDER_THICKNESS, y: HEIGHT - BORDER_THICKNESS - WALL_THICKNESS, width: WIDTH - 2 * BORDER_THICKNESS, height: WALL_THICKNESS },

      // Ko'p va murakkab devorlar
      { x: WIDTH/2 - 150, y: HEIGHT/3, width: 300, height: WALL_THICKNESS },
      { x: WIDTH/2 - 150, y: HEIGHT/3 * 2, width: 300, height: WALL_THICKNESS },
      { x: WIDTH/2 - WALL_THICKNESS/2 - 150, y: HEIGHT/3, width: WALL_THICKNESS, height: HEIGHT/3 },
      { x: WIDTH/2 + 150 - WALL_THICKNESS/2, y: HEIGHT/3, width: WALL_THICKNESS, height: HEIGHT/3 },

      // Qo'shimcha kichik devorlar
      { x: WIDTH/4, y: HEIGHT/2 - 40, width: WALL_THICKNESS, height: 80 },
      { x: WIDTH*3/4 - WALL_THICKNESS, y: HEIGHT/2 - 40, width: WALL_THICKNESS, height: 80 },
    ],
    enemies: [
      { x: WIDTH - 150, y: 150, angle: Math.PI },
      { x: WIDTH - 150, y: HEIGHT - 150, angle: Math.PI * 1.5 },
    ]
  }
];

// Tank class
class Tank {
  constructor(x, y, angle, color, isPlayer = false) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.color = color;
    this.isPlayer = isPlayer;
    this.bullets = [];
    this.health = MAX_HEALTH;
    this.canShoot = 0;
    this.moveCooldown = 0;
  }
}

// O'yin ob'ektlari
let playerTank;
let enemyTanks = [];
let walls = [];

let gameOver = false;
let winner = null;

function rectsOverlap(r1, r2) {
  return !(
    r1.x + r1.width < r2.x ||
    r1.x > r2.x + r2.width ||
    r1.y + r1.height < r2.y ||
    r1.y > r2.y + r2.height
  );
}

function isCollidingWithWalls(x, y, size) {
  const half = size / 2;
  const tankRect = { x: x - half, y: y - half, width: size, height: size };

  for (const wall of walls) {
    if (rectsOverlap(tankRect, wall)) {
      return true;
    }
  }
  return false;
}

function isCollidingWithTanks(bullet, tank) {
  const half = TANK_SIZE / 2;
  const tankRect = { x: tank.x - half, y: tank.y - half, width: TANK_SIZE, height: TANK_SIZE };
  const bulletRect = { x: bullet.x - bullet.size / 2, y: bullet.y - bullet.size / 2, width: bullet.size, height: bullet.size };
  return rectsOverlap(bulletRect, tankRect);
}

function moveTank(tank, dx, dy) {
  const newX = tank.x + dx;
  const newY = tank.y + dy;
  const half = TANK_SIZE / 2;

  // Chegara va devorlarga tegmaslik
  if (newX - half < BORDER_THICKNESS + WALL_THICKNESS) return;
  if (newX + half > WIDTH - (BORDER_THICKNESS + WALL_THICKNESS)) return;
  if (newY - half < BORDER_THICKNESS + WALL_THICKNESS) return;
  if (newY + half > HEIGHT - (BORDER_THICKNESS + WALL_THICKNESS)) return;

  if (!isCollidingWithWalls(newX, newY, TANK_SIZE)) {
    tank.x = newX;
    tank.y = newY;
  }
}

function createBullet(tank) {
  return {
    x: tank.x + Math.cos(tank.angle) * (TANK_SIZE / 2 + 8),
    y: tank.y + Math.sin(tank.angle) * (TANK_SIZE / 2 + 8),
    angle: tank.angle,
    speed: BULLET_SPEED,
    size: 6,
  };
}

function updateBullets(tank) {
  for (let i = tank.bullets.length - 1; i >= 0; i--) {
    const b = tank.bullets[i];
    b.x += Math.cos(b.angle) * b.speed;
    b.y += Math.sin(b.angle) * b.speed;

    if (
      b.x < BORDER_THICKNESS + WALL_THICKNESS ||
      b.x > WIDTH - (BORDER_THICKNESS + WALL_THICKNESS) ||
      b.y < BORDER_THICKNESS + WALL_THICKNESS ||
      b.y > HEIGHT - (BORDER_THICKNESS + WALL_THICKNESS) ||
      isCollidingWithWalls(b.x, b.y, b.size)
    ) {
      tank.bullets.splice(i, 1);
      continue;
    }

    const targets = tank.isPlayer ? enemyTanks : [playerTank];
    for (const target of targets) {
      if (isCollidingWithTanks(b, target)) {
        target.health -= 10;
        tank.bullets.splice(i, 1);
        if (target.health < 0) target.health = 0;
        break;
      }
    }
  }
}

function drawTank(tank) {
  ctx.save();
  ctx.translate(tank.x, tank.y);
  ctx.rotate(tank.angle);

  ctx.fillStyle = tank.color;
  ctx.fillRect(-TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(TANK_SIZE / 2, 0);
  ctx.lineTo(TANK_SIZE / 2 - 12, -8);
  ctx.lineTo(TANK_SIZE / 2 - 12, 8);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Health bar
  const healthBarWidth = TANK_SIZE;
  const healthBarHeight = 6;
  const healthX = tank.x - healthBarWidth / 2;
  const healthY = tank.y - TANK_SIZE / 2 - 15;

  ctx.fillStyle = "gray";
  ctx.fillRect(healthX, healthY, healthBarWidth, healthBarHeight);

  ctx.fillStyle = tank.color;
  ctx.fillRect(healthX, healthY, (tank.health / MAX_HEALTH) * healthBarWidth, healthBarHeight);

  // Jon matni
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(tank.health, tank.x, healthY - 3);
}

function drawWalls() {
  ctx.fillStyle = "#654321";
  for (const wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }
}

function drawBullet(bullet) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.size / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Player control
// const keys = {};
// window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
// window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// function updatePlayer() {
//   let dx = 0, dy = 0;
//   if (keys["e"]) dy -= TANK_SPEED;
//   if (keys["s"]) dy += TANK_SPEED;
//   if (keys["a"]) dx -= TANK_SPEED;
//   if (keys["d"]) dx += TANK_SPEED;

//   if (dx !== 0 || dy !== 0) {
//     playerTank.angle = Math.atan2(dy, dx);
//     moveTank(playerTank, dx, dy);
//   }

//   if (keys["l"]) {
//     const now = Date.now();
//     if (now - playerTank.canShoot > 400) {
//       playerTank.bullets.push(createBullet(playerTank));
//       playerTank.canShoot = now;
//     }
//   }
// }



const keys = {};
let mousePressed = false;

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Sichqoncha chap tugmasi bosildi
window.addEventListener("mousedown", e => {
  if (e.button === 0) {  // chap tugma
    mousePressed = true;
  }
});

// Sichqoncha chap tugmasi qo‘yildi
window.addEventListener("mouseup", e => {
  if (e.button === 0) {
    mousePressed = false;
  }
});

function updatePlayer() {
  let dx = 0, dy = 0;
  if (keys["e"]) dy -= TANK_SPEED;
  if (keys["s"]) dy += TANK_SPEED;
  if (keys["a"]) dx -= TANK_SPEED;
  if (keys["d"]) dx += TANK_SPEED;

  if (dx !== 0 || dy !== 0) {
    playerTank.angle = Math.atan2(dy, dx);
    moveTank(playerTank, dx, dy);
  }

  const now = Date.now();
  if (mousePressed) {
    if (now - playerTank.canShoot > 400) {
      playerTank.bullets.push(createBullet(playerTank));
      playerTank.canShoot = now;
    }
  }
}




// AI movement and shooting
function updateEnemy(enemy) {
  enemy.moveCooldown--;
  if (enemy.moveCooldown <= 0) {
    const directions = [
      0,
      Math.PI / 2,
      Math.PI,
      3 * Math.PI / 2,
      Math.PI / 4,
      3 * Math.PI / 4,
      5 * Math.PI / 4,
      7 * Math.PI / 4
    ];
    enemy.angle = directions[Math.floor(Math.random() * directions.length)];
    enemy.moveCooldown = 50 + Math.floor(Math.random() * 100);
  }
  const dx = Math.cos(enemy.angle) * TANK_SPEED * 0.8;
  const dy = Math.sin(enemy.angle) * TANK_SPEED * 0.8;
  moveTank(enemy, dx, dy);

  const now = Date.now();
  if (now - enemy.canShoot > 1500) {
    enemy.bullets.push(createBullet(enemy));
    enemy.canShoot = now;
  }
}

function update() {
  if (gameOver) return;

  updatePlayer();

  for (const enemy of enemyTanks) {
    updateEnemy(enemy);
  }

  updateBullets(playerTank);
  for (const enemy of enemyTanks) {
    updateBullets(enemy);
  }

  // O'lim tekshirish va o'yinni tugatish
  enemyTanks = enemyTanks.filter(e => e.health > 0);

  if (playerTank.health <= 0) {
    gameOver = true;
    winner = "AI";
  } else if (enemyTanks.length === 0) {
    currentLevel++;
    if (currentLevel >= levels.length) {
      gameOver = true;
      winner = "Player";
    } else {
      startLevel(currentLevel);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawWalls();

  drawTank(playerTank);
  for (const enemy of enemyTanks) {
    drawTank(enemy);
  }

  playerTank.bullets.forEach(drawBullet);
  enemyTanks.forEach(enemy => enemy.bullets.forEach(drawBullet));

  // Info yuqori chapda
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Bosqich: ${currentLevel + 1} / ${levels.length}`, 10, 25);

  // O'yin tugaganini ko'rsatish
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    // ctx
  ctx.fillText(`G'olib: ${winner}`, WIDTH / 2, HEIGHT / 2);
  ctx.font = "24px Arial";
  ctx.fillText("Qayta boshlash uchun R tugmasini bosing", WIDTH / 2, HEIGHT / 2 + 50);
}}

function startLevel(levelIndex) {
  const level = levels[levelIndex];

  playerTank = new Tank(100, HEIGHT / 2, 0, "blue", true);
  walls = level.walls;
  enemyTanks = level.enemies.map(e => new Tank(e.x, e.y, e.angle, "red"));

  gameOver = false;
  winner = null;
}

window.addEventListener("keydown", e => {
  if (gameOver && e.key.toLowerCase() === "r") {
    currentLevel = 0;
    startLevel(currentLevel);
  }
});
 
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

startLevel(currentLevel);
gameLoop();

