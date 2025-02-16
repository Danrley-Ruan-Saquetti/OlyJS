import { CanvasRenderer, DeltaTime, Random, RectangleGameObject } from '../../../index.js'

export class Coin extends RectangleGameObject {

  private alphaMove = Random.next(0, 50)
  private direction = -1

  private speed = 20

  start() {
    super.start()

    this.transform.moveTo({
      x: Random.next(-1_000, 1_000),
      y: Random.next(-1_000, 1_000),
    })

    this.rectangleSpriteComponent.color = '#4d6dff'
    this.rectangleSpriteComponent.shape.width = 10
    this.rectangleSpriteComponent.shape.height = 20
  }

  update(deltaTime: DeltaTime) {
    this.rectangleSpriteComponent.offset.y += this.direction * this.speed * deltaTime.elapsedTimeSeconds

    this.alphaMove++

    if (this.alphaMove >= 50) {
      this.alphaMove = 0
      this.direction *= -1
    }
  }

  render(canvasRenderer: CanvasRenderer) {
    this.rectangleSpriteComponent.render(canvasRenderer)
  }
}
