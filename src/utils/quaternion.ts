import { Vector3 } from './vector3.js'

export class Quaternion extends Vector3 {

  constructor(
    x = 0, y = 0, z = 0, public w = 0
  ) {
    super(x, y, z)
  }
}