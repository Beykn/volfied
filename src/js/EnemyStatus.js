export class EnemyStatus{
    constructor(canvasWidth, canvasHeight){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.size = 20;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.speedX = 3;
        this.speedY = 2;
        this.color = "#f307d8";
    }

    // Updates enemy movement and 
    update(){
        this.x += this.speedX;
        this.y += this.speedY;

        // If the enemy hits the canvas boundaries , reverse its direction
        if(this.x <= 0 || this.x + this.size >= this.canvasWidth){
            this.speedX *= -1;
        }
        
        if(this.y <= 0 || this.y + this.size >= this.canvasHeight){
            this.speedY *= -1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}