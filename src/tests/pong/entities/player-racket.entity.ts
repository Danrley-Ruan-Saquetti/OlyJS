import { RectangleSpriteComponent, GameObject, CanvasRenderer, RectangleShapeComponent } from '../../../index.js'

export class RacketPlayer extends GameObject {

  bodySprite: RectangleSpriteComponent

  start() {
    super.start()

    this.bodySprite = new RectangleSpriteComponent(
      this,
      new RectangleShapeComponent(5, 20)
    )
    this.bodySprite.color = '#FFF'

    this.addComponent(this.bodySprite)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.bodySprite.render(canvasRenderer)
  }
}