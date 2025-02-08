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
  runOnStart?: boolean
}

export class StateAnimation {

  readonly key: string
  private frames: IFrameState[]
  private sprite: ImageSprite
  private _delay: number
  private isRepeat: boolean
  private runOnStart: boolean

  private currentFrameIndex = 0
  private currentFrame: IFrameState

  private idTimeout: string

  set delay(value: number) {
    this._delay = value

    const timeoutHandler = Timeout.getTimeout(this.idTimeout)

    if (timeoutHandler) {
      timeoutHandler.delay = value
    }
  }

  constructor({ key, frames, sprite, delay, isRepeat = false, runOnStart = false }: StateAnimationArgs) {
    this.key = key
    this.frames = frames
    this.sprite = sprite
    this._delay = delay
    this.isRepeat = isRepeat
    this.runOnStart = runOnStart
  }

  start() {
    this.idTimeout = Timeout.setInterval(() => this.nextFrame(), this._delay)

    if (this.runOnStart) {
      this.nextFrame()
    }
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
