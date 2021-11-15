// setup game

const verticalQuads = 10; // vertical quad num
const horizontalQuads = 20; // horizontal quad num
const quadSize = 30; // quad size in px
const borderQuad = 2; // border size in px
const snakeLength = 3; // snake length in quads
const Speed = 10; // quads per second


let intervalId = -1;
let applesDiv;

const Direction = {
  Left: 0,
  Right: 1,
  Up: 2,
  Down: 3
}

const Apple = {
  position: {
    x: 0,
    y: 0
  },
  draw: function(context) {
    const startX = this.position.x * quadSize + borderQuad;
    const startY = this.position.y * quadSize + borderQuad;
    const endX = quadSize - 2 * borderQuad;
    const endY = quadSize - 2 * borderQuad;

    context.fillStyle = '#550000';
    context.fillRect(startX, startY, endX, endY); 
  },
  spawn: function(snakePos = {}) {
    while(snakePos.x === this.position.x) {
      this.position.x = Math.floor(Math.random() * horizontalQuads);
    }
    
    while(snakePos.y === this.position.y) {
      this.position.y = Math.floor(Math.random() * verticalQuads);   
    }
  }
};

const Snake = {
  positions: [],
  direction: Direction.Right,
  apples: 0,
  init: function(length) {
    for (let i = 0; i < length; i++) {  
      this.positions[i] = {
        x: length - 1 - i,
        y: 0
      };
    }
    
    this.apples = 0;
    this.direction = Direction.Right;
  },
  draw: function(context) {
    for (let i = 0; i < snakeLength; i++) {      
      const startX = this.positions[i].x * quadSize + borderQuad;
      const startY = this.positions[i].y * quadSize + borderQuad;
      const endX = quadSize - 2 * borderQuad;
      const endY = endX;

      context.fillStyle = '#007700';
      context.fillRect(startX, startY, endX, endY);       
    }
  },
  update: function() {
    let lastPos = {...this.positions[0]};

    switch (this.direction) {
      case Direction.Right:
        this.positions[0].x++;
        if (this.positions[0].x >= horizontalQuads) this.positions[0].x = 0;
        break; 
      case Direction.Left:
        this.positions[0].x--;
        if (this.positions[0].x < 0) this.positions[0].x = horizontalQuads - 1;
        break;
      case Direction.Up:
        this.positions[0].y--;
        if (this.positions[0].y < 0) this.positions[0].y = verticalQuads - 1;
        break;
      case Direction.Down:
        this.positions[0].y++;
        if (this.positions[0].y >= verticalQuads) this.positions[0].y = 0;
        break;
    } 
    
    for (let i = 1; i < this.positions.length; i++) {
      const tmp = {...this.positions[i]};
      this.positions[i] = {...lastPos};
      lastPos = {...tmp};
    }
  },
  setDirection(direction) {
    switch(direction) {
      case Direction.Right:
        this.direction = this.direction != Direction.Left ? direction : this.direction;
        break;
      case Direction.Left:
        this.direction = this.direction != Direction.Right ? direction : this.direction;
        break;
      case Direction.Up:
        this.direction = this.direction != Direction.Down ? direction : this.direction;
        break;
      case Direction.Down:
        this.direction = this.direction != Direction.Up ? direction : this.direction;
    }
  },
  checkCollision: function(apple) {
    return apple.position.x === this.positions[0].x && apple.position.y === this.positions[0].y
  }
}

function createGame() {
  let canvas = document.getElementById("game_canvas");
  
  canvas.width = horizontalQuads * quadSize;
  canvas.height = verticalQuads * quadSize;
  
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    if (ctx) {  
      initGame(ctx);
    }
  } else {
    console.log('canvas id doesn\'t found');
  }  
  
  applesDiv  = document.getElementById("apples");

  if (applesDiv) {
    applesDiv.innerHTML  = `Apples: ${Snake.apples}`;
  }
}

function initGame(context) {  
  Snake.init(snakeLength);

  Apple.spawn(Snake.positions[0]);
      
  intervalId = setInterval(tick.bind(this, context), 1000 / Speed);
}

function drawBackground(context) {
  context.fillStyle = 'black';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);  
 
  context.fillStyle = '#002200';

  for (let x = 0; x < context.canvas.width; x += quadSize) {
    for (let y = 0; y < context.canvas.height; y += quadSize) {
      const startX = x + borderQuad;
      const startY = y + borderQuad;
      const endX = quadSize - 2 * borderQuad;
      const endY = endX;

      context.fillRect(startX, startY, endX, endY);  
    }
  }
}

function tick(context) {
  if (intervalId === -1) return;
  
  if (Snake.checkCollision(Apple)) {    
    Apple.spawn(Snake.positions[0]);
    
    Snake.apples++;
        
    if (applesDiv) {
      applesDiv.innerHTML  = `Apples: ${Snake.apples}`;
    }
    
    if (Snake.apples >= 5) {
      win();
    }
  }
  
  drawBackground(context);

  Snake.draw(context)
  Snake.update();
  
  Apple.draw(context);
}

function win() {
  clearInterval(intervalId);
  intervalId = -1;
  
  let winDiv = document.getElementById("win");
  
  if (winDiv) {
    winDiv.style.display = 'block';
  }
}

function restartGame() {
  let winDiv = document.getElementById("win");
  
  if (winDiv) {
    winDiv.style.display = 'none';
  }
  
  createGame();
}

function initPage() {
  const restartBtn = document.getElementById("restartGameBtn");

  if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
  }
  
  createGame();
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(initPage, 1);
} else {
  document.addEventListener("DOMContentLoaded", initPage);
}

window.addEventListener('keydown', e => {
  switch (e.key) {
   case 'ArrowUp':
     Snake.setDirection(Direction.Up);
     break;
   case 'ArrowDown':
     Snake.setDirection(Direction.Down);
     break;
   case 'ArrowLeft':
     Snake.setDirection(Direction.Left);
     break;
   case 'ArrowRight':
     Snake.setDirection(Direction.Right);
     break;     
  }
});

