import { GameObject } from '../../entities/index.js'
import { CanvasRenderer } from '../../utils/index.js'
import { CircleShapeComponent } from '../shapes/index.js'
import { SpriteComponent } from './sprite.js'

export class CircleSpriteComponent extends SpriteComponent {

  constructor(
    gameObject: GameObject,
    private _shape: CircleShapeComponent
  ) {
    super(gameObject)
  }

  render(canvasRenderer: CanvasRenderer) {

  }
}