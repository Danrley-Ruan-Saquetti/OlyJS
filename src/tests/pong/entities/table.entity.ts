import { CanvasRenderer, GameObject, RectangleShapeComponent, RectangleSpriteComponent } from '../../../index.js'

export class Table extends GameObject {

  body: RectangleSpriteComponent

  start(): void {
    super.start()

    this.body = new RectangleSpriteComponent(
      this,
      new RectangleShapeComponent(800, 400)
    )
    this.body.color = '#000'
  }

  render(canvasRenderer: CanvasRenderer) {
    this.body.render(canvasRenderer)

    canvasRenderer.drawRectangle({
      x: -5,
      y: -150,
      width: 10,
      height: 300,
      color: '#fff'
    })
  }
}