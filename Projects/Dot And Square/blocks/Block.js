class Block {
    constructor(topLeft, size) {
        this.topLeft = topLeft;
        this.size = size;
    }

    draw(ctx, color) {
        DrawUtils.drawSquare(this.topLeft, this.size, color);
    }
}