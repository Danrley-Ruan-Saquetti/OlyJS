import { CameraGameObject } from '../entities/index.js'
import { ContextRender2D, IRectangle, IVector2 } from '../interfaces/index.js'

export class CanvasRenderer {

  constructor(
    public readonly ctx: ContextRender2D,
    private readonly cameraGameObject: CameraGameObject
  ) { }

  drawRectangle({ x, y, height, width, color }: IVector2 & IRectangle & { color?: string }) {
    this.ctx.save()
    this.ctx.beginPath()

    this.applyViewCamera()

    this.ctx.rect(x, y, width, height)
    if (color) this.ctx.fillStyle = color
    this.ctx.fill()
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