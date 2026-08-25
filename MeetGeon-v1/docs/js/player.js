const player = new Image();
player.src = "assets/qwerty.webp";

player.onload = function () {
  context.drawImage(player, 0, 0, 100, 100);
};

let isPlaying = false;
let animationId;

let x = 0;
let y = 0;
let vx = 0;
let vy = 0;

const speed = 3;

canvas.tabIndex = 1;
canvas.style.outline = "none";

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = 10;
  context.strokeStyle = isPlaying ? "#28A745" : "#DC3545";
  context.strokeRect(0, 0, canvas.width, canvas.height);

  if (isPlaying) {
    x += vx;
    y += vy;
  }

  context.drawImage(player, x, y, 100, 100);
  animationId = requestAnimationFrame(update);
}

canvas.addEventListener("click", function () {
  canvas.focus();

  if (!isPlaying) {
    isPlaying = true;
    vx = 0;
    vy = 0;
  } else {
    isPlaying = false;
    vx = 0;
    vy = 0;
  }
});

window.addEventListener("keydown", function (event) {
  if (!isPlaying) return;

  if (event.key.toLowerCase() === "w") vy = -speed;
  if (event.key.toLowerCase() === "s") vy = speed;
  if (event.key.toLowerCase() === "a") vx = -speed;
  if (event.key.toLowerCase() === "d") vx = speed;
});

// Keyboard control
window.addEventListener("keyup", function (event) {
  const key = event.key.toLowerCase();
  if (key === "w" || key === "s") vy = 0;
  if (key === "a" || key === "d") vx = 0;
});

canvas.addEventListener("blur", function () {
  isPlaying = false;
  vx = 0;
  vy = 0;
});

update();

// Keys tracks
addEventListener("keydown", function (e) {
  if (!isPlaying) return;

  if (e.code == "KeyD") vx = 5;
  if (e.code == "KeyA") vx = -5;
  if (e.code == "KeyW") vy = -5;
  if (e.code == "KeyS") vy = 5;
});

addEventListener("keyup", function (e) {
  if (e.code == "KeyD") vx = 0;
  if (e.code == "KeyA") vx = 0;
  if (e.code == "KeyW") vy = 0;
  if (e.code == "KeyS") vy = 0;
});
