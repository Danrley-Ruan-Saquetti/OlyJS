import { IVector3 } from '../interfaces/index.js'
import { Quaternion, Vector3 } from '../utils/index.js'

export class TransformComponent {

  readonly position = new Vector3()
  readonly rotation = new Quaternion()

  moveTo({ x, y, z }: IVector3) {
    this.position.x = x
    this.position.y = y
    this.position.z = z
  }

  moveNormalized(vector: IVector3) {
    const vectorNormalized = this.normalize(vector)
    this.translate(vectorNormalized)
  }

  translate({ x, y, z }: IVector3) {
    this.position.x += x
    this.position.y += y
    this.position.z += z
  }

  private normalize({ x, y, z }: IVector3) {
    const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2)

    if (length === 0) {
      return { x: 0, y: 0, z: 0 }
    }

    return {
      x: x / length,
      y: y / length,
      z: z / length,
    }
  }
}