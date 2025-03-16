import { IVector3 } from '../interfaces/index.js'

export class Quaternion {

  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
    public w = 0
  ) { }

  normalize() {
    let magnitude = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2)

    if (magnitude === 0) return new Quaternion(0, 0, 0, 1)

    return new Quaternion(this.x / magnitude, this.y / magnitude, this.z / magnitude, this.w / magnitude)
  }

  multiply(q: Quaternion) {
    return new Quaternion(
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
    )
  }

  static fromEuler(pitch: number, yaw: number, roll: number) {
    let cy = Math.cos(yaw * 0.5)
    let sy = Math.sin(yaw * 0.5)
    let cp = Math.cos(pitch * 0.5)
    let sp = Math.sin(pitch * 0.5)
    let cr = Math.cos(roll * 0.5)
    let sr = Math.sin(roll * 0.5)

    return new Quaternion(
      sr * cp * cy - cr * sp * sy,
      cr * sp * cy + sr * cp * sy,
      cr * cp * sy - sr * sp * cy,
      cr * cp * cy + sr * sp * sy
    ).normalize()
  }

  static angleAxis(angle: number, axis: IVector3) {
    let halfAngle = angle * 0.5
    let s = Math.sin(halfAngle)

    return new Quaternion(
      axis.x * s,
      axis.y * s,
      axis.z * s,
      Math.cos(halfAngle)
    ).normalize()
  }

  static lerp(q1: Quaternion, q2: Quaternion, delta: number) {
    delta = Math.max(0, Math.min(1, delta))

    return new Quaternion(
      q1.x + (q2.x - q1.x) * delta,
      q1.y + (q2.y - q1.y) * delta,
      q1.z + (q2.z - q1.z) * delta,
      q1.w + (q2.w - q1.w) * delta
    ).normalize()
  }

  static slerp(q1: Quaternion, q2: Quaternion, t: number) {
    t = Math.max(0, Math.min(1, t))

    let dot = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w
    if (dot < 0) {
      q2 = new Quaternion(-q2.x, -q2.y, -q2.z, -q2.w)
      dot = -dot
    }

    if (dot > 0.9995) return Quaternion.lerp(q1, q2, t)

    let theta0 = Math.acos(dot)
    let theta = theta0 * t

    let sinTheta = Math.sin(theta)
    let sinTheta0 = Math.sin(theta0)

    let s0 = Math.cos(theta) - dot * sinTheta / sinTheta0
    let s1 = sinTheta / sinTheta0

    return new Quaternion(
      s0 * q1.x + s1 * q2.x,
      s0 * q1.y + s1 * q2.y,
      s0 * q1.z + s1 * q2.z,
      s0 * q1.w + s1 * q2.w
    ).normalize()
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2)
  }

  toEuler() {
    let sinrCosp = 2 * (this.w * this.x + this.y * this.z)
    let cosrCosp = 1 - 2 * (this.x * this.x + this.y * this.y)
    let roll = Math.atan2(sinrCosp, cosrCosp)

    let sinp = 2 * (this.w * this.y - this.z * this.x)
    let pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp)

    let sinyCosp = 2 * (this.w * this.z + this.x * this.y)
    let cosyCosp = 1 - 2 * (this.y * this.y + this.z * this.z)
    let yaw = Math.atan2(sinyCosp, cosyCosp)

    return { pitch, yaw, roll }
  }
}
