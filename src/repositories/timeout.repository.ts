import { TimeoutHandler } from '../utils/index.js'

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

  getTimeout(id: string) {
    return this.timeouts.get(id)
  }

  getTimeouts() {
    return this.timeouts
  }
}
