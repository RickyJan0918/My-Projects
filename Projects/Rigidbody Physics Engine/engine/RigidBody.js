class RigidBody {
    constructor (shape, mass) {
        this.shape = shape;
        this.isKinematic = false;

        if (mass > 0) {
            this.mass = mass;
            this.invMass = 1/ mass;
        } else {
            this.mass = 0;
            this.invMass = 0;
            this.isKinematic = true;
        }

        this.forceAccumulator = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.angularVelocity = 0;
        this.material = new Material();
        this.inertia = this.shape.calculateInertia(this.mass);

        if (this.inertia > 0.00001) {
            this.invInertia = 1.0 / this.inertia;
        } else {
            this.invInertia = 0;
        }
    }

    addForce(force) {
        this.forceAccumulator.Add(force);
    }

    addVelocity(velocity) {
        this.velocity.Add(velocity);
    }

    setVelocity(velocity) {
        this.velocity = velocity.Cpy();
    }

    getVelocity() {
        return this.velocity;
    }

    getAngularVelocity() {
        return this.angularVelocity;
    }

    update(deltaTime) {
        this.integrate(deltaTime);
        this.velocity.Scale(0.999);
        this.angularVelocity *= 0.999;
        this.forceAccumulator = new Vector2(0, 0);
    }

    integrate(deltaTime) {
        this.semiImplicitEuler();
        // this.rungeKutta4(deltaTime);
    }

    semiImplicitEuler() {
        let acceleration = Scale(this.forceAccumulator, this.invMass);
        this.velocity = Add(this.velocity, Scale(acceleration, deltaTime));
        let deltaPosition = Scale(this.velocity, deltaTime);
        this.shape.move(deltaPosition);

        let deltaRotation = this.angularVelocity * deltaTime;
        this.shape.rotate(deltaRotation);
    }

    rungeKutta4(deltaTime) {
        let k1, k2, k3, k4;
        const computeAcceleration = (force, invMass) => Scale(force, invMass);

        let acceleration = computeAcceleration(this.forceAccumulator, this.invMass);
        k1 = Scale(acceleration, deltaTime);

        let tempForce = Add(this.forceAccumulator, Scale(k1, 0.5));
        acceleration = computeAcceleration(tempForce, this.invMass);
        k2 = Scale(acceleration, deltaTime);

        tempForce = Add(this.forceAccumulator, Scale(k2, 0.5));
        acceleration = computeAcceleration(tempForce, this.invMass);
        k3 = Scale(acceleration, deltaTime);

        tempForce = Add(this.forceAccumulator, Scale(k3, 0.5));
        acceleration = computeAcceleration(tempForce, this.invMass);
        k4 = Scale(acceleration, deltaTime);

        let deltaVelocity = Scale(Add(Add(k1, Scale(k2, 2)), Add(Scale(k3, 2), k4)), 1 / 6.0);
        this.velocity.Add(deltaVelocity);

        let deltaPosition = Scale(this.velocity, deltaTime);
        this.shape.move(deltaPosition);

        // angular motion
        const computeRotationalAcceleration = (torque, invInertia) => torque * invInertia;
        let rotationalAcceleration = computeRotationalAcceleration(this.torqueAccumulator, this.invInertia);
        k1 = rotationalAcceleration * deltaTime;

        let tempTorque = this.torqueAccumulator + k1 * 0.5;
        rotationalAcceleration = computeRotationalAcceleration(tempTorque, this.invInertia);
        k2 = rotationalAcceleration * deltaTime;

        tempTorque = this.torqueAccumulator + k2 * 0.5;
        rotationalAcceleration = computeRotationalAcceleration(tempTorque, this.invInertia);
        k3 = rotationalAcceleration * deltaTime;

        tempTorque = this.torqueAccumulator + k3 * 0.5;
        rotationalAcceleration = computeRotationalAcceleration(tempTorque, this.invInertia);
        k4 = rotationalAcceleration * deltaTime;

        let deltaAngularVelocity = (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        this.angularVelocity += deltaAngularVelocity;

        let deltaRotation = this.angularVelocity * deltaTime;
        this.shape.rotate(deltaRotation);
    }

    getShape() {
        return this.shape;
    }
}