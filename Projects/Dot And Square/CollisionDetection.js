class CollisionDetection {
    static checkCollision(circle, square) {
        let collisionManifold = null;

        if (circle instanceof WhiteDot && square instanceof WhiteBlock) {
            collisionManifold = this.circleVsSquare(circle, square);
        } else if (circle instanceof BlackDot && square instanceof BlackBlock) {
            collisionManifold = this.circleVsSquare(circle, square);
        }

        if (collisionManifold != null) {
            collisionManifold.shapeA = circle;
            collisionManifold.shapeB = square;
        }

        return collisionManifold;
    }

    static circleVsSquare(circle, square) {
        let closestX = MathHelper.max(square.topLeft.x, MathHelper.min(circle.position.x, square.topLeft.x + square.size));
        let closestY = MathHelper.max(square.topLeft.y, MathHelper.min(circle.position.y, square.topLeft.y + square.size));
        let penetrationPoint = new Vector2(closestX, closestY);
        let penetrationVector = circle.position.sub(penetrationPoint)
        let penetrationNormal = penetrationVector.normalize();
        let penetrationDepth = penetrationVector.mag() - circle.radius;

        if (penetrationDepth < 0) {
            return new CollisionManifold(penetrationDepth, penetrationNormal);
        }
    }
}