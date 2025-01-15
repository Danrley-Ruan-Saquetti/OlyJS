import { ImageSprite } from '../../../components/index.js'
import { GameObject } from '../../../entities/index.js'
import { CanvasRenderer } from '../../../utils/index.js'

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

    this.body.origin.x = 196.5
    this.body.origin.y = 110

    this.body.dimension.width = 50
    this.body.dimension.height = 100

    this.addComponent(this.body)
  }

  render(canvasRenderer: CanvasRenderer) {
    this.body.renderFrame(canvasRenderer)
  }
}