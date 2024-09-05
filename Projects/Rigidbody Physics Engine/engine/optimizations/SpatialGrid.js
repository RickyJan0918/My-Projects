class SpatialGrid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.cells = [];
        this.rigidBodiesToCells = [];
    }

    initialize(worldSize, rigidBodies) {
        this.worldSize = worldSize;
        this.rigidBodies = rigidBodies;

        this.cellCountsX = parseInt(this.worldSize.x / this.cellSize);
        this.cellCountsY = parseInt(this.worldSize.y / this.cellSize);

        if (this.cellSize * this.cellCountsX < this.worldSize.x) {
            this.cellCountsX++
        }

        if (this.cellSize * this.cellCountsY < this.worldSize.y) {
            this.cellCountsY++
        }

        for (let i = 0; i < this.cellCountsX * this.cellCountsY; i++) {
            this.cells[i] = [];
        }
    }

    refreshGrid() {
        this.clearGrid();
        this.mapBodiesToCell();
    }

    mapBodiesToCell() {
        for (let i = 0; i < this.rigidBodies.length; i++) {
            let boundingBox = this.rigidBodies[i].getShape().boundingBox;
            let left = boundingBox.topLeft.x;
            let right = boundingBox.bottomRight.x;
            let top = boundingBox.topLeft.y;
            let bottom = boundingBox.bottomRight.y;

            let leftCellIdx = MathHelper.clamp(parseInt(left / this.cellSize), 0, this.cellCountsX - 1);
            let rightCellIdx = MathHelper.clamp(parseInt(right / this.cellSize), 0, this.cellCountsX - 1);
            let topCellIdx = MathHelper.clamp(parseInt(top / this.cellSize), 0, this.cellCountsY - 1);
            let bottomCellIdx = MathHelper.clamp(parseInt(bottom / this.cellSize), 0, this.cellCountsY - 1);

            for (let x = leftCellIdx; x <= rightCellIdx; x++) {
                for (let y = topCellIdx; y <= bottomCellIdx; y++) {
                    let cellIdx = x + y * this.cellCountsX;
                    this.cells[cellIdx].push(this.rigidBodies[i]);
                    this.rigidBodiesToCells[i].push(cellIdx);
                    let position = new Vector2(x * this.cellSize + 5, y * this.cellSize + 5);
                    // DrawUtils.drawRect(position, new Vector2(this.cellSize - 5, this.cellSize - 5), "black");
                }
            }
        }
    }

    clearGrid() {
        for (let i = 0; i < this.cellCountsX * this.cellCountsY; i++) {
            this.cells[i] = [];
        }
        this.rigidBodiesToCells = []
        for (let i = 0; i < this.rigidBodies.length; i++) {
            this.rigidBodiesToCells[i] = [];
        }
    }

    getNeighbourRigis(rigidIndex, rigidBody) {
        let occupiedCells = this.rigidBodiesToCells[rigidIndex];
        let neighbourRigidBodies = [];
    
        for (let i = 0; i < occupiedCells.length; i++) {
            let occupiedIdx = occupiedCells[i];
            let cell = this.cells[occupiedIdx];
            for (let j = 0; j < cell.length; j++) {
                let rigidInCell = cell[j];
                if (rigidBody !== rigidInCell) {
                    neighbourRigidBodies.push(rigidInCell);
                }
            }
        }
    
        return neighbourRigidBodies;
    }

    draw() {
        for (let x = 0; x < this.cellCountsX; x++) {
            for (let y = 0; y < this.cellCountsY; y++) {
                let position = new Vector2(x * this.cellSize + 5, y * this.cellSize + 5);
                // DrawUtils.drawRect(position, new Vector2(this.cellSize - 5, this.cellSize - 5), "gray");
            }
        }
    }
}