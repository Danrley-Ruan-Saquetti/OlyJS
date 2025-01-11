import { GameObject } from '../../entities/index.js'
import { CanvasRenderer } from '../../utils/canvas-renderer.js'
import { RectangleShapeComponent } from '../shapes/rectangle.shape.js'
import { SpriteComponent } from './sprite.js'

export class RectangleSpriteComponent extends SpriteComponent {

  constructor(
    gameObject: GameObject,
    private _shape: RectangleShapeComponent
  ) {
    super(gameObject)
  }

  render(canvasRenderer: CanvasRenderer) {
    canvasRenderer.ctx.beginPath()
    canvasRenderer.ctx.rect(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this._shape.width,
      this._shape.height
    )
    canvasRenderer.ctx.fill()
  }
}