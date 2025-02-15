import { CanvasRenderer, GameObject, IVector2, Random } from '../../../index.js'

export class Floor extends GameObject {

  private grass: IVector2[] = []

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    super()
  }

  start() {
    super.start()

    this.grass = Array.from({ length: 1_000 }).map(() => ({
      x: Random.next(-10_000, 10_000),
      y: Random.next(-10_000, 10_000),
    }))
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

    this.grass.map(({ x, y }) => {
      canvasRenderer.drawRectangle({
        x,
        y,
        width: 10,
        height: 10,
        color: '#fff8'
      })
    })
  }
}
