import { PlayerStatus } from './PlayerStatus.js';
import { EnemyStatus } from './EnemyStatus.js';
import { Board } from './Board.js';


// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = new PlayerStatus(canvas.width, canvas.height);
const enemy = new EnemyStatus(canvas.width, canvas.height);
const board = new Board();


// Keyboard key state tracker
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listener for key press down
window.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

// Event listener for key release
window.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});


function update() {
    const completedPath = player.update(keys);
    if (completedPath) {
        board.addPolygon(completedPath);
    }

    enemy.update();
    board.checkCollision(player, enemy);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.draw(ctx);
    player.draw(ctx);
    enemy.draw(ctx);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();;