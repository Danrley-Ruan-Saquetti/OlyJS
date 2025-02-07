import { ImageSprite } from '../../../components/index.js'
import { GameObject } from '../../../entities/index.js'
import { CanvasRenderer, Timeout } from '../../../utils/index.js'

export class Player extends GameObject {

  body: ImageSprite

  private frames = [
    {
      origin: { x: 6, y: 554 },
      dimension: { width: 31, height: 90 },
    },
    {
      origin: { x: 73, y: 551 },
      dimension: { width: 31, height: 87 },
    },
    {
      origin: { x: 140, y: 551 },
      dimension: { width: 31, height: 87 },
    },
    {
      origin: { x: 203, y: 554 },
      dimension: { width: 37, height: 90 },
    },
    {
      origin: { x: 273, y: 554 },
      dimension: { width: 31, height: 90 },
    },
    {
      origin: { x: 340, y: 551 },
      dimension: { width: 31, height: 87 },
    },
  ]

  private frameIndex = -1

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

    this.toggleFrame()

    Timeout.setInterval(() => this.toggleFrame(), 200)

    this.addComponent(this.body)
  }

  toggleFrame() {
    this.frameIndex++

    if (this.frameIndex == this.frames.length) {
      this.frameIndex = 0
    }

    this.body.origin.x = this.frames[this.frameIndex].origin.x
    this.body.origin.y = this.frames[this.frameIndex].origin.y

    this.body.dimension.width = this.frames[this.frameIndex].dimension.width
    this.body.dimension.height = this.frames[this.frameIndex].dimension.height
  }

  render(canvasRenderer: CanvasRenderer) {
    this.body.renderFrame(canvasRenderer)
  }
}
