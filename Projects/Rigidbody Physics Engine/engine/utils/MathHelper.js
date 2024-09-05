class MathHelper {
    static calcCentroid(vertices) {
        let A = this.calcArea(vertices);
        let length = vertices.length;
        let cx = 0;
        let cy = 0;

        for (let i = 0; i < length; i++) {
            let i_next = this.Index(i + 1, length);

            let firstTremOfCx = vertices[i].x + vertices[i_next].x;
            let secondTremOfCx =  vertices[i].x * vertices[i_next].y - vertices[i_next].x * vertices[i].y;
            cx += firstTremOfCx * secondTremOfCx;

            let firstTremOfCy = vertices[i].y + vertices[i_next].y;
            let secondTremOfCy =  vertices[i].x * vertices[i_next].y - vertices[i_next].x * vertices[i].y;
            cy += firstTremOfCy * secondTremOfCy;
        }
        cx /= (6 * A);
        cy /= (6 * A);
        return new Vector2(cx, cy);
    }

    static calcArea(vertices) {
        let A = 0;
        let length = vertices.length;

        for (let i = 0; i < length; i++) {
            let i_next = this.Index(i + 1, length);
            A += vertices[i].x * vertices[i_next].y - vertices[i_next].x * vertices[i].y;
        }
        return A / 2;
    }

    static Index(idx, arraySize) {
        return (idx + arraySize) % arraySize;
    }

    static clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }

    static rotateAroundPoint(toRotateVertices, point, radians) {
        let rotated = new Vector2(0, 0);
        let direction = Sub(toRotateVertices, point);
        rotated.x = direction.x * Math.cos(radians) - direction.y * Math.sin(radians);
        rotated.y = direction.x * Math.sin(radians) + direction.y * Math.cos(radians);
        rotated.Add(point);
        return rotated;
    }

    static calcNormals(vertices) {
        let normals = [];
        for (let i = 0; i < vertices.length; i++) {
            let direction = Sub(vertices[this.Index(i + 1, vertices.length)], vertices[i]);
            direction.Normalize();
            let normal = direction.GetNormal();
            normals.push(normal);
        }
        return normals;
    }
}