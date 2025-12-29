export type MapKey = Record<string, unknown>

export interface IBufferSender {
  send(key: string, data: unknown): void
}

export interface IBufferStream extends IBufferSender {
  flush(): number
  getFlushedKey(index: number): string
  getFlushedData(index: number): unknown
}

export interface IDispatcher {
  dispatch(key: string, data: unknown): void
}
