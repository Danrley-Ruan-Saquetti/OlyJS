import { RectangleSpriteComponent, RectangleGameObject, CanvasRenderer, DeltaTime } from '../../../index.js'

export class RacketPlayer extends RectangleGameObject {

  bodySprite: RectangleSpriteComponent
  speed = 150

  start() {
    super.start()

    this.bodySprite = this.getComponent(RectangleSpriteComponent)!

    this.bodySprite.shape.width = 15
    this.bodySprite.shape.height = 80
    this.bodySprite.color = '#FFF'
  }

  update(deltaTime: DeltaTime): void {
    this.move(deltaTime)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.bodySprite.render(canvasRenderer)
  }

  move(deltaTime: DeltaTime) { }
}