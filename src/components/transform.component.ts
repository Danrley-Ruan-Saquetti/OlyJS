import { IVector3 } from '../interfaces/index.js'
import { Quaternion, Vector3 } from '../utils/index.js'
import { GameComponent } from './component.js'

export class TransformComponent extends GameComponent {

  readonly position = new Vector3()
  readonly rotation = new Quaternion()

  moveTo({ x = this.position.x, y = this.position.y, z = this.position.z }: Partial<IVector3>) {
    this.position.x = x
    this.position.y = y
    this.position.z = z
  }

  translate({ x = 0, y = 0, z = 0 }: Partial<IVector3>) {
    this.position.x += x
    this.position.y += y
    this.position.z += z
  }
}
