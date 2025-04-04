import { IRectangle } from '../../interfaces/index.js'
import { CanvasRenderer } from '../../utils/index.js'
import { RendererComponent } from './renderer.component.js'

export class RectangleComponent extends RendererComponent implements IRectangle {

  width = 50
  height = 50

  draw(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawRectangle({
      x: this.gameObject.transform.position.x,
      y: this.gameObject.transform.position.y,
      width: this.width * this.gameObject.transform.scale.x,
      height: this.height * this.gameObject.transform.scale.y,
      color: this.color,
      fixed: this.fixed,
    })
  }
}
