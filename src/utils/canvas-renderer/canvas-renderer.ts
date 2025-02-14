import { CameraGameObject } from '../../entities/index.js'
import { ContextRender2D, ICircle, IRectangle } from '../../interfaces/index.js'
import { DrawImageFrameOptions, DrawImageOptions, DrawOptions, DrawStrokeOptions, DrawTextOptions } from './options.js'

export class CanvasRenderer {

  constructor(
    public readonly ctx: ContextRender2D,
    private readonly cameraGameObject?: CameraGameObject
  ) { }

  drawRectangle({ x, y, height, width, color, stroke, strokeWidth, fixed }: IRectangle & DrawOptions & DrawStrokeOptions) {
    this.ctx.save()
    this.ctx.beginPath()

    if (!fixed) this.applyViewCamera()

    this.ctx.rect(x, y, width, height)

    if (color) this.ctx.fillStyle = color

    if (stroke) {
      this.ctx.lineWidth = strokeWidth!
      this.ctx.strokeStyle = stroke
      this.ctx.stroke()
    }

    this.ctx.fill()
    this.ctx.restore()
  }

  drawCircle({ radius, x, y, color, stroke, strokeWidth, fixed }: ICircle & DrawOptions & DrawStrokeOptions) {
    this.ctx.save()
    this.ctx.beginPath()

    if (!fixed) this.applyViewCamera()

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

  drawImage({ image, x, y, width, height, fixed }: DrawImageOptions) {
    this.ctx.save()
    if (!fixed) this.applyViewCamera()
    this.ctx.drawImage(image, x, y, width, height)
    this.ctx.restore()
  }

  drawImageFrame({ image, x, y, imageX, imageY, imageWidth, imageHeight, width = imageWidth, height = imageHeight, fixed }: DrawImageFrameOptions) {
    this.ctx.save()
    if (!fixed) this.applyViewCamera()
    this.ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, x, y, width, height)
    this.ctx.restore()
  }

  drawText({ text, x, y, maxWidth, font, color, fixed }: DrawTextOptions) {
    this.ctx.save()
    if (!fixed) this.applyViewCamera()
    if (font) this.ctx.font = font
    if (color) this.ctx.fillStyle = color
    this.ctx.fillText(text, x, y, maxWidth)
    this.ctx.restore()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  applyViewCamera() {
    if (!this.cameraGameObject) { throw 'Camera Object not provider' }

    this.ctx.translate(
      (this.cameraGameObject.dimension.width / 2) - this.cameraGameObject.transform.position.x,
      (this.cameraGameObject.dimension.height / 2) - this.cameraGameObject.transform.position.y
    )
    this.scale(this.cameraGameObject.scale, this.cameraGameObject.scale)
  }

  scale(x: number, y: number) {
    this.ctx.scale(x, y)
  }
}
