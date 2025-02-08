import { TimeoutRepository } from '../../repositories/index.js'
import { TimeoutHandler, TimeoutCallback } from './timeout-handler.js'

export class Timeout {

  private static readonly timeoutRepository = new TimeoutRepository()

  static setTimeout(callback: TimeoutCallback, delay: number) {
    const timeout = new TimeoutHandler(callback, delay)

    Timeout.timeoutRepository.add(timeout)

    return timeout.id
  }

  static setInterval(callback: TimeoutCallback, delay: number) {
    const timeout = new TimeoutHandler(callback, delay, true)

    Timeout.timeoutRepository.add(timeout)

    return timeout.id
  }

  static clearTimeout(id: string) {
    return Timeout.timeoutRepository.remove(id)
  }

  static clearTimeouts() {
    Timeout.timeoutRepository.clear()
  }

  static getTimeouts() {
    return Timeout.timeoutRepository.getTimeouts()
  }

  static getTimeout(id: string) {
    return Timeout.timeoutRepository.getTimeout(id)
  }
}
