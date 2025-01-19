import { CanvasRenderer } from '../../utils/index.js'
import { SpriteComponent } from './sprite.js'

export class TextSprite extends SpriteComponent {

  text = ''
  font?: string
  maxWidth?: number

  render(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawText({
      text: this.text,
      x: this.gameObject.transform.position.x + this.offset.x,
      y: this.gameObject.transform.position.y + this.offset.y,
      color: this.color,
      font: this.font,
      fixed: this.fixed,
      maxWidth: this.maxWidth,
    })
  }
}