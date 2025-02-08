import { ImageSprite } from '../../components/index.js'
import { IRectangle, IVector2 } from '../../interfaces/index.js'
import { Timeout } from '../timeout/timeout.js'

export type IFrameState = {
  origin: IVector2
  dimension: IRectangle
}

export type StateAnimationArgs = {
  key: string
  frames: IFrameState[]
  sprite: ImageSprite
  delay: number
  isRepeat?: boolean
}

export class StateAnimation {

  readonly key: string
  private frames: IFrameState[]
  private sprite: ImageSprite
  private delay: number
  private isRepeat: boolean

  private currentFrameIndex = 0
  private currentFrame: IFrameState

  private idTimeout: string

  constructor({ key, frames, sprite, delay, isRepeat = false }: StateAnimationArgs) {
    this.key = key
    this.frames = frames
    this.sprite = sprite
    this.delay = delay
    this.isRepeat = isRepeat
  }

  start() {
    this.idTimeout = Timeout.setInterval(() => this.nextFrame(), this.delay)
  }

  stop() {
    Timeout.clearTimeout(this.idTimeout)
  }

  private nextFrame() {
    this.loadNextIndex()

    this.currentFrame = this.frames[this.currentFrameIndex]

    this.sprite.origin.x = this.currentFrame.origin.x
    this.sprite.origin.y = this.currentFrame.origin.y

    this.sprite.dimension.width = this.currentFrame.dimension.width
    this.sprite.dimension.height = this.currentFrame.dimension.height
  }

  private loadNextIndex() {
    if (this.currentFrameIndex == this.frames.length - 1) {
      if (!this.isRepeat) {
        return this.stop()
      }

      this.currentFrameIndex = -1
    }

    this.currentFrameIndex++
  }

  getCurrentFrame() {
    return this.currentFrame
  }
}
