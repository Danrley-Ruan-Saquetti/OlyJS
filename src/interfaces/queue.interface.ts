export interface IQueue<T = any> {
  enqueue(item: T): void
  dequeue(): T | null
  clear(): void
  iterator(): Generator<T, void, unknown>
}
