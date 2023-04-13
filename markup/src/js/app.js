const gameScreen = document.querySelector('.game-screen');
const shapesList = ['pacman', 'bug', 'evil', 'IE', 'heart', 'diamonds', 'clubs', 'spades']
const gameScreenRect = gameScreen.getBoundingClientRect();
const btnStart = document.querySelector('.btn-start');
const btnTop = document.querySelector(".btn-top");
const btnDown = document.querySelector(".btn-down");
const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const scoreEl = document.querySelector(".score");
let scoreRate;

function generateRandomColor() {
  const randomColor = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;

  return randomColor;
}

function generateRandomSize(min, max, step) {
  const randomNum = Math.floor(Math.random() * ((max - min) / step + 1)) * step + min;
  return randomNum + 'px';
}

function createShape(shapeName, gameScreen, gameScreenRect) {
  const shapeHTML = `<svg class="spahe-${shapeName}"><use xlink:href="#icon-${shapeName}"></use></svg>`
  gameScreen.insertAdjacentHTML('beforeend', shapeHTML);

  const shapes = gameScreen.querySelectorAll('[class*="spahe-"]');

  shapes.forEach(shape => {
    const size = generateRandomSize(15, 60, 5);
    shape.style.width = size;
    shape.style.height = size;
    shape.style.fill = generateRandomColor();
    shape.style.borderRadius = "50%";

    const shapeRect = shape.getBoundingClientRect();

    let shapeX = shapeRect.left - gameScreenRect.left;
    let shapeY = shapeRect.top - gameScreenRect.top;
    let step = 20;

    const maxX = gameScreen.offsetWidth - shape.clientWidth*2;
    const maxY = gameScreen.offsetHeight - shape.clientHeight*2;

    function moveShape() {
      const direction = Math.floor(Math.random() * 4);
    
      switch (direction) {
        case 0:
          if (shapeY > 0) {
            shapeY -= step;
          }
          break;
        case 1:
          if (shapeY < maxY) {
            shapeY += step;
          }
          break;
        case 2:
          if (shapeX < maxX) {
            shapeX += step;
          }
          break;
        case 3:
          if (shapeX > 0) {
            shapeX -= step;
          }
          break;
      }
    
      shape.style.left = shapeX + "px";
      shape.style.top = shapeY + "px";
    
      const mainRect = mainPersonage.personage.getBoundingClientRect();
      const shapeRect = shape.getBoundingClientRect();
    
      if (
        mainRect.left < shapeRect.right &&
        mainRect.right > shapeRect.left &&
        mainRect.top < shapeRect.bottom &&
        mainRect.bottom > shapeRect.top
      ) {
        gameOver();
      }
    }

    setInterval(moveShape, 50);
  })
}

function handleMovement(e) {
  e.preventDefault();
  if(!gameScreen.classList.contains('is-started')) return;
  switch (e.type) {
    case "click":
      switch (e.target.closest('button')) {
        case btnTop:
          mainPersonage.moveTop();
          break;
        case btnDown:
          mainPersonage.moveDown();
          break;
        case btnLeft:
          mainPersonage.moveLeft();
          break;
        case btnRight:
          mainPersonage.moveRight();
          break;
      }
      break;
    case "keydown":
      switch (e.keyCode) {
        case 38:
          mainPersonage.moveTop();
          break;
        case 40:
          mainPersonage.moveDown();
          break;
        case 37:
          mainPersonage.moveLeft();
          break;
        case 39:
          mainPersonage.moveRight();
          break;
      }
      break;
  }
}

const mainPersonage = {
  personage: document.querySelector('.goose'),
  topPosition: 0,
  leftPosition: 0,
  step: 5,
  score: 0,
  defaultPos: [],

  init() {
    const runnerRect = this.personage.getBoundingClientRect();
    this.topPosition = runnerRect.top - gameScreenRect.top;
    this.leftPosition = runnerRect.left - gameScreenRect.left;

    if(!this.defaultPos.length) {
      this.defaultPos.push(this.topPosition, this.leftPosition)
    } else {
      this.topPosition = this.defaultPos[0]
      this.leftPosition = this.defaultPos[1]
    }

    this.personage.style.top = this.defaultPos[0] + 'px';
    this.personage.style.left = this.defaultPos[1] + 'px';
  },

  moveTop() {
    if(this.topPosition > 0) {
      this.topPosition -= this.step;
      this.personage.style.top = this.topPosition + 'px';
    }
  },

  moveDown() {
    if(this.topPosition < gameScreen.offsetHeight - this.personage.clientHeight) {
      this.topPosition += this.step;
      this.personage.style.top = this.topPosition + 'px';
    }
  },

  moveRight() {
    if(this.leftPosition < gameScreen.offsetWidth - this.personage.clientWidth) {
      this.leftPosition += this.step;
      this.personage.style.left = this.leftPosition + 'px';
    }
  },
  moveLeft() {
    if(this.leftPosition > 0) {
      this.leftPosition -= this.step;
      this.personage.style.left = this.leftPosition + 'px';
    }
  },
  expirienceInc() {
    this.score += 100;
    scoreEl.innerHTML = this.score;
  },
  sppeedUp() {
    this.step *= 1.1;
  }
};

function startGame(e) {
  if(gameScreen.classList.contains('is-started')) return;
  
  mainPersonage.init();
  e.preventDefault();
  gameScreen.classList.add('is-started');
  shapesList.forEach(name => {
    createShape(name, gameScreen, gameScreenRect)
  });

  clearInterval(scoreRate);
  scoreRate = setInterval(()=> {
    mainPersonage.expirienceInc()
    mainPersonage.sppeedUp()
  }, 2000) 
}

function gameOver() {
  gameScreen.classList.remove('is-started');
  gameScreen.querySelectorAll('[class*="spahe-"]').forEach(shape => shape.remove());
  clearInterval(scoreRate);
  scoreEl.innerHTML = 0;
}

btnTop.addEventListener("click", handleMovement);
btnDown.addEventListener("click", handleMovement);
btnLeft.addEventListener("click", handleMovement);
btnRight.addEventListener("click", handleMovement);
document.addEventListener("keydown", handleMovement);

btnStart.addEventListener('click', startGame) 
