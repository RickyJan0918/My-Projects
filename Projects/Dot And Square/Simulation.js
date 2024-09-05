class Simulation {
    constructor(worldSize) {
        this.worldSize = worldSize;

        this.dots = [];
        let dotRadius = 30;
        let dotSpeed = 20;

        let blackDot = new BlackDot(new Vector2(worldSize / 2, worldSize * 1 / 6), dotRadius);
        blackDot.setVelocity(-dotSpeed, dotSpeed);
        this.dots.push(blackDot);

        let whiteDot = new WhiteDot(new Vector2(worldSize / 2, worldSize * 5 / 6), dotRadius);
        whiteDot.setVelocity(dotSpeed, -dotSpeed);
        this.dots.push(whiteDot);

        this.blocks = [];
        this.setupBlocks(10);
    }

    setupBlocks(numBlocks) {
        let blockSize = parseInt(this.worldSize / numBlocks);
        for (let y = 0; y < this.worldSize; y += blockSize){
            for (let i = y; i < this.worldSize; i += blockSize) {
                this.blocks.push(new WhiteBlock(new Vector2(i, y), blockSize));
            }

            for (let i = 0; i < y; i += blockSize) {
                this.blocks.push(new BlackBlock(new Vector2(i, y), blockSize));
            }
        }
    }

    update(deltaTime) {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].move(deltaTime);
            this.dots[i].boundaryCollision(this.worldSize);
            for (let j = 0; j < this.blocks.length; j++) {
                let collisionManifold = CollisionDetection.checkCollision(this.dots[i], this.blocks[j]);
                if (collisionManifold) {
                    collisionManifold.positionCorrection();
                    collisionManifold.resolveCollision();
                    this.replaceBlock(this.dots[i], this.blocks[j], j);
                }
            }
        }
    }

    replaceBlock(dot, block, blockIndex) {
        if (dot instanceof WhiteDot && block instanceof WhiteBlock) {
            let topLeft = block.topLeft;
            let blockSize = block.size;
            this.blocks[blockIndex] = new BlackBlock(topLeft, blockSize);
        } else if (dot instanceof BlackDot && block instanceof BlackBlock) {
            let topLeft = block.topLeft;
            let blockSize = block.size;
            this.blocks[blockIndex] = new WhiteBlock(topLeft, blockSize);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }

        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].draw();
        }
    }
}