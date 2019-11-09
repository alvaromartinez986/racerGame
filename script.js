const speedDash = document.querySelector(".speedDash");
const scoreDash = document.querySelector(".scoreDash");
const lifeDash = document.querySelector(".lifeDash");

const container = document.getElementById("container");
const btnStart = document.querySelector(".btnStart");

let animationGame;
let gamePlay = false;

btnStart.addEventListener("click", startGame);
document.addEventListener("keydown", pressKeyOn);
document.addEventListener("keyup", pressKeyOff);
//Game Variables

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};
let player;

function startGame() {
  container.innerHTML = "";
  var div = document.createElement("div");
  btnStart.style.display = "none";
  div.setAttribute("class", "playerCar");
  div.x = 250;
  div.y = 500;
  container.appendChild(div);
  gamePlay = true;
  animationGame = requestAnimationFrame(playGame);

  player = {
    ele: div,
    speed: 0,
    lives: 3,
    gameScore: 0,
    carstoPass: 10,
    score: 0,
    roadwidth: 250,
    gameEndCounter: 0
  };

  startBoard();
  setupBadGuys(10);
}

function setupBadGuys(num) {
  for (let i = 0; i < num; i++) {
    let temp = "badGuy" + (i + 1);
    let div = document.createElement("div");
    div.innerHTML = i + 1;
    div.setAttribute("class", "baddy");
    div.setAttribute("id", temp);
    makeBad(div);
    container.appendChild(div);
  }
}

function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}

function makeBad(e) {
  let tempRoad = document.querySelector(".road");
  e.style.left =
    tempRoad.offsetLeft +
    Math.ceil(Math.random() * tempRoad.offsetWidth) -
    30 +
    "px";
  e.style.top = Math.ceil(Math.random() * -400) + "px";
  e.speed = Math.ceil(Math.random() * 17) + 2;
}

function startBoard() {
  for (let x = 0; x < 13; x++) {
    var div = document.createElement("div");
    div.setAttribute("class", "road");
    div.style.top = x * 50 + "px";
    div.style.width = player.roadwidth + "px";
    container.appendChild(div);
  }
}

function pressKeyOn(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function pressKeyOff(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function moveRoad() {
  let tempRoad = document.querySelectorAll(".road");
  let previousRoad = tempRoad[0].offsetLeft;
  let previousWidth = tempRoad[0].offsetWidth;
  const pSpeed = Math.floor(player.speed);

  for (let i = 0; i < tempRoad.length; i++) {
    let num = tempRoad[i].offsetTop + pSpeed;

    if (num > 600) {
      num -= 650;
      let mover = previousRoad + Math.floor(Math.random() * 6) - 3;
      let roadWidth = Math.floor(Math.random() * 11) - 5 + previousWidth;

      if (roadWidth < 200) {
        roadWidth = 200;
      }
      if (roadWidth > 400) {
        roadWidth = 400;
      }
      if (mover < 100) {
        mover = 100;
      }
      if (mover > 600) {
        mover = 600;
      }

      tempRoad[i].style.left = mover + "px";
      tempRoad[i].style.width = roadWidth + "px";

      previousRoad = tempRoad[i].offsetLeft;
      previousWidth = tempRoad[i].offsetWidth;
    }
    tempRoad[i].style.top = num + "px";
  }

  return { width: previousWidth, left: previousRoad };
}

function movedBadGuys() {
  let tempBaddy = document.querySelectorAll(".baddy");
  for (let i = 0; i < tempBaddy.length; i++) {
    for (let j = 0; j < tempBaddy.length; j++) {
      if (i != j && isCollide(tempBaddy[i], tempBaddy[j])) {
        tempBaddy[j].style.top = tempBaddy[j].offsetTop + 20 + "px";
        tempBaddy[i].style.top = tempBaddy[i].offsetTop - 20 + "px";
        tempBaddy[i].style.left = tempBaddy[i].offsetLeft - 20 + "px";
        tempBaddy[j].style.left = tempBaddy[j].offsetLeft + 20 + "px";
      }
    }

    let y = tempBaddy[i].offsetTop + player.speed - tempBaddy[i].speed;
    if (y > 2000 || y < -2000) {
      //reset car

      if (y > 2000) {
        player.score++;
        if (player.score > player.carstoPass) {
          gameOverPlay();
        }
      }
      makeBad(tempBaddy[i]);
    } else {
      tempBaddy[i].style.top = y + "px";
      let hitCar = isCollide(tempBaddy[i], player.ele);

      if (hitCar) {
        player.speed = 0;
        player.lives--;

        if (player.lives < 1) {
          player.gameEndCounter = 1;
        }
        makeBad(tempBaddy[i]);
      }
    }
  }
}

function gameOverPlay() {
  let div = document.createElement("div");
  div.setAttribute("class", "road");
  div.style.top = "0px";
  div.style.width = "250px";
  div.style.backgroundColor = "red";
  div.innerHTML = "FINISH";
  div.style.fontSize = "3em";
  container.appendChild(div);
  player.gameEndCounter = 12;
  player.speed = 0;
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function updateDash() {
  //console.log(player);
  scoreDash.innerHTML = player.score;
  lifeDash.innerHTML = player.lives;
  speedDash.innerHTML = Math.round(player.speed * 13);
}

function playGame() {
  if (player.gameEndCounter > 0) {
    player.gameEndCounter--;
    player.y = player.y > 60 ? player.y - 30 : 60;

    if (player.gameEndCounter === 0) {
      gamePlay = false;
      cancelAnimationFrame(animationGame);
      btnStart.style.display = "block";
    }
  }

  if (gamePlay) {
    updateDash();
    //movement

    let roadPara = moveRoad();
    roadPara;
    movedBadGuys();

    if (keys.ArrowUp) {
      if (player.ele.y > 400) {
        player.ele.y -= 1;
      }
      player.speed = player.speed < 20 ? player.speed + 0.05 : 20;
    }
    if (keys.ArrowDown) {
      if (player.ele.y < 500) {
        player.ele.y += 1;
      }
      player.speed = player.speed > 0 ? player.speed - 0.2 : 0;
    }
    if (keys.ArrowRight) {
      player.ele.x += player.speed / 4;
    }
    if (keys.ArrowLeft) {
      player.ele.x -= player.speed / 4;
    }

    //check if on road

    if (
      player.ele.x + 30 < roadPara.left ||
      player.ele.x > roadPara.left + roadPara.width
    ) {
      if (player.ele.y < 500) {
        player.ele.y += 1;
      }
      player.speed = player.speed > 0 ? player.speed - 0.2 : 1;
    }

    //move car
    player.ele.style.top = player.ele.y + "px";
    player.ele.style.left = player.ele.x + "px";
  }
  animationGame = requestAnimationFrame(playGame);
}
