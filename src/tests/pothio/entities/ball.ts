import { CanvasRenderer, RectangleGameObject, RectangleSpriteComponent, DeltaTime, IVector2, MathHelper, Timeout } from '../../../index.js'

export class Ball extends RectangleGameObject {

  get sprite() { return this.rectangleSpriteComponent }

  private timeLive = 1_200
  private speed = 700
  private angle: number

  private idTimeout: string

  constructor(
    private startPosition: IVector2,
    private positionReference: IVector2,
  ) {
    super()
  }

  start() {
    super.start()

    this.rectangleSpriteComponent.color = 'yellow'
    this.rectangleSpriteComponent.shape.width = 25
    this.rectangleSpriteComponent.shape.height = 25

    this.transform.moveTo(this.startPosition)

    this.angle = MathHelper.angle(this.positionReference, this.startPosition)

    this.idTimeout = Timeout.setTimeout(() => {
      this.destroy()
    }, this.timeLive)
  }

  update(deltaTime: DeltaTime) {
    const offset = MathHelper.angleToVector2(this.angle, deltaTime.elapsedTimeSeconds * this.speed)

    this.transform.translate(offset)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.rectangleSpriteComponent.render(canvasRenderer)
  }

  onDestroy() {
    Timeout.clearTimeout(this.idTimeout)
  }
}
