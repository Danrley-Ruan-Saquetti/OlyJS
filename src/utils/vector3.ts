import { IVector3 } from '../interfaces/index.js'
import { Vector2 } from './vector2.js'

export class Vector3 extends Vector2 implements IVector3 {

  static get zero() { return new Vector3(0, 0, 0) }
  static get one() { return new Vector3(1, 1, 1) }
  static get up() { return new Vector3(0, 1, 0) }
  static get down() { return new Vector3(0, -1, 0) }
  static get left() { return new Vector3(-1, 0, 0) }
  static get right() { return new Vector3(1, 0, 0) }
  static get forward() { return new Vector3(0, 0, 1) }
  static get back() { return new Vector3(0, 0, -1) }

  constructor(x = 0, y = 0, public z = 0) {
    super(x, y)
  }

  override magnitude() {
    return Vector3.magnitude(this)
  }

  override normalize() {
    return Vector3.normalize(this)
  }

  override normalizeSelf() {
    const mag = this.magnitude()

    if (mag > 0) {
      this.x /= mag
      this.y /= mag
      this.z /= mag
    }

    return this
  }

  override multiply(scalar: number) {
    return Vector3.multiply(this, scalar)
  }

  override multiplySelf(scalar: number) {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar

    return this
  }

  add({ x = 0, y = 0, z = 0 }: Partial<IVector3>) {
    return Vector3.add(this, { x, y, z })
  }

  addSelf({ x = 0, y = 0, z = 0 }: Partial<IVector3>) {
    this.x += x
    this.y += y
    this.z += z

    return this
  }

  subtract({ x = 0, y = 0, z = 0 }: Partial<IVector3>) {
    return Vector3.subtract(this, { x, y, z })
  }

  subtractSelf({ x = 0, y = 0, z = 0 }: Partial<IVector3>) {
    this.x -= x
    this.y -= y
    this.z -= z

    return this
  }

  override sqrt() {
    return Vector3.sqrt(this)
  }

  override clone() {
    return Vector3.from(this)
  }

  override toString() {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`
  }

  static from({ x = 0, y = 0, z = 0 }: Partial<IVector3>) {
    return new Vector3(x, y, z)
  }

  static equals(ref1: IVector3, ref2: IVector3) {
    return ref1.x === ref2.x && ref1.y === ref2.y && ref1.z === ref2.z
  }

  static add(ref1: IVector3, ref2: IVector3) {
    return new Vector3(
      ref1.x + ref2.x,
      ref1.y + ref2.y,
      ref1.z + ref2.z
    )
  }

  static subtract(ref1: IVector3, ref2: IVector3) {
    return new Vector3(
      ref1.x - ref2.x,
      ref1.y - ref2.y,
      ref1.z - ref2.z
    )
  }

  static multiply(vector: IVector3, scalar: number) {
    return new Vector3(
      vector.x * scalar,
      vector.y * scalar,
      vector.z * scalar
    )
  }

  static normalize(vector: IVector3) {
    const mag = Vector3.magnitude(vector)

    return mag > 0
      ? new Vector3(
        vector.x / mag,
        vector.y / mag,
        vector.z / mag
      )
      : Vector3.zero
  }

  static dot(ref1: IVector3, ref2: IVector3) {
    return ref1.x * ref2.x + ref1.y * ref2.y + ref1.z * ref2.z
  }

  static cross(ref1: IVector3, ref2: IVector3) {
    return new Vector3(
      ref1.y * ref2.z - ref1.z * ref2.y,
      ref1.z * ref2.x - ref1.x * ref2.z,
      ref1.x * ref2.y - ref1.y * ref2.x
    )
  }

  static sqrt(vector: IVector3) {
    return vector.x ** 2 + vector.y ** 2 + vector.z ** 2
  }

  static magnitude(vector: IVector3) {
    return Math.sqrt(Vector3.sqrt(vector))
  }

  static distance(ref1: IVector3, ref2: IVector3) {
    return Math.sqrt(
      (ref2.x - ref1.x) ** 2 +
      (ref2.y - ref1.y) ** 2 +
      (ref2.z - ref1.z) ** 2
    )
  }

  static angle(ref1: IVector3, ref2: IVector3) {
    const dot = Vector3.dot(Vector3.normalize(ref1), Vector3.normalize(ref2))

    return Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI)
  }

  static reflect(inDirection: IVector3, inNormal: IVector3) {
    const dot = Vector3.dot(inDirection, inNormal)

    return new Vector3(
      inDirection.x - 2 * dot * inNormal.x,
      inDirection.y - 2 * dot * inNormal.y,
      inDirection.z - 2 * dot * inNormal.z
    )
  }

  static clampMagnitude(vector: IVector3, maxLength: number) {
    const mag = Vector3.magnitude(vector)

    return mag > maxLength ? Vector3.normalize(vector).multiply(maxLength) : vector
  }
}
