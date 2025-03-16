export class Queue<T = any> {

  private items: T[] = []

  enqueue(item: T) {
    this.items.push(item)
  }

  dequeue() {
    return this.items.shift()
  }

  clear() {
    this.items = []
  }

  *iterator() {
    while (this.items.length) {
      yield this.dequeue()
    }
  }
}
