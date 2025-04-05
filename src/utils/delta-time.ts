export class DeltaTime {

  protected _lastTime: number
  protected _deltaTimeMilliseconds: number
  protected _timeMilliseconds: number

  get lastTime() { return this._lastTime }
  get deltaTimeMilliseconds() { return this._deltaTimeMilliseconds }
  get deltaTime() { return this._deltaTimeMilliseconds / 1_000 }
  get timeMilliseconds() { return this._timeMilliseconds }
  get time() { return this._timeMilliseconds / 1_000 }
  get fps() {
    const deltaTime = this.deltaTime

    return deltaTime > 0 ? Math.round(1 / deltaTime) : 0
  }

  constructor() {
    this.reset()
  }

  reset() {
    this._lastTime = this.performanceNow()
    this._deltaTimeMilliseconds = 0
    this._timeMilliseconds = 0
  }

  next() {
    const now = this.performanceNow()

    this._deltaTimeMilliseconds = now - this._lastTime
    this._timeMilliseconds += this._deltaTimeMilliseconds
    this._lastTime = now
  }

  performanceNow() {
    return performance.now()
  }

  toJSON() {
    return {
      lastTime: this.lastTime,
      deltaTimeMilliseconds: this.deltaTimeMilliseconds,
      deltaTime: this.deltaTime,
      time: this.time,
      timeMilliseconds: this.timeMilliseconds,
    }
  }
}
