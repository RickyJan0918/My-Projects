class BlackDot extends Dot {
    constructor(position, radius) {
        super(position, radius);
    }

    draw(ctx) {
        super.draw(ctx, "black");
    }
}