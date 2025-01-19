import { CameraGameObject } from '../entities/index.js'
import { ContextRender2D, ICircle, IRectangle, IVector2 } from '../interfaces/index.js'

export type DrawOptions = IVector2 & {
  color?: string
  fixed?: boolean
}

export type DrawStrokeOptions = {
  stroke?: string
  strokeWidth?: number
} | {
  stroke: string
  strokeWidth: number
}

export type DrawImageOptions = Omit<DrawOptions, 'color'> & IRectangle & {
  image: HTMLImageElement
}

export type DrawImageFrameOptions = Omit<DrawOptions, 'color'> & Partial<IRectangle> & {
  image: HTMLImageElement
  imageX: number
  imageY: number
  imageWidth: number
  imageHeight: number
}

export type DrawTextOptions = DrawOptions & {
  text: string
  font?: string
  maxWidth?: number
}

export class CanvasRenderer {

  constructor(
    public readonly ctx: ContextRender2D,
    private readonly cameraGameObject?: CameraGameObject
  ) { }

  drawRectangle({ x, y, height, width, color, fixed }: IRectangle & DrawOptions) {
    this.ctx.save()
    this.ctx.beginPath()

    if (!fixed) this.applyViewCamera()

    this.ctx.rect(x, y, width, height)
    if (color) this.ctx.fillStyle = color
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
      this.cameraGameObject.transform.position.x,
      this.cameraGameObject.transform.position.y
    )
    this.ctx.scale(this.cameraGameObject.scale, this.cameraGameObject.scale)
  }
}