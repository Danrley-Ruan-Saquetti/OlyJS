import { CanvasRenderer, GameObject } from '../../../index.js'

export class Floor extends GameObject {

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    super()
  }

  render(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawRectangle({
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      color: '#000',
      fixed: true,
    })
  }
}
