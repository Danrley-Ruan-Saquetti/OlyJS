import { CanvasRenderer, GameObject, IVector2, Random } from '../../../index.js'

export class FloorEntity extends GameObject {

  private particlesFloor: IVector2[] = []

  start(): void {
    super.start()

    this.particlesFloor = Array
      .from({ length: 200 })
      .map(() => ({
        x: Random.next(-2_000, 2_000),
        y: Random.next(-2_000, 2_000),
      }))
  }

  render(canvasRenderer: CanvasRenderer): void {
    this.particlesFloor.map(({ x, y }) => {
      canvasRenderer.drawRectangle({
        x,
        y,
        width: 5,
        height: 5,
        color: '#000'
      })
    })
  }
}
