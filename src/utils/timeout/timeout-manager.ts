import { DeltaTime } from '../delta-time.js'
import { Timeout, TimeoutHandler } from './timeout.js'

export class TimeoutManager {

  private timeouts = new Map<string, Timeout>()

  setTimeout(callback: TimeoutHandler, delay: number) {
    const timeout = new Timeout(callback, delay)

    this.addTimeout(timeout)

    return timeout.id
  }

  setInterval(callback: TimeoutHandler, delay: number) {
    const timeout = new Timeout(callback, delay, true)

    this.addTimeout(timeout)

    return timeout.id
  }

  clearTimeout(id: string) {
    return this.timeouts.delete(id)
  }

  update(deltaTime: DeltaTime) {
    for (const [id, timeout] of this.timeouts) {
      timeout.update(deltaTime)

      if (timeout.isFinish) {
        this.timeouts.delete(id)
      }
    }
  }

  private addTimeout(timeout: Timeout) {
    this.timeouts.set(timeout.id, timeout)
  }
}