class BlackBlock extends Block {
    constructor(topLeft, size) {
        super(topLeft, size);
    }

    draw(ctx) {
        super.draw(ctx, "black");
    }
}