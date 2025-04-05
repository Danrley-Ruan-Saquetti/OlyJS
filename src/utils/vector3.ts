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

  static diff(ref1: Vector3, ref2: Vector3) {
    return new Vector3(ref1.x - ref2.x, ref1.y - ref2.y, ref1.z - ref2.z)
  }

  static distance(ref1: Vector3, ref2: Vector3) {
    return Math.sqrt((ref2.x - ref1.x) ** 2 + (ref2.y - ref1.y) ** 2 + (ref2.z - ref1.z) ** 2)
  }

  static dot(ref1: Vector3, ref2: Vector3) {
    return ref1.x * ref2.x + ref1.y * ref2.y + ref1.z * ref2.z
  }

  static cross(ref1: Vector3, ref2: Vector3) {
    return new Vector3(
      ref1.y * ref2.z - ref1.z * ref2.y,
      ref1.z * ref2.x - ref1.x * ref2.z,
      ref1.x * ref2.y - ref1.y * ref2.x
    )
  }

  static lerp(ref1: Vector3, ref2: Vector3, t: number) {
    t = Math.max(0, Math.min(1, t))

    return new Vector3(
      ref1.x + (ref2.x - ref1.x) * t,
      ref1.y + (ref2.y - ref1.y) * t,
      ref1.z + (ref2.z - ref1.z) * t
    )
  }

  static moveTowards(ref1: Vector3, ref2: Vector3, maxDistanceDelta: number) {
    const diff = Vector3.diff(ref2, ref1)
    const dist = diff.magnitude()

    if (dist <= maxDistanceDelta || dist === 0) {
      return new Vector3(ref2.x, ref2.y, ref2.z)
    }

    return new Vector3(
      ref1.x + (diff.x / dist) * maxDistanceDelta,
      ref1.y + (diff.y / dist) * maxDistanceDelta,
      ref1.z + (diff.z / dist) * maxDistanceDelta
    )
  }

  static reflect(inDirection: Vector3, inNormal: Vector3) {
    const dot = Vector3.dot(inDirection, inNormal)

    return new Vector3(
      inDirection.x - 2 * dot * inNormal.x,
      inDirection.y - 2 * dot * inNormal.y,
      inDirection.z - 2 * dot * inNormal.z
    )
  }

  static angle(ref1: Vector3, ref2: Vector3) {
    const dot = Vector3.dot(ref1.normalized(), ref2.normalized())

    return Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI)
  }

  static project(vector: Vector3, onNormal: Vector3) {
    const scale = Vector3.dot(vector, onNormal) / onNormal.sqrMagnitude()

    return new Vector3(onNormal.x * scale, onNormal.y * scale, onNormal.z * scale)
  }

  static projectOnPlane(vector: Vector3, planeNormal: Vector3) {
    return Vector3.diff(vector, Vector3.project(vector, planeNormal))
  }

  static clampMagnitude(vector: Vector3, maxLength: number) {
    const magnitude = vector.magnitude()

    if (magnitude > maxLength) {
      return vector.normalized().multiply(maxLength)
    }

    return vector
  }

  translate({ x = 0, y = 0, z = 0 }: Partial<IVector3>) {
    this.x += x
    this.y += y
    this.z += z
  }

  move({ x, y, z }: IVector3) {
    this.x = x
    this.y = y
    this.z = z
  }

  normalized() {
    const magnitude = this.magnitude()

    return magnitude > 0 ? new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude) : Vector3.zero
  }

  magnitude() {
    return Math.sqrt(this.sqrMagnitude())
  }

  sqrMagnitude() {
    return this.x ** 2 + this.y ** 2 + this.z ** 2
  }

  multiply(scalar: number) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  toString() {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`
  }
}
