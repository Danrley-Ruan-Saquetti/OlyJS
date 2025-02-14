import { CanvasRenderer, DeltaTime, GameObject, MathHelper, Random, RectangleGameObject, RectangleSpriteComponent } from '../../../index.js'

export class Enemy extends RectangleGameObject {

  private sprite: RectangleSpriteComponent
  private speed = 100

  constructor(
    private ref: GameObject
  ) {
    super()
  }

  start() {
    super.start()

    this.sprite = this.getComponent(RectangleSpriteComponent)!

    this.sprite.color = '#FF0000'

    this.transform.moveTo({
      x: Random.next(-1_000, 1_000),
      y: Random.next(-1_000, 1_000),
    })
  }

  update(deltaTime: DeltaTime) {
    const angle = MathHelper.angle(this.ref.transform.position, this.transform.position)

    const offset = MathHelper.angleToVector2(angle, deltaTime.elapsedTimeSeconds * this.speed)

    this.transform.translate(offset)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)
  }
}
