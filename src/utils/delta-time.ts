export class DeltaTime {

  private _lastFrameTime = 0
  private _deltaTime = 0
  private _deltaTimeTotal = 0

  get deltaTimeMilliseconds() { return this._deltaTime }
  get deltaTimeSeconds() { return this._deltaTime / 1_000 }
  get deltaTimeTotalMilliseconds() { return this._deltaTimeTotal }
  get deltaTimeTotalSeconds() { return this._deltaTimeTotal / 1_000 }
  get FPS() {
    const deltaTimeSeconds = this.deltaTimeSeconds
    return deltaTimeSeconds > 0 ? Math.round(1 / deltaTimeSeconds) : 0
  }

  start() {
    this._deltaTime = performance.now()
    this._deltaTimeTotal = 0
  }

  calculate() {
    const current = performance.now()

    this._deltaTime = current - this._lastFrameTime
    this._deltaTimeTotal += this._deltaTime
    this._lastFrameTime = current
  }
}