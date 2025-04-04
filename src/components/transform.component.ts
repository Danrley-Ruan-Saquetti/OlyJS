import { Vector2 } from '../utils/index.js'
import { GameComponent } from './game-component.js'

export class Transform extends GameComponent {

  position = Vector2.zero
  scale = Vector2.one
}
