import { ImageSprite } from '../../../components/index.js'
import { GameObject } from '../../../entities/index.js'
import { CanvasRenderer } from '../../../utils/canvas-renderer.js'

export class Player extends GameObject {

  body: ImageSprite

  constructor(
    public spriteImage: HTMLImageElement
  ) {
    super()
  }

  start() {
    super.start()

    this.body = new ImageSprite(
      this,
      this.spriteImage
    )

    this.addComponent(this.body)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.body.render(canvasRenderer)
  }
}