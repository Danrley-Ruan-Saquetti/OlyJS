import { GameObject } from '../../entities/index.js'
import { CanvasRenderer } from '../../utils/index.js'
import { CircleShapeComponent } from '../shapes/index.js'
import { SpriteComponent } from './sprite.js'

export class CircleSpriteComponent extends SpriteComponent {

  get shape() { return this._shape }

  constructor(
    gameObject: GameObject,
    private _shape: CircleShapeComponent,
    public stroke?: string,
    public strokeWidth?: number
  ) {
    super(gameObject)
  }

  render(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawCircle({
      radius: this._shape.radius,
      x: this.gameObject.transform.position.x + this.offset.x,
      y: this.gameObject.transform.position.y + this.offset.y,
      color: this.color,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      fixed: this.fixed,
    })
  }
}
