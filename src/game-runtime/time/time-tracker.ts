import { DeltaTime } from '../../contracts/engine/time'
import { ITimerTracker } from './types'

export class TimeTracker implements ITimerTracker {

  protected totalElapsedTime = 0
  protected deltaTime = 0

  protected _time: DeltaTime = {
    deltaTime: 0,
    deltaTimeMilliseconds: 0,
    totalElapsedTime: 0,
    totalElapsedTimeMilliseconds: 0
  }

  get time(): DeltaTime {
    return this._time
  }

  reset() {
    this.deltaTime = 0
    this.totalElapsedTime = 0
  }

  advance(milliseconds: number) {
    this.deltaTime = milliseconds
    this.totalElapsedTime += this.deltaTime

    this.updateState()
  }

  private updateState() {
    this._time.deltaTime = this.deltaTime / 1000
    this._time.deltaTimeMilliseconds = this.deltaTime
    this._time.totalElapsedTime = this.totalElapsedTime / 1000
    this._time.totalElapsedTimeMilliseconds = this.totalElapsedTime
  }

  getState(): DeltaTime {
    return this._time
  }
}
