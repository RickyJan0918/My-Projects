class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    sub(vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    scale(scaler) {
        return new Vector2(this.x * scaler, this.y * scaler);
    }

    mag2() {
        return this.x ** 2 + this.y ** 2;
    }

    mag() {
        return Math.sqrt(this.mag2());
    }

    normalize() {
        let magnitude = this.mag();
        return magnitude === 0 ? new Vector2(0, 0) : new Vector2(this.x / magnitude, this.y / magnitude);
    }
}