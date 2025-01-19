import { TimeoutHandler, TimeoutCallback } from '../utils/index.js'

export class TimeoutRepository {

  private timeouts = new Map<string, TimeoutHandler>()

  remove(id: string) {
    return this.timeouts.delete(id)
  }

  add(timeout: TimeoutHandler) {
    this.timeouts.set(timeout.id, timeout)
  }

  clear() {
    this.timeouts.clear()
  }

  getTimeouts() {
    return this.timeouts
  }
}