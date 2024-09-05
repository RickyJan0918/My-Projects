class Dot {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
        this.velocity = new Vector2(0, 0);
    }

    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    move(deltaTime) {
        this.position = this.position.add(this.velocity.scale(deltaTime));
    }

    boundaryCollision(worldSize) {
        if (this.position.x < this.radius) {
            this.position.x = this.radius;
            this.velocity.x *= -1;
        }

        if (this.position.y < this.radius) {
            this.position.y = this.radius;
            this.velocity.y *= -1;
        }

        if (this.position.x > worldSize - this.radius) {
            this.position.x = worldSize - this.radius;
            this.velocity.x *= -1;
        }

        if (this.position.y > worldSize - this.radius) {
            this.position.y = worldSize - this.radius;
            this.velocity.y *= -1;
        }
    }

    draw(ctx, color) {
        DrawUtils.drawCircle(this.position, this.radius, color);
    }
}