import { Vector3 } from '../util/vector3.js'
import { GameComponent } from './game-component.js'

export class Transform extends GameComponent {

  position = new Vector3()
  scale = new Vector3()
}
