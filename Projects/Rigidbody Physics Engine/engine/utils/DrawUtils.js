class DrawUtils {
    static drawPoint(position, radius, color) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    static strokePoint(position, radius, color) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    static drawLine(startPosition, endPosition, color) {
        ctx.beginPath();
        ctx.moveTo(startPosition.x, startPosition.y);
        ctx.lineTo(endPosition.x, endPosition.y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    static drawRect(start, size, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.rect(start.x, start.y, size.x, size.y);
        ctx.stroke();
        ctx.closePath();
    }

    static drawText(position, size, color, text) {
        ctx.font = size + "px Arial";
        ctx.fillStyle = color;
        ctx.fillText(text, position.x, position.y);
    }

    static drawArrow(startPosition, arrowHeadPosition, color) {
        this.drawLine(startPosition, arrowHeadPosition, color);

        let direction = Sub(arrowHeadPosition, startPosition);
        direction.Normalize();
        let arrowHeadCenter = Sub(arrowHeadPosition, Scale(direction, 10));
        // this.drawPoint(arrowHeadCenter, 5, "red");

        let directionToLeftArrowHead = direction.GetNormal();
        let leftArrowPosition = Add(arrowHeadCenter, Scale(directionToLeftArrowHead, 5));
        // this.drawPoint(leftArrowPosition, 5, "green");
        this.drawLine(leftArrowPosition, arrowHeadPosition, color);

        let directionToRightArrowHead = Scale(direction.GetNormal(), -1);
        let rightArrowPosition = Add(arrowHeadCenter, Scale(directionToRightArrowHead, 5));
        // this.drawPoint(leftArrowPosition, 5, "green");
        this.drawLine(rightArrowPosition, arrowHeadPosition, color);
    }
}