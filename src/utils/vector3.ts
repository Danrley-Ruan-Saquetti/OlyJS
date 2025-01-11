import { IVector3 } from '../interfaces/index.js'
import { Vector2 } from './vector2.js'

export class Vector3 extends Vector2 implements IVector3 {

  constructor(
    x = 0, y = 0, public z = 0
  ) {
    super(x, y)
  }
}