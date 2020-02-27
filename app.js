(function() {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = 800,
  height = 400,
  player1 = {
    x: width / 4,
    y: height - 100,
    width: 50,
    height: 100,
    speed: 7,
    health: 100,
    attack: 5,
    range: 50,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    lastDir: "r",
    dead: false,
    kills: 0
  },
  player2 = {
    x: width * 0.75 - 50,
    y: height - 100,
    width: 50,
    height: 100,
    speed: 7,
    health: 100,
    attack: 5,
    range: 50,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    lastDir: "l",
    dead: false,
    kills: 0
  },
  keys = [],
  friction = 0.9,
  gravity = 0.66;

canvas.width = width;
canvas.height = height;

// load sounds
var sound = new Array();
sound[0] = new Audio(
  "https://jonkantner.com/experiments/stick_fight/sounds/hit.ogg"
);
sound[1] = new Audio(
  "https://jonkantner.com/experiments/stick_fight/sounds/miss.ogg"
);

var frameRP1 = 1,
  frameRP2 = 1,
  frameLP1 = 11,
  frameLP2 = 11,
  frameLPunchP1 = 37,
  frameLPunchP2 = 37,
  frameRPunchP1 = 26,
  frameRPunchP2 = 26,
  maxFrames = 74,
  player1Sprites = new Array(maxFrames),
  player2Sprites = new Array(maxFrames),
  anim1,
  anim2,
  deathTime = 0,
  healthP1 = document.getElementById("p1-health"),
  healthP2 = document.getElementById("p2-health");

// load player 1 sprites
for (var i = 0; i <= maxFrames; ++i) {
  player1Sprites[i] = new Image();
  player1Sprites[i].src =
    "https://jonkantner.com/experiments/stick_fight/sprites/player1/player" +
    i +
    ".svg";
  if (i == maxFrames) {
    anim1 = function() {
      if (player1.dead == false) {
        if (
          (keys[65] && !player1.jumping) ||
          (left_P1 == true && !player1.jumping)
        ) {
          // move left
          ctx.drawImage(player1Sprites[frameLP1], player1.x, player1.y);
          ++frameLP1;
          if (frameLP1 == 22) {
            frameLP1 = 11;
          }
        } else if (
          (keys[68] && !player1.jumping) ||
          (right_P1 == true && !player1.jumping)
        ) {
          // move right
          ctx.drawImage(player1Sprites[frameRP1], player1.x, player1.y);
          ++frameRP1;
          if (frameRP1 == 11) {
            frameRP1 = 1;
          }
        } else if (player1.jumping == true) {
          // jump
          if (player1.lastDir == "l") {
            ctx.drawImage(player1Sprites[24], player1.x, player1.y);
          } else {
            ctx.drawImage(player1Sprites[23], player1.x, player1.y);
          }
        } else if (keys[16] || b_P1 == true) {
          // attack
          if (player1.lastDir == "l") {
            ctx.drawImage(
              player1Sprites[frameLPunchP1],
              player1.x - player1.width / 2,
              player1.y
            );
            if (frameLPunchP1 != 36) {
              ++frameLPunchP1;
              // dealing damage from right
              if (
                player1.x - player1.range <= player2.x + player2.width &&
                player1.x - player1.range >= player2.x - player2.width / 2 &&
                player1.y >= player2.y &&
                player1.y <= player2.y + player2.height
              ) {
                hurt(player2, player1, healthP2);
              } else {
                sound[1].play();
              }
            }
            if (frameLPunchP1 == 46) {
              frameLPunchP1 = 36;
            }
          } else {
            ctx.drawImage(player1Sprites[frameRPunchP1], player1.x, player1.y);
            if (frameRPunchP1 != 25) {
              ++frameRPunchP1;
              // dealing damage from left
              if (
                player1.x + player1.width + player1.range >= player2.x &&
                player1.x + player1.width + player1.range <=
                  player2.x + player2.width * 1.5 &&
                player1.y >= player2.y &&
                player1.y <= player2.y + player2.height
              ) {
                hurt(player2, player1, healthP2);
              } else {
                sound[1].play();
              }
            }
            if (frameRPunchP1 == 35) {
              frameRPunchP1 = 25;
            }
          }
        } else {
          ctx.drawImage(player1Sprites[0], player1.x, player1.y);
          frameLPunchP1 = 37;
          frameRPunchP1 = 26;
        }
      }
    };
  }
}
healthP1.style.width = player1.health + "%";

// load player 2 sprites
for (var j = 0; j <= maxFrames; ++j) {
  player2Sprites[j] = new Image();
  console.log(j);
  player2Sprites[j].src =
    "https://jonkantner.com/experiments/stick_fight/sprites/player2/player" +
    j +
    ".svg";
  if (j == maxFrames) {
    anim2 = function() {
      if (player2.dead == false) {
        if (
          (keys[37] && !player2.jumping) ||
          (left_P2 == true && !player2.jumping)
        ) {
          // move left
          ctx.drawImage(player2Sprites[frameLP2], player2.x, player2.y);
          ++frameLP2;
          if (frameLP2 == 22) {
            frameLP2 = 11;
          }
        } else if (
          (keys[39] && !player2.jumping) ||
          (right_P2 == true && !player2.jumping)
        ) {
          // move right
          ctx.drawImage(player2Sprites[frameRP2], player2.x, player2.y);
          ++frameRP2;
          if (frameRP2 == 11) {
            frameRP2 = 1;
          }
        } else if (player2.jumping == true) {
          // jump
          if (player2.lastDir == "l") {
            ctx.drawImage(player2Sprites[24], player2.x, player2.y);
          } else {
            ctx.drawImage(player2Sprites[23], player2.x, player2.y);
          }
        } else if (keys[186] || b_P2 == true) {
          // attack
          if (player2.lastDir == "l") {
            ctx.drawImage(
              player2Sprites[frameLPunchP2],
              player2.x - player2.width / 2,
              player2.y
            );
            if (frameLPunchP2 != 36) {
              ++frameLPunchP2;
              // dealing damage from right
              if (
                player2.x - player2.range <= player1.x + player1.width &&
                player2.x - player2.range >= player1.x - player1.width / 2 &&
                player2.y >= player1.y &&
                player2.y <= player1.y + player1.height
              ) {
                hurt(player1, player2, healthP1);
              } else {
                sound[1].play();
              }
            }
            if (frameLPunchP2 == 46) {
              frameLPunchP2 = 36;
            }
          } else {
            ctx.drawImage(player2Sprites[frameRPunchP2], player2.x, player2.y);
            if (frameRPunchP2 != 25) {
              ++frameRPunchP2;
              // dealing damage from left
              if (
                player2.x + player2.width + player2.range >= player1.x &&
                player2.x + player2.width + player2.range <=
                  player1.x + player1.width * 1.5 &&
                player2.y >= player1.y &&
                player2.y <= player1.y + player1.height
              ) {
                hurt(player1, player2, healthP1);
              } else {
                sound[1].play();
              }
            }
            if (frameRPunchP2 == 35) {
              frameRPunchP2 = 25;
            }
          }
        } else {
          ctx.drawImage(player2Sprites[0], player2.x, player2.y);
          frameLPunchP2 = 37;
          frameRPunchP2 = 26;
        }
      }
    };
  }
}
healthP2.style.width = player2.health + "%";

function update() {
  // jump
  // player 1
  if (keys[87] || a_P1 == true) {
    if (!player1.jumping) {
      player1.jumping = true;
      player1.velY = -player2.speed * 2;
    }
    if (!player1.jumping && player1.grounded) {
      player1.jumping = true;
      player1.grounded = false;
      player1.velY = -player1.speed * 2;
    }
  }
  // player 2
  if (keys[38] || a_P2 == true) {
    if (!player2.jumping) {
      player2.jumping = true;
      player2.velY = -player2.speed * 2;
    }
    if (!player2.jumping && player2.grounded) {
      player2.jumping = true;
      player2.grounded = false;
      player2.velY = -player2.speed * 2;
    }
  }
  // move left
  // player 1
  if (keys[65] || left_P1 == true) {
    if (player1.velX > -player1.speed) {
      player1.velX--;
      player1.lastDir = "l";
    }
  }
  // player 2
  if (keys[37] || left_P2 == true) {
    if (player2.velX > -player2.speed) {
      player2.velX--;
      player2.lastDir = "l";
    }
  }
  // move right
  // player 1
  if (keys[68] || right_P1 == true) {
    if (player1.velX < player1.speed) {
      player1.velX++;
      player1.lastDir = "r";
    }
  }
  // player 2
  if (keys[39] || right_P2 == true) {
    if (player2.velX < player2.speed) {
      player2.velX++;
      player2.lastDir = "r";
    }
  }

  // render stage
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.beginPath();

  player1.grounded = false;
  player2.grounded = false;

  for (var k = 0; k < platforms.length; k++) {
    ctx.rect(
      platforms[k].x,
      platforms[k].y,
      platforms[k].width,
      platforms[k].height
    );

    var dir1 = colCheck(player1, platforms[k]);
    var dir2 = colCheck(player2, platforms[k]);

    if (dir1 === "l" || dir1 === "r") {
      player1.velX = 0;
      player1.jumping = false;
    } else if (dir1 === "b") {
      player1.grounded = true;
      player1.jumping = false;
    } else if (dir1 === "t") {
      player1.velY *= -1;
    }

    if (dir2 === "l" || dir2 === "r") {
      player2.velX = 0;
      player2.jumping = false;
    } else if (dir2 === "b") {
      player2.grounded = true;
      player2.jumping = false;
    } else if (dir2 === "t") {
      player2.velY *= -1;
    }
  }

  if (player1.grounded) {
    player1.velY = 0;
  }
  if (player2.grounded) {
    player2.velY = 0;
  }

  player1.x += player1.velX;
  player1.y += player1.velY;
  player1.velX *= friction;
  player1.velY += gravity;

  player2.x += player2.velX;
  player2.y += player2.velY;
  player2.velX *= friction;
  player2.velY += gravity;

  ctx.closePath();
  ctx.fill();

  // render and animate characters
  anim1();
  anim2();

  // death animations
  if (deathTime != 0 && deathTime < 14) {
    ++deathTime;
    if (player1.dead == true) {
      if (player1.lastDir == "l") {
        ctx.drawImage(player1Sprites[46 + deathTime], player1.x, player1.y);
      } else {
        ctx.drawImage(player1Sprites[60 + deathTime], player1.x, player1.y);
      }
      if (deathTime == 13) {
        incKO(player2, "p2-kills");
      }
    } else if (player2.dead == true) {
      if (player2.lastDir == "l") {
        ctx.drawImage(player2Sprites[46 + deathTime], player2.x, player2.y);
      } else {
        ctx.drawImage(player2Sprites[60 + deathTime], player2.x, player2.y);
      }
      if (deathTime == 13) {
        incKO(player1, "p1-kills");
      }
    }
  }
  if (deathTime == 14) {
    deathTime = 14;
  }

  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
    vY = shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),
    // add the half widths and half heights of the objects
    hWidths = shapeA.width / 2 + shapeB.width / 2,
    hHeights = shapeA.height / 2 + shapeB.height / 2,
    colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        shapeA.y += oY;
      } else {
        colDir = "b";
        shapeA.y -= oY;
      }
    } else {
      if (vX > 0) {
        colDir = "l";
        shapeA.x += oX;
      } else {
        colDir = "r";
        shapeA.x -= oX;
      }
    }
  }
  return colDir;
}

