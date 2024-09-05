class CollisionManifold {
    constructor(depth, normal) {
        this.depth = depth;
        this.normal = normal;
        this.shapeA = null;
        this.shapeB = null;
    }

    positionCorrection() {
        let deltaPosition = this.normal.scale(this.depth);
        this.shapeA.position = this.shapeA.position.sub(deltaPosition);
    }

    resolveCollision() {
        if (Math.abs(this.normal.x) > Math.abs(this.normal.y)) {
            this.shapeA.velocity.x *= -1;
        } else {
            this.shapeA.velocity.y *= -1;
        }
    }
}