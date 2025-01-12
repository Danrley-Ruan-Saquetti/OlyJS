import { GameObject, CircleSpriteComponent, CircleShapeComponent, CanvasRenderer } from '../../../index.js'

export class Ball extends GameObject {

  body: CircleSpriteComponent

  start(): void {
    super.start()

    this.body = new CircleSpriteComponent(
      this,
      new CircleShapeComponent(15)
    )
    this.body.color = 'yellow'

    this.addComponent(this.body)
  }

  render(canvasRenderer: CanvasRenderer): void {
    this.body.render(canvasRenderer)
  }
}