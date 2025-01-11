import { ContextRender2D, IRectangle, IVector2 } from '../interfaces/index.js'

export class CanvasRenderer {

  constructor(
    public readonly ctx: ContextRender2D
  ) { }

  drawRectangle({ x, y, height, width, color }: IVector2 & IRectangle & { color?: string }) {
    this.ctx.beginPath()
    this.ctx.rect(x, y, width, height)
    if (color) this.ctx.fillStyle = color
    this.ctx.fill()
  }
}