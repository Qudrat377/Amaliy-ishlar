const mazeContainer = document.getElementById("maze");
const levelText = document.getElementById("level");
const statusText = document.getElementById("status");

let currentLevel = 0;

const levels = [
    // Level 1
    [
        "##########",
        "#P   #   #",
        "# ##   # #",
        "#    ##  #",
        "## #   ###",
        "#   ##   #",
        "# #    # #",
        "#   ##   #",
        "#   #   G#",
        "##########"
    ],
    // Level 2
    [
        "##########",
        "#P #     #",
        "# ### ###G",
        "#     #   ",
        "### # # ##",
        "#   # #  #",
        "# ### ## #",
        "#   #    #",
        "##### ## #",
    "##########"
  ],
  // Level 3
  [
      "##########",
      "#P#   #  #",
      "# # # # ##",
      "# # #    #",
      "# # #### #",
      "#     #  #",
      "### # ####",
      "#   #    #",
      "# ##### G#",
      "##########"
    ],
    // Level 4
    [
        "##########",
        "#P     # #",
        "### ## # #",
        "#     #  #",
        "# ###### #",
        "#   #    #",
        "### # ####",
        "#       G#",
        "# #####  #",
        "##########"
    ],
    // Level 5
    [
        "##########",
        "#         ",
        "### ##P ##",
        "#   #  # #",
        "# ### ## #",
        "#     #  #",
        "### ### ##",
        "#     #  #",
        "# ###    G",
        "##########"
    ],
    //   level 6
    [
        "##########",
        "#P        ",
        "### ##  ##",
        "#   #  # #",
        "# ### ## #",
        "#     #  #",
        "### ### ##",
        "#     #  #",
        "# ###     ",
        "##### ### ",
        "          ",
        "##### ####",
        "#         ",
        "### ##  ##",
        "#   #  # #",
        "# ### ## #",
        "#     #  #",
        "### ### ##",
        "#     #  #",
        "# ###    G",
        "##########"
    ]
];

let playerX = 0;
let playerY = 0;

function renderLevel(levelIndex) {
    mazeContainer.innerHTML = "";
    const level = levels[levelIndex];
    mazeContainer.style.gridTemplateColumns = `repeat(${level[0].length}, 40px)`;
    mazeContainer.style.gridTemplateRows = `repeat(${level.length}, 40px)`;
    
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

      const char = level[y][x];
      if (char === "#") {
        cell.classList.add("wall");
      } else if (char === "P") {
        cell.classList.add("player");
        playerX = x;
        playerY = y;
      } else if (char === "G") {
        cell.classList.add("goal");
      }

      mazeContainer.appendChild(cell);
    }
  }
}

function updatePlayerPosition(newX, newY) {
  const level = levels[currentLevel];
  if (level[newY][newX] === "#") return;
  const oldIndex = playerY * level[0].length + playerX;
  const newIndex = newY * level[0].length + newX;

  const cells = mazeContainer.querySelectorAll(".cell");
  cells[oldIndex].classList.remove("player");
  playerX = newX;
  playerY = newY;
  cells[newIndex].classList.add("player");

  if (level[newY][newX] === "G") {
    currentLevel++;
    if (currentLevel < levels.length) {
      levelText.textContent = currentLevel + 1;
      statusText.textContent = "Bosqich " + (currentLevel + 1) + "!";
      renderLevel(currentLevel);
    } else {
      statusText.textContent = "🎉 Siz hamma bosqichni yakunladingiz!";
    }
  }
}

document.addEventListener("keydown", function (e) {
  const key = e.key;
  if (key === "ArrowUp") {
    updatePlayerPosition(playerX, playerY - 1);
  } else if (key === "ArrowDown") {
    updatePlayerPosition(playerX, playerY + 1);
  } else if (key === "ArrowLeft") {
    updatePlayerPosition(playerX - 1, playerY);
  } else if (key === "ArrowRight") {
    updatePlayerPosition(playerX + 1, playerY);
  }
});

renderLevel(currentLevel);
