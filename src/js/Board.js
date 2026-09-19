export class Board {
    constructor() {
        this.polygons = [];
    }

    addPolygon(polygon) {
        if (polygon && polygon.length > 2) {
            this.polygons.push(polygon);
        }
    }

    // Check for collision between the player and the enemy 
    checkCollision(player, enemy) {
        //  If enemy collides directly with the player
        if (
            enemy.x < player.x + player.size &&
            enemy.x + enemy.size > player.x &&
            enemy.y < player.y + player.size &&
            enemy.y + enemy.size > player.y
        ) {
            player.reset();
            return true;
        }

        //  If enemy collides with the player's path while drawing
        if (player.isDrawing && player.path && player.path.length > 0) {
            for (let point of player.path) {
                if (
                    point.x >= enemy.x &&
                    point.x <= enemy.x + enemy.size &&
                    point.y >= enemy.y &&
                    point.y <= enemy.y + enemy.size
                ) {
                    player.reset();
                    return true;
                }
            }
        }
        return false;
    }

    draw(ctx) {
        for (let poly of this.polygons) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 150, 255, 0.5)";
            ctx.strokeStyle = "#0096ff";
            ctx.lineWidth = 2;
            ctx.moveTo(poly[0].x, poly[0].y);
            for (let i = 1; i < poly.length; i++) {
                ctx.lineTo(poly[i].x, poly[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}