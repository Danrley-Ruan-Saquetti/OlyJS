import { IVector2 } from '../interfaces/index.js'
import { Vector2 } from './vector2.js'

export class MathHelper {

  static angle(pointA: IVector2, pointB: IVector2) {
    return Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x)
  }

  static distance(pointA: IVector2, pointB: IVector2) {
    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2))
  }

  static angleToVector2(angle: number, distance: number) {
    return new Vector2(
      Math.cos(angle) * distance,
      Math.sin(angle) * distance
    )
  }
}
