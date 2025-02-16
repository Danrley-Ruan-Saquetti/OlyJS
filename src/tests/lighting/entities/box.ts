import { CanvasRenderer, DeltaTime, InputState, IVector2, Random, RectangleGameObject, RectangleSpriteComponent } from '../../../index.js'

export class Box extends RectangleGameObject {

  sprite: RectangleSpriteComponent
  speed = 7

  start() {
    super.start()

    this.sprite = this.getComponent(RectangleSpriteComponent)!

    this.sprite.shape.width = 70
    this.sprite.shape.height = 70

    this.transform.moveTo({
      x: Random.next(-300, 300),
      y: Random.next(-300, 300),
    })
  }

  dragging(deltaTime: DeltaTime) {
    this.transform.translate({
      x: (InputState.position.x - this.transform.position.x) * deltaTime.elapsedTimeSeconds * this.speed,
      y: (InputState.position.y - this.transform.position.y) * deltaTime.elapsedTimeSeconds * this.speed,
    })
  }

  checkCollision(target: IVector2) {
    const bounds = this.getBounds()

    return target.x >= bounds.left
      && target.x <= bounds.right
      && target.y >= bounds.top
      && target.y <= bounds.down
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)
  }
}
