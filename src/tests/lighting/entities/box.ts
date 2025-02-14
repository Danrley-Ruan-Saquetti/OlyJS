import { CanvasRenderer, DeltaTime, Input, IVector2, Random, RectangleGameObject, RectangleSpriteComponent } from '../../../index.js'

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
      x: (Input.mouse.position.x - this.transform.position.x) * deltaTime.elapsedTimeSeconds * this.speed,
      y: (Input.mouse.position.y - this.transform.position.y) * deltaTime.elapsedTimeSeconds * this.speed,
    })
  }

  checkCollision(target: IVector2) {
    const bounds = this.getBounds()

    return target.x >= bounds.x
      && target.x <= bounds.endX
      && target.y >= bounds.y
      && target.y <= bounds.endY
  }

  getBounds() {
    return {
      x: this.transform.position.x - (this.sprite.shape.width / 2),
      y: this.transform.position.y - (this.sprite.shape.height / 2),
      endX: this.transform.position.x + (this.sprite.shape.width / 2),
      endY: this.transform.position.y + (this.sprite.shape.height / 2),
    }
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)
  }
}