// when opponent is hit
function hurt(victim, attacker, victimHealth) {
  sound[0].play();
  victim.health -= attacker.attack;
  victimHealth.style.width = victim.health + "%";

  // low health
  if (victim.health > 10 && victim.health <= 30) {
    victimHealth.style.background = "#c60";
  }
  // critical health
  if (victim.health > 0 && victim.health <= 10) {
    victimHealth.style.background = "#a00";
  }
  // dead
  if (victim.health <= 0) {
    victim.dead = true;
    deathTime = 1;
    setTimeout(function() {
      respawn(victim, victimHealth);
    }, 400);
  }
}

// increment winner’s KO count when he defeated opponent
function incKO(winner, winnerCounter) {
  ++winner.kills;
  document.getElementById(winnerCounter).innerHTML = winner.kills;
}

// respawn defeated player
function respawn(newLife, healthToFill) {
  deathTime = 0;
  newLife.dead = false;
  newLife.x = newLife == player1 ? width / 4 : width * 0.75 - 50;
  newLife.y = height - 100;
  newLife.health = 100;
  healthToFill.style.width = newLife.health + "%";
  healthToFill.style.background = "#0a0";
}

window.addEventListener("load", function() {
  update();
});
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

// tablet/phone control buttons
var leftBtn_P1 = document.getElementById("p1-left"),
  rightBtn_P1 = document.getElementById("p1-right"),
  aBtn_P1 = document.getElementById("p1-up"),
  bBtn_P1 = document.getElementById("p1-atk"),
  leftBtn_P2 = document.getElementById("p2-left"),
  rightBtn_P2 = document.getElementById("p2-right"),
  aBtn_P2 = document.getElementById("p2-up"),
  bBtn_P2 = document.getElementById("p2-atk");

