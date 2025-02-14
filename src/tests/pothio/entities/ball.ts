import { CanvasRenderer, CircleGameObject, CircleSpriteComponent, DeltaTime, IVector2, MathHelper, Timeout } from '../../../index.js'

export class Ball extends CircleGameObject {

  private sprite: CircleSpriteComponent
  private timeLive = 1_000
  private speed = 400
  private angle: number

  constructor(
    private startPosition: IVector2,
    private positionReference: IVector2,
  ) {
    super()
  }

  start() {
    super.start()

    this.sprite = this.getComponent(CircleSpriteComponent)!

    this.sprite.color = 'yellow'
    this.sprite.shape.radius = 10

    this.transform.moveTo(this.startPosition)

    this.angle = MathHelper.angle(this.positionReference, this.startPosition)

    Timeout.setTimeout(() => {
      this.destroy()
    }, this.timeLive)
  }

  update(deltaTime: DeltaTime) {
    const offset = MathHelper.angleToVector2(this.angle, deltaTime.elapsedTimeSeconds * this.speed)

    this.transform.translate(offset)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)
  }
}
