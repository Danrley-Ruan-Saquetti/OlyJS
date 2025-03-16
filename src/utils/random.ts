import { IRGB } from '../interfaces/index.js'
import { Quaternion } from './quaternion.js'
import { Vector2 } from './vector2.js'
import { Vector3 } from './vector3.js'

export class Random {

  static range(min: number, max: number) {
    return Random.next() * (max - min) + min
  }

  static next() {
    return Math.random()
  }

  static onUnitSphere() {
    return this.insideUnitSphere().normalized()
  }

  static insideUnitSphere() {
    let vector: Vector3
    let magnitude = 0

    do {
      vector = new Vector3(
        this.range(-1, 1),
        this.range(-1, 1),
        this.range(-1, 1)
      )

      magnitude = vector.magnitude()
    } while (magnitude > 1 || magnitude === 0)

    return vector
  }

  static insideUnitCircle() {
    let vector: Vector2
    let magnitude = 0

    do {
      vector = new Vector2(
        this.range(-1, 1),
        this.range(-1, 1)
      )

      magnitude = vector.magnitude()
    } while (magnitude > 1 || magnitude === 0)

    return vector
  }

  static rotation() {
    let u1 = Math.random()
    let u2 = Math.random()
    let u3 = Math.random()

    let sqrt1MinusU1 = Math.sqrt(1 - u1)
    let sqrtU1 = Math.sqrt(u1)

    return new Quaternion(
      sqrt1MinusU1 * Math.sin(2 * Math.PI * u2),
      sqrt1MinusU1 * Math.cos(2 * Math.PI * u2),
      sqrtU1 * Math.sin(2 * Math.PI * u3),
      sqrtU1 * Math.cos(2 * Math.PI * u3)
    )
  }

  static colorHSV(
    minHue = 0,
    maxHue = 1,
    minSaturation = 0,
    maxSaturation = 1,
    minValue = 0,
    maxValue = 1
  ) {
    let h = this.range(minHue, maxHue)
    let s = this.range(minSaturation, maxSaturation)
    let v = this.range(minValue, maxValue)

    let c = v * s
    let x = c * (1 - Math.abs((h * 6) % 2 - 1))
    let m = v - c

    const rgb: IRGB = { r: 0, g: 0, b: 0 }

    if (h < 1 / 6) {
      rgb.r = c
      rgb.g = x
    }
    else if (h < 2 / 6) {
      rgb.r = x
      rgb.g = c
    }
    else if (h < 3 / 6) {
      rgb.g = c
      rgb.b = x
    }
    else if (h < 4 / 6) {
      rgb.g = x
      rgb.b = c
    }
    else if (h < 5 / 6) {
      rgb.r = x
      rgb.b = c
    }
    else {
      rgb.r = c
      rgb.b = x
    }

    rgb.r += m
    rgb.g += m
    rgb.b += m

    return rgb
  }
}
