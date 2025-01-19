import { DeltaTime, Timeout } from '../utils/index.js'
import { GameSystem } from './system.js'

export class TimeoutSystem extends GameSystem {

  start() {
    Timeout.clearTimeouts()
  }

  stop() {
    Timeout.clearTimeouts()
  }

  update(deltaTime: DeltaTime) {
    const timeouts = Timeout.getTimeouts()

    for (const [id, timeout] of timeouts) {
      timeout.update(deltaTime)

      if (timeout.isFinish) {
        Timeout.clearTimeout(id)
      }
    }
  }
}