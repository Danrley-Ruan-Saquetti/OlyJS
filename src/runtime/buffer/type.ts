import { EventMap } from '../contracts/event'

export type StreamDataMap = EventMap

export interface IBufferStream {
  send(key: string, data: unknown): void
  flush(): number
  getFlushedKey(index: number): string
  getFlushedData(index: number): unknown
}
