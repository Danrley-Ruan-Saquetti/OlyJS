import { IQueue } from '../interfaces/index.js'

export class NodeLinkedQueue<T = any> {

  constructor(public value: T, public next: NodeLinkedQueue<T> = null!) { }
}

export class LinkedQueue<T = any> implements IQueue<T> {

  private head: NodeLinkedQueue<T>
  private tail: NodeLinkedQueue<T>

  enqueue(value: T) {
    const newNode = new NodeLinkedQueue(value)

    if (!this.tail) {
      this.head = this.tail = newNode
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }
  }

  dequeue() {
    if (!this.head) {
      return null
    }

    const value = this.head.value
    this.head = this.head.next

    if (!this.head) {
      this.tail = null!
    }

    return value
  }

  clear() {
    this.head = null!
    this.tail = null!
  }

  *iterator() {
    while (this.head) {
      yield this.dequeue()
    }
  }
}
