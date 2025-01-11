import { Quaternion, Vector3 } from '../utils/index.js'

export class TransformComponent {

  readonly position = new Vector3()
  readonly rotation = new Quaternion()
}