import { CompareToHandler, IPriorityQueue } from './priority-queue'

export class MinHeap<T = any> implements IPriorityQueue<T> {

  private data: T[] = []

  get size() {
    return this.data.length
  }

  constructor(
    private readonly compare: CompareToHandler<T> = MinHeap.defaultCompareHandler<T>
  ) { }

  private static defaultCompareHandler<T = any>(ref1: T, ref2: T) {
    return ref1 < ref2 ? -1 : ref1 > ref2 ? 1 : 0
  }

  insert(value: T) {
    this.data.push(value)
    this.bubbleUp(this.data.length - 1)
  }

  removeMin() {
    if (this.data.length === 0) return undefined as any as T
    if (this.data.length === 1) return this.data.pop()!

    const root = this.data[0]

    this.data[0] = this.data.pop()!
    this.bubbleDown(0)

    return root
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parent = (index - 1) >> 1

      if (this.compare(this.data[index], this.data[parent]) >= 0) {
        break
      }

      const temp = this.data[index]
      this.data[index] = this.data[parent]
      this.data[parent] = temp

      index = parent
    }
  }

  private bubbleDown(index: number) {
    const length = this.data.length

    while (true) {
      let smallest = index
      const left = index * 2 + 1
      const right = left + 1

      if (left < length && this.compare(this.data[left], this.data[smallest]) < 0) {
        smallest = left
      }

      if (right < length && this.compare(this.data[right], this.data[smallest]) < 0) {
        smallest = right
      }

      if (smallest == index) {
        break
      }

      const temp = this.data[index]
      this.data[index] = this.data[smallest]
      this.data[smallest] = temp

      index = smallest
    }
  }

  min() {
    return this.data[0]
  }

  isEmpty() {
    return this.data.length == 0
  }

  clear() {
    this.data.length = 0
  }
}
