export class PlayerStatus {
    // Stores position, dimensions, speed, and drawing state for player
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.size = 15;        // Size in pixels (15x15)
        this.speed = 4;        // Movement speed
        this.path = [];        // Store active path points
        this.reset();
    }

    // Reset player position and state
    reset() {
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
        this.color = "#34ef05";
        this.path = [];
    }

    // Checks if player is on any outer edge (safe zone)
    isOnEdge() {
        const maxX = this.canvasWidth - this.size;
        const maxY = this.canvasHeight - this.size;

        return this.x === 0 || this.y === 0 || this.x === maxX || this.y === maxY;
    }

    // Updates player position and handles path creation
    update(keys) {
        let nextX = this.x;
        let nextY = this.y;

        // Calculate position based on key inputs
        if (keys.ArrowUp) nextY -= this.speed;
        if (keys.ArrowDown) nextY += this.speed;
        if (keys.ArrowLeft) nextX -= this.speed;
        if (keys.ArrowRight) nextX += this.speed;
        
        // Keep within canvas bounds
        if (nextX < 0) nextX = 0;
        if (nextY < 0) nextY = 0;
        if (nextX + this.size > this.canvasWidth) nextX = this.canvasWidth - this.size;
        if (nextY + this.size > this.canvasHeight) nextY = this.canvasHeight - this.size;

        const currentlyOnEdge = this.isOnEdge();

        if (currentlyOnEdge && !this.isDrawing) {
            this.x = nextX;
            this.y = nextY;

            // Enter drawing mode when leaving the edge
            if (!this.isOnEdge()) {
                this.isDrawing = true;
                this.color = "#ff0000";
                this.path.push({
                    x: this.x + this.size / 2,
                    y: this.y + this.size / 2 
                });
            }
        } else {
            this.x = nextX;
            this.y = nextY;

            if (this.isDrawing) {
                this.path.push({
                    x: this.x + this.size / 2,
                    y: this.y + this.size / 2
                });
            }

            // Exit drawing mode when reaching any edge
            if (this.isOnEdge()) {
                this.isDrawing = false;
                this.color = "#34ef05";

                const completedPath = [...this.path];
                this.path = []; // Reset active path
                return completedPath; // Return closed shape path
            }
        }
        return null;
    }

    // Renders active path and player square
    draw(ctx) {
        // Draw current path
        if (this.path.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 3;
            ctx.moveTo(this.path[0].x, this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            ctx.stroke();
        }

        // Draw player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}