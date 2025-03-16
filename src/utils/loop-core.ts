import { DeltaTime } from './delta-time.js'

export class LoopCore {

  private animationFrame: number
  readonly deltaTime = new DeltaTime()

  protected _isRunning = false

  start() {
    this._isRunning = true
    this.runFrame()
  }

  reset() {
    this.deltaTime.reset()
  }

  stop() {
    this._isRunning = false
    cancelAnimationFrame(this.animationFrame)
  }

  protected runFrame() {
    this.deltaTime.next()
    this.updateBefore()
    this.update()
    this.updateAfter()
    this.endFrame()
    this.animationFrame = requestAnimationFrame(() => this.runFrame())
  }

  updateBefore() { }
  update() { }
  updateAfter() { }
  endFrame() { }

  isRunning() {
    return this._isRunning
  }
}
