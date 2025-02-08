import { DeltaTime } from '../delta-time.js'
import { Random } from '../random.js'

export type TimeoutCallback = () => void

export class TimeoutHandler {

  readonly id = Random.uuidTime()

  private _isFinish = false
  private elapsed = 0

  get isFinish() { return this._isFinish }

  constructor(
    public readonly callback: TimeoutCallback,
    public delay: number,
    public readonly isRepeat = false
  ) { }

  update(deltaTime: DeltaTime) {
    this.elapsed += deltaTime.elapsedTimeMilliseconds

    if (this.elapsed < this.delay) {
      return
    }

    this.callback()

    if (this.isRepeat) {
      this.elapsed -= this.delay
    } else {
      this._isFinish = true
    }
  }
}
