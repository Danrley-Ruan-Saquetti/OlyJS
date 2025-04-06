import { IVector2 } from '../interfaces/index.js'

export class Vector2 implements IVector2 {

  static get zero() { return new Vector2(0, 0) }
  static get one() { return new Vector2(1, 1) }
  static get up() { return new Vector2(0, 1) }
  static get down() { return new Vector2(0, -1) }
  static get left() { return new Vector2(-1, 0) }
  static get right() { return new Vector2(1, 0) }

  constructor(
    public x = 0,
    public y = 0
  ) { }

  add({ x = 0, y = 0 }: Partial<IVector2>) {
    return Vector2.add(this, { x, y })
  }

  addSelf({ x = 0, y = 0 }: Partial<IVector2>) {
    this.x += x
    this.y += y

    return this
  }

  subtract({ x = 0, y = 0 }: Partial<IVector2>) {
    return Vector2.subtract(this, { x, y })
  }

  subtractSelf({ x = 0, y = 0 }: Partial<IVector2>) {
    this.x -= x
    this.y -= y

    return this
  }

  multiply(scalar: number) {
    return Vector2.multiply(this, scalar)
  }

  multiplySelf(scalar: number) {
    this.x *= scalar
    this.y *= scalar

    return this
  }

  normalize() {
    return Vector2.normalize(this)
  }

  normalizeSelf() {
    const mag = this.magnitude()

    if (mag > 0) {
      this.x /= mag
      this.y /= mag
    }

    return this
  }

  magnitude() {
    return Vector2.magnitude(this)
  }

  perpendicular() {
    return Vector2.perpendicular(this)
  }

  perpendicularSelf() {
    const x = -this.y
    const y = this.x

    this.x = x
    this.y = y

    return this
  }

  sqrt() {
    return Vector2.sqrt(this)
  }

  clone() {
    return Vector2.from(this)
  }

  toString() {
    return `Vector2(${this.x}, ${this.y})`
  }

  static from({ x = 0, y = 0 }: Partial<IVector2>) {
    return new Vector2(x, y)
  }

  static equals(ref1: IVector2, ref2: IVector2) {
    return ref1.x == ref2.x && ref1.y == ref2.y
  }

  static multiply(vector: IVector2, scalar: number) {
    return new Vector2(
      vector.x * scalar,
      vector.y * scalar
    )
  }

  static normalize(vector: IVector2) {
    const mag = Vector2.magnitude(vector)

    return mag > 0 ? new Vector2(vector.x / mag, vector.y / mag) : Vector2.zero
  }

  static distance(ref1: IVector2, ref2: IVector2) {
    return Math.sqrt((ref2.x - ref1.x) ** 2 + (ref2.y - ref1.y) ** 2)
  }

  static lerp(ref1: IVector2, ref2: IVector2, delta: number) {
    delta = Math.max(0, Math.min(1, delta))

    return new Vector2(
      ref1.x + (ref2.x - ref1.x) * delta,
      ref1.y + (ref2.y - ref1.y) * delta
    )
  }

  static moveTowards(ref1: IVector2, ref2: IVector2, delta: number) {
    const diff = Vector2.subtract(ref2, ref1)
    const dist = diff.magnitude()

    if (dist <= delta || dist == 0) {
      return new Vector2(ref2.x, ref2.y)
    }

    return new Vector2(
      ref1.x + (diff.x / dist) * delta,
      ref1.y + (diff.y / dist) * delta
    )
  }

  static perpendicular(vector: IVector2) {
    return new Vector2(-vector.y, vector.x)
  }

  static reflect(inDirection: IVector2, inNormal: IVector2) {
    const dot = Vector2.dot(inDirection, inNormal)

    return new Vector2(
      inDirection.x - 2 * dot * inNormal.x,
      inDirection.y - 2 * dot * inNormal.y
    )
  }

  static clampMagnitude(vector: IVector2, maxLength: number) {
    const mag = Vector2.magnitude(vector)

    return mag > maxLength ? Vector2.normalize(vector).multiply(maxLength) : vector
  }

  static add(ref1: IVector2, ref2: IVector2) {
    return new Vector2(
      ref1.x + ref2.x,
      ref1.y + ref2.y,
    )
  }

  static subtract(ref1: IVector2, ref2: IVector2) {
    return new Vector2(
      ref1.x - ref2.x,
      ref1.y - ref2.y
    )
  }

  static signedAngle(ref1: IVector2, ref2: IVector2) {
    const angle = Vector2.angle(ref1, ref2)

    return (ref1.x * ref2.y - ref1.y * ref2.x) < 0 ? -angle : angle
  }

  static angle(ref1: IVector2, ref2: IVector2) {
    const dot = Vector2.dot(Vector2.normalize(ref1), Vector2.normalize(ref2))

    return Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI)
  }

  static dot(ref1: IVector2, ref2: IVector2) {
    return ref1.x * ref2.x + ref1.y * ref2.y
  }

  static sqrt(vector: IVector2) {
    return vector.x ** 2 + vector.y ** 2
  }

  static magnitude(vector: IVector2) {
    return Math.sqrt(Vector2.sqrt(vector))
  }
}
