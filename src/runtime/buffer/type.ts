export type StreamDataMap = Record<string | symbol, unknown>

export interface IBufferStream<StreamData extends StreamDataMap = {}> {
  send<E extends keyof StreamData>(key: E, data: StreamData[E]): void
  flush(): number
  getFlushedKey(index: number): keyof StreamData
  getFlushedData(index: number): StreamData[keyof StreamData]
}
