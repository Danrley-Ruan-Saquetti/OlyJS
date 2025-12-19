import { ITimer } from '@engine/time/types'
import { DeltaTime } from '@runtime/contracts/time'

export class Clock implements ITimer {

  protected lastTime = 0
  protected totalElapsedTime = 0
  protected deltaTime = 0

  protected _time: DeltaTime = {
    deltaTime: 0,
    deltaTimeSeconds: 0,
    totalElapsedTime: 0,
  }

  get time(): DeltaTime {
    return this._time
  }

  constructor() {
    this.lastTime = performance.now()
  }

  reset() {
    this.lastTime = performance.now()
    this.totalElapsedTime = 0
  }

  tick() {
    const currentTime = performance.now()

    this.deltaTime = currentTime - this.lastTime
    this.totalElapsedTime += this.deltaTime
    this.lastTime = currentTime

    this.updateState()
  }

  private updateState() {
    this._time.deltaTime = this.deltaTime
    this._time.deltaTimeSeconds = this.deltaTime / 1000
    this._time.totalElapsedTime = this.totalElapsedTime
  }

  getState(): DeltaTime {
    return this._time
  }
}
