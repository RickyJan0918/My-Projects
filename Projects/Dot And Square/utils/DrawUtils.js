class DrawUtils {
    static drawSquare(topLeft, size, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(topLeft.x, topLeft.y, size, size);
        ctx.fill();
        ctx.closePath();
    }

    static drawCircle(center, radius, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    }
}