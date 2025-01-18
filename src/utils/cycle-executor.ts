import { DeltaTime } from './delta-time.js'

export class CycleExecutor {

  private _animationFrame = 0
  private _isRunning = false
  private _deltaTime = new DeltaTime()

  get isRunning() { return this._isRunning }
  get deltaTime() { return this._deltaTime }

  protected reset() {
    this._animationFrame = 0
    this._isRunning = false
    this._deltaTime.reset()
  }

  runOneFrame() {
    this.start()
    this.stop()
  }

  start() {
    this.triggerStart()
  }

  protected triggerStart() {
    this.reset()
    this._isRunning = true
    this.nextFrame()
  }

  stop() {
    this.reset()
    cancelAnimationFrame(this._animationFrame)
  }

  protected nextFrame() {
    this._deltaTime.next()
    this.update(this._deltaTime)
    this.endFrame()
  }

  protected endFrame() {
    if (this._isRunning) {
      this._animationFrame = requestAnimationFrame(() => this.nextFrame())
    }
  }

  update(deltaTime: DeltaTime) { }
}