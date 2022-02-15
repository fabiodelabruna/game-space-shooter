const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');

let alienInterval;

function flyShip(event) {
  if(event.key === 'ArrowUp') {
    event.preventDefault();
    moveUp();
  } else if(event.key === 'ArrowDown') {
    event.preventDefault();
    moveDown();
  } else if(event.key === " ") {
    event.preventDefault();
    fireLaser();
  }
}

function moveUp() {
  let topPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('top'));
  if (topPosition <= 0) {
    return;
  } else {
    topPosition -= 25;
    yourShip.style.top = `${topPosition}px`;
  }
}

function moveDown() {
  let topPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('top'));
  if (topPosition >= 550){
    return;
  } else {
    topPosition += 25;
    yourShip.style.top = `${topPosition}px`;
  }
}

function fireLaser() {
  const laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  const xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
  const yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));

  const newLaser = document.createElement('img');
  newLaser.src = 'img/shoot.png';
  newLaser.classList.add('laser');
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;

  return newLaser;
}

function moveLaser(laser) {
  setInterval(() => {
    const xPosition = parseInt(laser.style.left);
    const aliens = document.querySelectorAll('.alien');

    aliens.forEach((alien) => {
      if(checkLaserCollision(laser, alien)) {
        alien.src = 'img/explosion.png';
        alien.classList.remove('alien');
        alien.classList.add('dead-alien');
      }
    });

    if(xPosition >= 340) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

function createAliens() {
  const newAlien = document.createElement('img');

  const alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; // sorteio de imagens
  newAlien.src = alienSprite;
  newAlien.classList.add('alien');
  newAlien.classList.add('alien-transition');
  newAlien.style.left = '370px';
  newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;

  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

function moveAlien(alien) {
  setInterval(() => {
    const xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes('dead-alien')) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${xPosition - 2}px`;
    }
  }, 30);
}

function checkLaserCollision(laser, alien) {
  const laserTop = parseInt(laser.style.top);
  const laserLeft = parseInt(laser.style.left);
  const alienTop = parseInt(alien.style.top);
  const alienLeft = parseInt(alien.style.left);
  const alienBottom = alienTop - 30;

  if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
    if(laserTop <= alienTop && laserTop >= alienBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

startButton.addEventListener('click', event => {
  playGame();
});

function playGame() {
  startButton.style.display = 'none';
  instructionsText.style.display = 'none';
  window.addEventListener('keydown', flyShip);

  alienInterval = setInterval(() => {
      createAliens();
  }, 2000);
}

function gameOver() {
  window.removeEventListener('keydown', flyShip);
  clearInterval(alienInterval);

  const aliens = document.querySelectorAll('.alien');
  aliens.forEach((alien) => alien.remove());

  const lasers = document.querySelectorAll('.laser');
  lasers.forEach((laser) => laser.remove());

  setTimeout(() => {
    alert('game over!');
    yourShip.style.top = "250px";
    startButton.style.display = "block";
    instructionsText.style.display = "block";
  });
}
