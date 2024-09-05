class Simulation {
    constructor(worldSize) {
        this.gravity = new Vector2(0, 100);
        this.rigidBodies = [];
        this.worldSize = worldSize;

        this.grid = new SpatialGrid(30);
        this.grid.initialize(this.worldSize, this.rigidBodies);

        this.createBoundry();

        // let rect = new Rectangle(new Vector2(500, 500), 800, 50);
        // rect.rotate(0.2);
        // this.rigidBodies.push(new RigidBody(rect));

        // this.rigidBodies.push(new RigidBody(new Rectangle(new Vector2(200, 0), 200, 100), 1));
        // this.rigidBodies.push(new RigidBody(new Circle(new Vector2(500, 300), 60), 1));
        // this.rigidBodies.push(new RigidBody(new Circle(new Vector2(600, 300), 30), 1));

        this.createStressTestPyramid();
    }

    createStressTestPyramid() {
        let boxSize = 20;
        let iterations = 30;
        let topOffest = this.worldSize.y - iterations * (boxSize - 1);

        for (let i = 0; i < iterations; i++) {
            for (let j = iterations; j >= iterations - i; j--) {
                let x = boxSize * i + j * boxSize / 2;
                let y = boxSize * j;
                this.rigidBodies.push(new RigidBody(new Circle(new Vector2(x, y + topOffest), boxSize / 2), 1));
            }
        }
    }

    createBoundry() {
        this.rigidBodies.push(new RigidBody(new Rectangle(new Vector2(this.worldSize.x / 2, -50), this.worldSize.x, 100), 0));
        this.rigidBodies.push(new RigidBody(new Rectangle(new Vector2(this.worldSize.x / 2, this.worldSize.y + 50), this.worldSize.x, 100), 0));
        this.rigidBodies.push(new RigidBody(new Rectangle(new Vector2(-50, this.worldSize.y / 2), 100, this.worldSize.y), 0));
        this.rigidBodies.push(new RigidBody(new Rectangle(new Vector2(this.worldSize.x + 50, this.worldSize.y / 2), 100, this.worldSize.y), 0));
    }

    update(deltaTime) {
        for (let i = 0; i < this.rigidBodies.length; i++) {
            this.rigidBodies[i].addForce(this.gravity);
            this.rigidBodies[i].update(deltaTime);
            this.rigidBodies[i].getShape().boundingBox.isColliding = false;

            let gravitiationalForce = Scale(this.gravity, this.rigidBodies[i].mass);
            this.rigidBodies[i].addForce(gravitiationalForce);
        }

        this.grid.refreshGrid();

        for (let sovlerIteration = 0; sovlerIteration < 20; sovlerIteration++) {
            for (let i = 0; i < this.rigidBodies.length; i++) {
                let rigidA = this.rigidBodies[i];
                let neighbourRigidBodies = this.grid.getNeighbourRigis(i, rigidA);
                for (let j = 0; j < neighbourRigidBodies.length; j++) {
                    let rigidB = neighbourRigidBodies[j];

                    let isCollidingBoundingBox = rigidA.getShape().boundingBox.intersect(rigidB.getShape().boundingBox);
                    if (!isCollidingBoundingBox) continue;
                    rigidA.getShape().boundingBox.isColliding = isCollidingBoundingBox;
                    rigidB.getShape().boundingBox.isColliding = isCollidingBoundingBox;

                    let collisionManifold = CollisionDetection.checkCollisions(rigidA, rigidB);

                    if (collisionManifold != null) {
                        // collisionManifold.draw();
                        collisionManifold.positionCorrection();
                        collisionManifold.resolveCollision();
                    }

                }
            }
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rigidBodies.length; i++) {
            this.rigidBodies[i].getShape().draw(ctx);
        }
        this.grid.draw();
    }

    onKeyboardPressed(evt) {
        this.force = 5000;
        let length = this.rigidBodies.length;

        switch (evt.key) {
            case "w": this.rigidBodies[length - 2].addForce(new Vector2(0, -this.force)); break;
            case "a": this.rigidBodies[length - 2].addForce(new Vector2(-this.force, 0)); break;
            case "s": this.rigidBodies[length - 2].addForce(new Vector2(0, this.force)); break;
            case "d": this.rigidBodies[length - 2].addForce(new Vector2(this.force, 0)); break;

            case "ArrowUp": this.rigidBodies[length - 1].addForce(new Vector2(0, -this.force)); break;
            case "ArrowLeft": this.rigidBodies[length - 1].addForce(new Vector2(-this.force, 0)); break;
            case "ArrowDown": this.rigidBodies[length - 1].addForce(new Vector2(0, this.force)); break;
            case "ArrowRight": this.rigidBodies[length - 1].addForce(new Vector2(this.force, 0)); break;
        }
    }
}