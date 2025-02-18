import { IVector2 } from '../interfaces/index.js'

export class Vector2 implements IVector2 {

  constructor(
    public x = 0, public y = 0
  ) { }

  static subtraction(vector1: IVector2, vector2: IVector2) {
    return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y)
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
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

    return this
  }

  clone() {
    return new Vector2(this.x, this.y)
  }

  equals({ x, y }: IVector2) {
    return this.x == x && this.y == y
  }

  toJSON(): IVector2 {
    return {
      x: this.x,
      y: this.y,
    }
  }
}
