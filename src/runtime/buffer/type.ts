export interface IBuffer<T = any> {
  send(item: T): void
  flush(): T[]
  size(): number
}

export interface IDispatcher<T = any> {
  dispatch(item: T): void
}
