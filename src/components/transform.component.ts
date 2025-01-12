import { IVector3 } from '../interfaces/index.js'
import { Quaternion, Vector3 } from '../utils/index.js'
import { GameComponent } from './component.js'

export class TransformComponent extends GameComponent {

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
    const vector = new Vector3(x, y, z)
    vector.normalize()

    return vector
  }
}