// tablet/phone control interaction
var left_P1 = false,
  right_P1 = false,
  a_P1 = false,
  b_P1 = false,
  left_P2 = false,
  right_P2 = false,
  a_P2 = false,
  b_P2 = false;

// player 1 buttons
leftBtn_P1.addEventListener("mousedown", function() {
  left_P1 = true;
});
leftBtn_P1.addEventListener("mouseup", function() {
  left_P1 = false;
});
leftBtn_P1.addEventListener("touchstart", function() {
  left_P1 = true;
});
leftBtn_P1.addEventListener("touchend", function() {
  left_P1 = false;
});

rightBtn_P1.addEventListener("mousedown", function() {
  right_P1 = true;
});
rightBtn_P1.addEventListener("mouseup", function() {
  right_P1 = false;
});
rightBtn_P1.addEventListener("touchstart", function() {
  right_P1 = true;
});
rightBtn_P1.addEventListener("touchend", function() {
  right_P1 = false;
});

aBtn_P1.addEventListener("mousedown", function() {
  a_P1 = true;
});
aBtn_P1.addEventListener("mouseup", function() {
  a_P1 = false;
});
aBtn_P1.addEventListener("touchstart", function() {
  a_P1 = true;
});
aBtn_P1.addEventListener("touchend", function() {
  a_P1 = false;
});

