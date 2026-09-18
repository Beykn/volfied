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

// Updates player movement and handles transition between safe boundary and drawing mode
function update() {
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
    } else {
        player.x = nextX;
        player.y = nextY;

        // Exit drawing mode when reaching any edge
        if (isOnEdge(player.x, player.y)) {
            player.isDrawing = false;
            player.color = "#34ef05";
        }
    }
}

// Clears the canvas and renders the player
function draw() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Main game loop running at screen refresh rate
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Schedule next frame
}

// Start the game
gameLoop();