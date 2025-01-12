export class Timer {

  protected _lastElapsedTimeMilliseconds = 0
  protected _elapsedTimeMilliseconds = 0
  protected _totalElapsedTimeMilliseconds = 0

  get lastElapsedTimeMilliseconds() { return this._lastElapsedTimeMilliseconds }
  get elapsedTimeMilliseconds() { return this._elapsedTimeMilliseconds }
  get elapsedTimeSeconds() { return this._elapsedTimeMilliseconds / 1_000 }
  get totalElapsedTimeMilliseconds() { return this._totalElapsedTimeMilliseconds }
  get totalElapsedTimeSeconds() { return this._totalElapsedTimeMilliseconds / 1_000 }

  reset() {
    this._lastElapsedTimeMilliseconds = 0
    this._elapsedTimeMilliseconds = 0
    this._totalElapsedTimeMilliseconds = 0
  }

  next() {
    const current = performance.now()

    this._elapsedTimeMilliseconds = current - this._lastElapsedTimeMilliseconds
    this._totalElapsedTimeMilliseconds += this._elapsedTimeMilliseconds
    this._lastElapsedTimeMilliseconds = this._elapsedTimeMilliseconds
  }

  toJSON() {
    return {
      lastElapsedTimeMilliseconds: this.lastElapsedTimeMilliseconds,
      elapsedTimeMilliseconds: this.elapsedTimeMilliseconds,
      elapsedTimeSeconds: this.elapsedTimeSeconds,
      totalElapsedTimeMilliseconds: this.totalElapsedTimeMilliseconds,
      totalElapsedTimeSeconds: this.totalElapsedTimeSeconds,
    }
  }
}