import { IBuffer } from './type'

export class DoubleBuffering<T = any> implements IBuffer<T> {

  private buffer: T[] = []
  private swap: T[] = []

  send(item: T) {
    this.buffer.push(item)
  }

  flush() {
    const temp = this.buffer
    this.buffer = this.swap
    this.swap = temp

    this.buffer.length = 0

    return this.swap
  }

  size() {
    return this.swap.length
  }
}
