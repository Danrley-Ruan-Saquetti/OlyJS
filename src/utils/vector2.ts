import { IVector2 } from '../interfaces/index.js'

export class Vector2 implements IVector2 {

  static get zero() { return new Vector2(0, 0) }
  static get one() { return new Vector2(1, 1) }
  static get up() { return new Vector2(0, 1) }
  static get down() { return new Vector2(0, -1) }
  static get left() { return new Vector2(-1, 0) }
  static get right() { return new Vector2(1, 0) }

  constructor(public x = 0, public y = 0) { }

  static distance(ref1: Vector2, ref2: Vector2) {
    return Math.sqrt((ref2.x - ref1.x) ** 2 + (ref2.y - ref1.y) ** 2)
  }

  static diff(ref1: Vector2, ref2: Vector2) {
    return new Vector2(ref1.x - ref2.x, ref1.y - ref2.y)
  }

  static dot(ref1: Vector2, ref2: Vector2) {
    return ref1.x * ref2.x + ref1.y * ref2.y
  }

  static lerp(ref1: Vector2, ref2: Vector2, delta: number) {
    delta = Math.max(0, Math.min(1, delta))
    return new Vector2(ref1.x + (ref2.x - ref1.x) * delta, ref1.y + (ref2.y - ref1.y) * delta)
  }

  static moveTowards(ref1: Vector2, ref2: Vector2, maxDistanceDelta: number) {
    const diff = Vector2.diff(ref2, ref1)
    const dist = diff.magnitude()

    if (dist <= maxDistanceDelta || dist === 0) {
      return new Vector2(ref2.x, ref2.y)
    }

    return new Vector2(ref1.x + (diff.x / dist) * maxDistanceDelta, ref1.y + (diff.y / dist) * maxDistanceDelta)
  }

  static perpendicular(vector: Vector2) {
    return new Vector2(-vector.y, vector.x)
  }

  static reflect(inDirection: Vector2, inNormal: Vector2) {
    const dot = Vector2.dot(inDirection, inNormal)

    return new Vector2(
      inDirection.x - 2 * dot * inNormal.x,
      inDirection.y - 2 * dot * inNormal.y
    )
  }

  static signedAngle(a: Vector2, b: Vector2) {
    const angle = Vector2.angle(a, b)

    return (a.x * b.y - a.y * b.x) < 0 ? -angle : angle
  }

  static angle(a: Vector2, b: Vector2) {
    const dot = Vector2.dot(a.normalized(), b.normalized())

    return Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI)
  }

  static clampMagnitude(vector: Vector2, maxLength: number): Vector2 {
    const mag = vector.magnitude()

    return mag > maxLength ? vector.normalized().multiply(maxLength) : vector
  }

  translate({ x = 0, y = 0 }: Partial<IVector2>) {
    this.x += x
    this.y += y
  }

  move({ x, y }: IVector2) {
    this.x = x
    this.y = y
  }

  normalized() {
    const magnitude = this.magnitude()

    return magnitude > 0 ? new Vector2(this.x / magnitude, this.y / magnitude) : Vector2.zero
  }

  magnitude() {
    return Math.sqrt(this.sqrMagnitude())
  }

  sqrMagnitude() {
    return this.x ** 2 + this.y ** 2
  }

  multiply(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  toString() {
    return `Vector2(${this.x}, ${this.y})`
  }
}
