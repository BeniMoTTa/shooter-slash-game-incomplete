const enemySpawnInterval = 1000;
const playerSpeed = 5;
const bulletSpeed = 10;
const shootInterval = 500;
const maxBullets = 2;

let score = 0;
let player;
let enemies = [];
let bullets = [];

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.hp = 4;

  const corner = Math.floor(Math.random() * 4);
  let top, left;

  switch (corner) {
    case 0:
      top = 0;
      left = 0;
      break;
    case 1:
      top = 0;
      left = window.innerWidth - 30;
      break;
    case 2:
      top = window.innerHeight - 30;
      left = 0;
      break;
    case 3:
      top = window.innerHeight - 30;
      left = window.innerWidth - 30;
      break;
  }

  enemy.style.top = top + "px";
  enemy.style.left = left + "px";

  enemies.push(enemy);

  document.body.appendChild(enemy);
}

function moveEnemies() {
  const playerRect = player.getBoundingClientRect();

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyRect = enemy.getBoundingClientRect();

    const dx = playerRect.left - enemyRect.left;
    const dy = playerRect.top - enemyRect.top;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const directionX = dx / distance;
    const directionY = dy / distance;

    enemy.style.left = enemyRect.left + directionX + "px";
    enemy.style.top = enemyRect.top + directionY + "px";
  }
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = "Pontuação: " + score;
}

function checkCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function shoot() {
  const playerRect = player.getBoundingClientRect();

  const bulletX = playerRect.left + playerRect.width / 2;
  const bulletY = playerRect.top + playerRect.height / 2;

  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.classList.add("shot");
  bullet.style.left = bulletX + "px";
  bullet.style.top = bulletY + "px";

  const nearestEnemy = getNearestEnemy(playerRect);
  const dx = nearestEnemy.left - bulletX;
  const dy = nearestEnemy.top - bulletY;

  const distance = Math.sqrt(dx * dx + dy * dy);
  const directionX = dx / distance;
  const directionY = dy / distance;

  bullet.dx = bulletSpeed * directionX;
  bullet.dy = bulletSpeed * directionY;

  bullets.push(bullet);

  document.body.appendChild(bullet);

  if (bullets.length > maxBullets) {
    const removedBullet = bullets.shift();
    document.body.removeChild(removedBullet);
  }
}
function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    const bulletRect = bullet.getBoundingClientRect();

    bullet.style.left = bulletRect.left + bullet.dx + "px";
    bullet.style.top = bulletRect.top + bullet.dy + "px";

    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      const enemyRect = enemy.getBoundingClientRect();

      if (checkCollision(bulletRect, enemyRect)) {
        enemy.hp--;

        if (enemy.hp <= 0) {
          enemies.splice(j, 1);
          document.body.removeChild(enemy);
          score++;
          updateScore();
        }

        bullets.splice(i, 1);
        document.body.removeChild(bullet);
        break;
      }
    }
  }
}

function getNearestEnemy(playerRect) {
  let nearestEnemy;
  let nearestDistance = Infinity;

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyRect = enemy.getBoundingClientRect();

    const dx = playerRect.left - enemyRect.left;
    const dy = playerRect.top - enemyRect.top;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestEnemy = enemyRect;
    }
  }

  return nearestEnemy;
}

function update() {
  moveEnemies();
  moveBullets();

  requestAnimationFrame(update);
}

function handleKeyPress(event) {
  const key = event.key;

  switch (key) {
    case "ArrowUp":
      player.style.top = parseInt(player.style.top) - playerSpeed + "px";
      break;
    case "ArrowDown":
      player.style.top = parseInt(player.style.top) + playerSpeed + "px";
      break;
    case "ArrowLeft":
      player.style.left = parseInt(player.style.left) - playerSpeed + "px";
      break;
    case "ArrowRight":
      player.style.left = parseInt(player.style.left) + playerSpeed + "px";
      break;
    case " ":
      shoot();
      break;
  }
}

function startGame() {
  player = document.getElementById("player");
  updateScore();

  document.addEventListener("keydown", handleKeyPress);

  setInterval(createEnemy, enemySpawnInterval);

  setInterval(shoot, shootInterval);

  requestAnimationFrame(update);
}

window.addEventListener("load", startGame);
