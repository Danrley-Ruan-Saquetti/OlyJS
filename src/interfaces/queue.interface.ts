export interface IQueue<T = any> {
  readonly size: number

  enqueue(item: T): void
  dequeue(): T | null
  clear(): void
  toIterator(): Generator<T, void, unknown>
}
