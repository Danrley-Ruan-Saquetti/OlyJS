import { RectangleSpriteComponent, GameObject, CanvasRenderer, RectangleShapeComponent, DeltaTime } from '../../../index.js'

export class RacketPlayer extends GameObject {

  bodySprite: RectangleSpriteComponent
  speed = 150

  start() {
    super.start()

    this.bodySprite = new RectangleSpriteComponent(
      this,
      new RectangleShapeComponent(15, 80)
    )
    this.bodySprite.color = '#FFF'

    this.addComponent(this.bodySprite)
  }

  update(deltaTime: DeltaTime): void {
    this.move(deltaTime)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.bodySprite.render(canvasRenderer)
  }

  move(deltaTime: DeltaTime) { }
}