import { IQueue } from '../interfaces/index.js'

export class Queue<T = any> implements IQueue<T> {

  private items: T[] = []

  enqueue(item: T) {
    this.items.push(item)
  }

  dequeue() {
    return this.items.shift() || null
  }

  clear() {
    this.items = []
  }

  *iterator() {
    while (this.items.length) {
      yield this.dequeue()!
    }
  }
}
