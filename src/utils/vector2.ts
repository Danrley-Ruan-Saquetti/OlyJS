import { IVector2 } from '../interfaces/index.js'

export class Vector2 implements IVector2 {

  constructor(
    public x = 0, public y = 0
  ) { }

  magnitude() {
    return Math.sqrt(this.x ^ 2 + this.y ^ 2)
  }

  normalize() {
    const magnitude = this.magnitude()

    let x = 0, y = 0

    if (magnitude != 0) {
      x = this.x / magnitude
      y = this.y / magnitude
    }

    this.x = x
    this.y = y
  }

  toJSON(): IVector2 {
    return {
      x: this.x,
      y: this.y,
    }
  }
}