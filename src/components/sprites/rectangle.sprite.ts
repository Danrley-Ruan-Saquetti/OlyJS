import { GameObject } from '../../entities/index.js'
import { CanvasRenderer } from '../../utils/index.js'
import { RectangleShapeComponent } from '../shapes/index.js'
import { SpriteComponent } from './sprite.js'

export class RectangleSpriteComponent extends SpriteComponent {

  get shape() { return this._shape }

  stroke?: string
  strokeWidth = 5

  constructor(
    gameObject: GameObject,
    private _shape: RectangleShapeComponent
  ) {
    super(gameObject)
  }

  render(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawRectangle({
      x: this.gameObject.transform.position.x - (this._shape.width / 2) + this.offset.x,
      y: this.gameObject.transform.position.y - (this._shape.height / 2) + this.offset.y,
      width: this._shape.width,
      height: this._shape.height,
      color: this.color,
      fixed: this.fixed,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    })
  }
}
