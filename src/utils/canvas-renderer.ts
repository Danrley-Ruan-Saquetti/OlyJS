import { CameraGameObject } from '../entities/index.js'
import { ContextRender2D, ICircle, IRectangle, IVector2 } from '../interfaces/index.js'

export type DrawOptions = IVector2 & {
  color?: string
}
export type DrawStrokeOptions = {
  stroke?: string
  strokeWidth?: number
} | {
  stroke: string
  strokeWidth: number
}

export class CanvasRenderer {

  constructor(
    public readonly ctx: ContextRender2D,
    private readonly cameraGameObject: CameraGameObject
  ) { }

  drawRectangle({ x, y, height, width, color }: IRectangle & DrawOptions) {
    this.ctx.save()
    this.ctx.beginPath()

    this.applyViewCamera()

    this.ctx.rect(x, y, width, height)
    if (color) this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.restore()
  }

  drawCircle({ radius, x, y, color, stroke, strokeWidth }: ICircle & DrawOptions & DrawStrokeOptions) {
    this.ctx.save()
    this.ctx.beginPath()

    this.applyViewCamera()

    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false)

    if (color) {
      this.ctx.fillStyle = color
      this.ctx.fill()
    }

    if (stroke) {
      this.ctx.lineWidth = strokeWidth!
      this.ctx.strokeStyle = stroke
      this.ctx.stroke()
    }

    this.ctx.restore()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  applyViewCamera() {
    this.ctx.translate(
      this.cameraGameObject.transform.position.x,
      this.cameraGameObject.transform.position.y
    )
    this.ctx.scale(this.cameraGameObject.scale, this.cameraGameObject.scale)
  }
}