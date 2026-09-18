// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player object storing position, dimensions, speed, and drawing state
const player = {
    x: 0,           // X coordinate (0 = leftmost edge)
    y: 0,           // Y coordinate (0 = topmost edge)
    size: 15,       // Player size in pixels (15x15)
    speed: 4,       // Movement speed
    color: "#34ef05",
    isDrawing: false
};

// Enemy object storing position, dimensions, speed, and drawing state
const enemy = {
    x: canvas.width / 2, //center of the screen
    y: canvas.height / 2,
    size: 20,
    speedX: 3,
    speedY: 2,
    color: "#ff00ff"
};

//list for storing the point of the player path 
let path = [];

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

// Checks if the player is currently on any outer edge (safe zone)
function isOnEdge(x, y) {
    const maxX = canvas.width - player.size;
    const maxY = canvas.height - player.size;

    return x === 0 || y === 0 || x === maxX || y === maxY;
}

// If enemy collides with the player, reset the player to the starting position and clear the path
function resetPlayer(){
    player.x = 0;
    player.y = 0;
    player.isDrawing = false;
    player.color = "#34ef05";
    path = [];
}

// Check for collision between the player and the enemy 
function checkCollision(){
    // If enemy collides directly with the player
    if (
        enemy.x < player.x + player.size &&
        enemy.x + enemy.size > player.x &&
        enemy.y < player.y + player.size &&
        enemy.y + enemy.size > player.y
    ) {
        resetPlayer();
        return;
    }

    // If enemy collides with the player's path while the player is drawing
    if (player.isDrawing) {
        for (let point of path) {
            if (
                point.x >= enemy.x &&
                point.x <= enemy.x + enemy.size &&
                point.y >= enemy.y &&
                point.y <= enemy.y + enemy.size
            ) {
                resetPlayer();
                break;
            }
        }
    }
}

// Updates enemy movement and 
function updateEnemy(){
    enemy.x += enemy.speedX;
    enemy.y += enemy.speedY;

    // If the enemy hits the canvas boundaries , reverse its direction
    if(enemy.x <= 0 || enemy.x + enemy.size >= canvas.width){
        enemy.speedX *= -1;
    }

    if(enemy.y <= 0 || enemy.y + enemy.size >= canvas.height){
        enemy.speedY *= -1;
    }
}
// Updates player movement and handles transition between safe boundary and drawing mode
function updatePlayer() {
    let nextX = player.x;
    let nextY = player.y;

    // Calculate potential position based on key inputs
    if (keys.ArrowUp) nextY -= player.speed;
    if (keys.ArrowDown) nextY += player.speed;
    if (keys.ArrowLeft) nextX -= player.speed;
    if (keys.ArrowRight) nextX += player.speed;
    
    // Keep player within canvas boundaries
    if (nextX < 0) nextX = 0;
    if (nextY < 0) nextY = 0;
    if (nextX + player.size > canvas.width) nextX = canvas.width - player.size;
    if (nextY + player.size > canvas.height) nextY = canvas.height - player.size;

    // Check if player is on the edge
    const curentlyOnEdge = isOnEdge(player.x, player.y);

    if (curentlyOnEdge && !player.isDrawing) {
        player.x = nextX;
        player.y = nextY;

        // Enter drawing mode when stepping off the edge
        if (!isOnEdge(player.x, player.y)) {
            player.isDrawing = true;
            player.color = "#ff0000";
        }

        //start point of the path and center of the player
        path.push({
            x: player.x + player.size / 2,
            y: player.y + player.size/ 2 
        });

    } else {
        player.x = nextX;
        player.y = nextY;

        if (player.isDrawing) {
            // Add the current position to the path if drawing
            path.push({
                x: player.x + player.size / 2,
                y: player.y + player.size / 2
            });
        }

        // Exit drawing mode when reaching any edge
        if (isOnEdge(player.x, player.y)) {
            player.isDrawing = false;
            player.color = "#34ef05";

            path = []; //clear the path when the player return the edge 
        }
    }
}

function update() {
    updatePlayer();
    updateEnemy();
    checkCollision();
}

// Clears the canvas and renders the player
function draw() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if(path.length > 1){
        ctx.beginPath();
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 3;
        ctx.moveTo(path[0].x,path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
    }

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Draw enemy
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
}

// Main game loop running at screen refresh rate
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Schedule next frame
}

// Start the game
gameLoop();