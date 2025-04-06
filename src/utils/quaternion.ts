import { IEuler, IVector3, IVector4 } from '../interfaces/index.js'

export class Quaternion implements IVector4 {

  static get identity() { return new Quaternion(0, 0, 0, 1) }
  static get zero() { return new Quaternion(0, 0, 0, 0) }

  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
    public w = 1
  ) { }

  normalize() {
    return Quaternion.normalize(this)
  }

  normalizeSelf() {
    const mag = this.magnitude()

    if (mag === 0) return this.set(0, 0, 0, 1)

    return this.divideSelf(mag)
  }

  multiply(other: Quaternion) {
    return Quaternion.multiply(this, other)
  }

  multiplySelf(other: Quaternion) {
    const { x, y, z, w } = Quaternion.multiply(this, other)

    return this.set(x, y, z, w)
  }

  magnitude() {
    return Quaternion.magnitude(this)
  }

  toEuler() {
    return Quaternion.toEuler(this)
  }

  set(x: number, y: number, z: number, w: number) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w

    return this
  }

  divideSelf(scalar: number) {
    this.x /= scalar
    this.y /= scalar
    this.z /= scalar
    this.w /= scalar

    return this
  }

  equals(other: IVector4) {
    return Quaternion.equals(this, other)
  }

  clone() {
    return Quaternion.from(this)
  }

  toString() {
    return `Quaternion(${this.x}, ${this.y}, ${this.z}, ${this.w})`
  }

  static from({ x = 0, y = 0, z = 0, w = 1 }: Partial<IVector4>) {
    return new Quaternion(x, y, z, w)
  }

  static equals(ref1: IVector4, ref2: IVector4) {
    return ref1.x === ref2.x && ref1.y === ref2.y && ref1.z === ref2.z && ref1.w === ref2.w
  }

  static normalize(quaternion: IVector4) {
    const mag = Quaternion.magnitude(quaternion)

    if (mag === 0) return new Quaternion(0, 0, 0, 1)

    return new Quaternion(
      quaternion.x / mag,
      quaternion.y / mag,
      quaternion.z / mag,
      quaternion.w / mag
    )
  }

  static magnitude(quaternion: IVector4) {
    return Math.sqrt(Quaternion.sqrt(quaternion))
  }

  static dot(ref1: IVector4, ref2: IVector4) {
    return ref1.x * ref2.x + ref1.y * ref2.y + ref1.z * ref2.z + ref1.w * ref2.w
  }

  static multiply(ref1: IVector4, ref2: IVector4) {
    return new Quaternion(
      ref1.w * ref2.x + ref1.x * ref2.w + ref1.y * ref2.z - ref1.z * ref2.y,
      ref1.w * ref2.y - ref1.x * ref2.z + ref1.y * ref2.w + ref1.z * ref2.x,
      ref1.w * ref2.z + ref1.x * ref2.y - ref1.y * ref2.x + ref1.z * ref2.w,
      ref1.w * ref2.w - ref1.x * ref2.x - ref1.y * ref2.y - ref1.z * ref2.z
    )
  }

  static fromEuler({ pitch, roll, yaw }: IEuler) {
    const cy = Math.cos(yaw * 0.5)
    const sy = Math.sin(yaw * 0.5)
    const cp = Math.cos(pitch * 0.5)
    const sp = Math.sin(pitch * 0.5)
    const cr = Math.cos(roll * 0.5)
    const sr = Math.sin(roll * 0.5)

    return new Quaternion(
      sr * cp * cy - cr * sp * sy,
      cr * sp * cy + sr * cp * sy,
      cr * cp * sy - sr * sp * cy,
      cr * cp * cy + sr * sp * sy
    ).normalize()
  }

  static angleAxis(angle: number, axis: IVector3) {
    const half = angle * 0.5
    const s = Math.sin(half)

    return new Quaternion(
      axis.x * s,
      axis.y * s,
      axis.z * s,
      Math.cos(half)
    ).normalize()
  }

  static lerp(ref1: IVector4, ref2: IVector4, delta: number) {
    delta = Math.max(0, Math.min(1, delta))

    return Quaternion.normalize(new Quaternion(
      ref1.x + (ref2.x - ref1.x) * delta,
      ref1.y + (ref2.y - ref1.y) * delta,
      ref1.z + (ref2.z - ref1.z) * delta,
      ref1.w + (ref2.w - ref1.w) * delta
    ))
  }

  static slerp(ref1: IVector4, ref2: IVector4, delta: number) {
    delta = Math.max(0, Math.min(1, delta))

    let dot = Quaternion.dot(ref1, ref2)

    if (dot < 0) {
      ref2 = new Quaternion(-ref2.x, -ref2.y, -ref2.z, -ref2.w)
      dot = -dot
    }

    if (dot > 0.9995) return Quaternion.lerp(ref1, ref2, delta)

    const theta0 = Math.acos(dot)
    const theta = theta0 * delta

    const sinTheta = Math.sin(theta)
    const sinTheta0 = Math.sin(theta0)

    const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0
    const s1 = sinTheta / sinTheta0

    return Quaternion.normalize(new Quaternion(
      s0 * ref1.x + s1 * ref2.x,
      s0 * ref1.y + s1 * ref2.y,
      s0 * ref1.z + s1 * ref2.z,
      s0 * ref1.w + s1 * ref2.w
    ))
  }

  static toEuler(quaternion: IVector4) {
    const sinr = 2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z)
    const cosr = 1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y)
    const roll = Math.atan2(sinr, cosr)

    const sinp = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x)
    const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp)

    const siny = 2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y)
    const cosy = 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z)
    const yaw = Math.atan2(siny, cosy)

    return { pitch, yaw, roll } as IEuler
  }

  static sqrt(quaternion: IVector4) {
    return quaternion.x ** 2 + quaternion.y ** 2 + quaternion.z ** 2 + quaternion.w ** 2
  }
}
