class CollisionManifold {
    constructor(depth, normal, penetrationPoint) {
        this.depth = depth;
        this.normal = normal;
        this.penetrationPoint = penetrationPoint;
        this.rigidA = null;
        this.rigidB = null;
    }

    resolveCollision() {
        if (this.rigidA.isKinematic && this.rigidB.isKinematic) {
            return;
        }

        let penetrationToCentroidA = Sub(this.penetrationPoint, this.rigidA.shape.centroid);
        let penetrationToCentroidB = Sub(this.penetrationPoint, this.rigidB.shape.centroid);
        let angularVelocityPenetrationCentroidA = new Vector2(-1 * this.rigidA.angularVelocity * penetrationToCentroidA.y, this.rigidA.angularVelocity * penetrationToCentroidA.x);
        let angularVelocityPenetrationCentroidB = new Vector2(-1 * this.rigidB.angularVelocity * penetrationToCentroidB.y, this.rigidB.angularVelocity * penetrationToCentroidB.x);
        let velocityA = Add(this.rigidA.velocity, angularVelocityPenetrationCentroidA);
        let velocityB = Add(this.rigidB.velocity, angularVelocityPenetrationCentroidB);

        let relativeVelocity = Sub(velocityB, velocityA);
        let relativeVelocityAlongNormal = relativeVelocity.Dot(this.normal);

        if (relativeVelocityAlongNormal > 0) {
            return;
        }

        let e = (2 * this.rigidA.material.restitution * this.rigidB.material.restitution) / (this.rigidA.material.restitution + this.rigidB.material.restitution);
        let pToCentroidCrossNormalA = penetrationToCentroidA.Cross(this.normal);
        let pToCentroidCrossNormalB = penetrationToCentroidB.Cross(this.normal);

        let invMassSum = this.rigidA.invMass + this.rigidB.invMass;
        let rigidAInvInertia = this.rigidA.invInertia;
        let rigidBInvInertia = this.rigidB.invInertia;
        let crossNSum = pToCentroidCrossNormalA ** 2 * rigidAInvInertia + pToCentroidCrossNormalB ** 2 * rigidBInvInertia;

        let j = -(1 + e) * relativeVelocityAlongNormal;
        j /= (invMassSum + crossNSum);

        let impulseVector = Scale(this.normal, j);
        let impulseVectorRigidA = Scale(impulseVector, this.rigidA.invMass * -1);
        let impulseVectorRigidB = Scale(impulseVector, this.rigidB.invMass);

        this.rigidA.velocity = Add(this.rigidA.velocity, impulseVectorRigidA);
        this.rigidB.velocity = Add(this.rigidB.velocity, impulseVectorRigidB);

        this.rigidA.angularVelocity -= pToCentroidCrossNormalA * j * rigidAInvInertia;
        this.rigidB.angularVelocity += pToCentroidCrossNormalB * j * rigidBInvInertia;

        // frictional impulse
        let velocityInNomalDirection = Scale(this.normal, relativeVelocity.Dot(this.normal));
        let tangent = Sub(relativeVelocity, velocityInNomalDirection);
        tangent = Scale(tangent, -1);
        let friction = (2 * this.rigidA.material.friction * this.rigidB.material.friction) / (this.rigidA.material.friction + this.rigidB.material.friction);
        
        if (tangent.x > 0.00001 || tangent.y > 0.00001) {
            tangent.Normalize();
            // DrawUtils.drawArrow(this.rigidA.shape.centroid, Add(this.rigidA.shape.centroid, Scale(tangent, 40)), "blue");
        }

        let pToCentroidCrossTangentA = penetrationToCentroidA.Cross(tangent);
        let pToCentroidCrossTangentB = penetrationToCentroidB.Cross(tangent);
        let crossSumTangent = pToCentroidCrossTangentA ** 2 * rigidAInvInertia + pToCentroidCrossTangentB ** 2 * rigidBInvInertia;
        let frictionalImpulse = -(1 + e) * relativeVelocity.Dot(tangent) * friction;
        frictionalImpulse /= (invMassSum + crossSumTangent);

        if (frictionalImpulse > j) {
            frictionalImpulse = j;
        }

        let frictionalImpulseVector = Scale(tangent, frictionalImpulse);
        this.rigidA.velocity = Sub(this.rigidA.velocity, Scale(frictionalImpulseVector, this.rigidA.invMass));
        this.rigidB.velocity = Add(this.rigidB.velocity, Scale(frictionalImpulseVector, this.rigidB.invMass));

        this.rigidA.angularVelocity -= pToCentroidCrossTangentA * frictionalImpulse * rigidAInvInertia;
        this.rigidB.angularVelocity += pToCentroidCrossTangentB * frictionalImpulse * rigidBInvInertia;
    }

    positionCorrection() {
        let correctionPercentage = 0.2;
        let amountToCorrect = this.depth / (this.rigidA.invMass + this.rigidB.invMass) * correctionPercentage;
        let correctionVector = Scale(this.normal, amountToCorrect);
        let rigidAMovement = Scale(correctionVector, this.rigidA.invMass * -1);
        let rigidBMovement = Scale(correctionVector, this.rigidB.invMass);

        if (!this.rigidA.isKinematic) {
            this.rigidA.getShape().move(rigidAMovement);
        }

        if (!this.rigidB.isKinematic) {
            this.rigidB.getShape().move(rigidBMovement);
        }
    }

    draw(ctx) {
        let startPoint = Add(this.penetrationPoint, Scale(this.normal, this.depth * -1));
        DrawUtils.drawArrow(startPoint, this.penetrationPoint, "blue");
        DrawUtils.drawPoint(this.penetrationPoint, 3, "gray");
    }
}