bBtn_P1.addEventListener("mousedown", function() {
  b_P1 = true;
});
bBtn_P1.addEventListener("mouseup", function() {
  b_P1 = false;
});
bBtn_P1.addEventListener("touchstart", function() {
  b_P1 = true;
});
bBtn_P1.addEventListener("touchend", function() {
  b_P1 = false;
});

// player 2 buttons
leftBtn_P2.addEventListener("mousedown", function() {
  left_P2 = true;
});
leftBtn_P2.addEventListener("mouseup", function() {
  left_P2 = false;
});
leftBtn_P2.addEventListener("touchstart", function() {
  left_P2 = true;
});
leftBtn_P2.addEventListener("touchend", function() {
  left_P2 = false;
});

rightBtn_P2.addEventListener("mousedown", function() {
  right_P2 = true;
});
rightBtn_P2.addEventListener("mouseup", function() {
  right_P2 = false;
});
rightBtn_P2.addEventListener("touchstart", function() {
  right_P2 = true;
});
rightBtn_P2.addEventListener("touchend", function() {
  right_P2 = false;
});

aBtn_P2.addEventListener("mousedown", function() {
  a_P2 = true;
});
aBtn_P2.addEventListener("mouseup", function() {
  a_P2 = false;
});
aBtn_P2.addEventListener("touchstart", function() {
  a_P2 = true;
});
aBtn_P2.addEventListener("touchend", function() {
  a_P2 = false;
});

bBtn_P2.addEventListener("mousedown", function() {
  b_P2 = true;
});
bBtn_P2.addEventListener("mouseup", function() {
  b_P2 = false;
});
bBtn_P2.addEventListener("touchstart", function() {
  b_P2 = true;
});
bBtn_P2.addEventListener("touchend", function() {
  b_P2 = false;
});

var platforms = [];
var platThickness = 10;

// left wall
platforms.push({
  x: 0,
  y: 0,
  width: 10,
  height: height
});
// right wall
platforms.push({
  x: width - 10,
  y: 0,
  width: 10,
  height: height
});
// floor
platforms.push({
  x: 0,
  y: height - 10,
  width: width,
  height: 50
});
// ceiling
platforms.push({
  x: 0,
  y: 0,
  width: width,
  height: platThickness
});
// platforms
platforms.push({
  x: 0,
  y: height - 140,
  width: 180,
  height: platThickness
});
platforms.push({
  x: width - 180,
  y: height - 140,
  width: 180,
  height: platThickness
});
platforms.push({
  x: 310,
  y: height - 240,
  width: 180,
  height: platThickness
});

/* Platformer game tutorial by Loktar (twitter.com/loktar00)
somethinghitme.com/2013/01/09/creating-a-canvas-platformer-tutorial-part-one/
somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
*/
