import { IVector3 } from '../interfaces/index.js'
import { Vector2 } from './vector2.js'

export class Vector3 extends Vector2 implements IVector3 {

  constructor(
    x = 0, y = 0, public z = 0
  ) {
    super(x, y)
  }

  magnitude() {
    return Math.sqrt(this.x ^ 2 + this.y ^ 2 + this.z ^ 2)
  }

  normalize() {
    const magnitude = this.magnitude()

    let x = 0, y = 0, z = 0

    if (magnitude != 0) {
      x = this.x / magnitude
      y = this.y / magnitude
      z = this.z / magnitude
    }

    this.x = x
    this.y = y
    this.z = z
  }

  toJSON(): IVector3 {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    }
  }
}