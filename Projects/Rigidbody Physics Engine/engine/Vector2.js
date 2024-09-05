class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Normalize() {
        length = this.Length();
        this.x /= length;
        this.y /= length;
    }

    Length2() {
        return this.x ** 2 + this.y ** 2;
    }

    Length() {
        return Math.sqrt(this.Length2());
    }

    GetNormal() {
        return new Vector2(this.y, -this.x)
    }

    Dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    Cpy() {
        return new Vector2(this.x, this.y);
    }

    Add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    Sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    
    Scale(scaler) {
        this.x *= scaler;
        this.y *= scaler;
    }

    Cross(vec) {
        return this.x * vec.y - this.y * vec.x;
    }
}

function Add(vecA, vecB) {
    return new Vector2(vecA.x + vecB.x, vecA.y + vecB.y);
}

function Sub(vecA, vecB) {
    return new Vector2(vecA.x - vecB.x, vecA.y - vecB.y);
}

function Scale(vecA, scale) {
    return new Vector2(vecA.x * scale, vecA.y * scale);
}