import { GameObject } from '../../entities/index.js'
import { CanvasRenderer } from '../../utils/index.js'
import { RectangleShapeComponent } from '../shapes/index.js'
import { SpriteComponent } from './sprite.js'

export class RectangleSpriteComponent extends SpriteComponent {

  get shape() { return this._shape }

  constructor(
    gameObject: GameObject,
    private _shape: RectangleShapeComponent
  ) {
    super(gameObject)
  }

  render(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawRectangle({
      x: this.gameObject.transform.position.x,
      y: this.gameObject.transform.position.y,
      width: this._shape.width,
      height: this._shape.height,
      color: this.color,
      fixed: this.fixed,
    })
  }
}