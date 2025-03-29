import { IQueue } from '../interfaces/index.js'

export class Queue<T = any> implements IQueue<T> {

  private items: T[] = []

  get size() { return this.items.length }

  enqueue(item: T) {
    this.items.push(item)
  }

  dequeue() {
    return this.items.shift() || null
  }

  clear() {
    this.items = []
  }

  *toIterator() {
    while (this.items.length) {
      yield this.dequeue()!
    }
  }
}
